import { Router, type Request } from "express";
import { db, recentWorkTable, insertRecentWorkSchema, updateRecentWorkSchema, loginAttemptsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

// Sessions are a signed cookie holding the login timestamp — no server-side
// store. Signing (via cookie-parser + SESSION_SECRET) proves the cookie was
// issued by this server and wasn't tampered with; the embedded timestamp
// enforces expiry. This works identically across separate serverless
// invocations, unlike an in-memory session map.
const SESSION_COOKIE = "portal_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  signed: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

function isAuthenticated(req: Request): boolean {
  const issuedAtRaw = req.signedCookies?.[SESSION_COOKIE] as string | undefined;
  if (!issuedAtRaw) return false;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  const now = Date.now();
  // Reject timestamps in the future — a valid signature only proves the
  // cookie was issued by us, not that `issuedAt` is sane, and without this
  // check a future-dated value would never expire.
  if (issuedAt > now) return false;
  return now - issuedAt < SESSION_TTL_MS;
}

// Rate-limit configuration for failed login attempts.
// Tracked in Postgres so it survives serverless cold starts.
//
// Policy: allow MAX_ATTEMPTS failures within a rolling WINDOW; the next
// request after MAX_ATTEMPTS failures receives 429. The lockout lifts when
// the window expires (WINDOW_MS after the first failure in the current run).
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15-minute window

/**
 * Atomically records a failed login attempt for the given IP and returns
 * whether the IP should now be blocked (i.e. has exceeded MAX_ATTEMPTS).
 *
 * Uses a single INSERT … ON CONFLICT DO UPDATE statement. Postgres serialises
 * all conflicting updates to the same row internally, so concurrent first-
 * failures never race: one INSERT wins (count=1), and each other request's
 * INSERT becomes an UPDATE that increments the same counter atomically —
 * no lost updates, no transaction needed.
 *
 * Window logic is embedded in the CASE expressions so the reset is also
 * atomic; there is no separate SELECT before the write.
 *
 * Threshold semantics: the first MAX_ATTEMPTS failures return false (caller
 * sends 401); the (MAX_ATTEMPTS + 1)th failure and beyond return true
 * (caller sends 429).
 */
async function recordFailureAndIsRateLimited(ip: string): Promise<boolean> {
  const now = new Date();
  // Seconds as an integer literal for the Postgres INTERVAL expression.
  const windowSecs = Math.floor(RATE_LIMIT_WINDOW_MS / 1000);

  // Single atomic statement. In ON CONFLICT DO UPDATE SET, bare column
  // names in CASE expressions refer to the existing row (pre-update) values,
  // which is what we want for the conditional increment.
  const [row] = await db
    .insert(loginAttemptsTable)
    .values({ ip, count: 1, windowStart: now, lastAttempt: now })
    .onConflictDoUpdate({
      target: loginAttemptsTable.ip,
      set: {
        // Reset count to 1 if the window has expired; otherwise increment.
        count: sql`CASE
          WHEN login_attempts.window_start < NOW() - (${windowSecs} * INTERVAL '1 second')
          THEN 1
          ELSE login_attempts.count + 1
        END`,
        // Restart the window timestamp on reset; keep it on increment.
        windowStart: sql`CASE
          WHEN login_attempts.window_start < NOW() - (${windowSecs} * INTERVAL '1 second')
          THEN NOW()
          ELSE login_attempts.window_start
        END`,
        lastAttempt: now,
      },
    })
    .returning({ count: loginAttemptsTable.count });

  const count = row?.count ?? 1;
  return count > RATE_LIMIT_MAX_ATTEMPTS;
}

async function clearLoginAttempts(ip: string): Promise<void> {
  await db.delete(loginAttemptsTable).where(eq(loginAttemptsTable.ip, ip));
}

// POST /api/portal/login
router.post("/portal/login", async (req, res) => {
  const { password } = req.body as { password?: string };
  const portalPassword = process.env.PORTAL_PASSWORD;

  if (!portalPassword) {
    res.status(500).json({ error: "Portal password not configured" });
    return;
  }

  // req.ip is set correctly by Express when app.set("trust proxy", 1) is
  // configured in app.ts. That setting instructs Express to read the
  // leftmost entry of X-Forwarded-For as the real client IP — the same entry
  // that Vercel's edge and Replit's dev proxy populate — without blindly
  // trusting arbitrary caller-supplied header values.
  const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";

  if (!password || password !== portalPassword) {
    let limited = false;
    try {
      limited = await recordFailureAndIsRateLimited(ip);
    } catch (err) {
      // Never let a rate-limit DB error block the response — log and continue.
      req.log.error({ err }, "Portal: failed to record login attempt");
    }

    if (limited) {
      res.status(429).json({
        error: "Too many failed login attempts. Please try again later.",
      });
      return;
    }

    res.status(401).json({ error: "Invalid password" });
    return;
  }

  // Correct password — clear any accumulated failure counter.
  try {
    await clearLoginAttempts(ip);
  } catch (err) {
    req.log.error({ err }, "Portal: failed to clear login attempts");
  }

  res.cookie(SESSION_COOKIE, String(Date.now()), {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: SESSION_TTL_MS,
  });

  res.json({ ok: true });
});

// POST /api/portal/logout
router.post("/portal/logout", (req, res) => {
  // clearCookie must be called with the same attributes used when the
  // cookie was set (path/sameSite/secure), otherwise browsers will not
  // recognize it as the same cookie and won't delete it.
  res.clearCookie(SESSION_COOKIE, SESSION_COOKIE_OPTIONS);
  res.json({ ok: true });
});

// GET /api/portal/auth — check session
router.get("/portal/auth", (req, res) => {
  res.json({ authenticated: isAuthenticated(req) });
});

// All routes below require auth
router.use("/portal", (req, res, next) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

// GET /api/portal/recent-work — all entries for management
router.get("/portal/recent-work", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(recentWorkTable)
      .orderBy(desc(recentWorkTable.dateAdded));
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Portal: failed to fetch recent work");
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// POST /api/portal/recent-work — create
router.post("/portal/recent-work", async (req, res) => {
  const parsed = insertRecentWorkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  try {
    const [item] = await db.insert(recentWorkTable).values(parsed.data).returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Portal: failed to create recent work");
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// PATCH /api/portal/recent-work/:id — update
router.patch("/portal/recent-work/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = updateRecentWorkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  try {
    const [item] = await db
      .update(recentWorkTable)
      .set(parsed.data)
      .where(eq(recentWorkTable.id, id))
      .returning();

    if (!item) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Portal: failed to update recent work");
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// DELETE /api/portal/recent-work/:id
router.delete("/portal/recent-work/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const [item] = await db
      .delete(recentWorkTable)
      .where(eq(recentWorkTable.id, id))
      .returning();

    if (!item) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Portal: failed to delete recent work");
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default router;

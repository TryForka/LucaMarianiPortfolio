import { Router, type Request } from "express";
import { db, recentWorkTable, insertRecentWorkSchema, updateRecentWorkSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// ── Session store ─────────────────────────────────────────────────────────────
const sessions = new Map<string, { createdAt: number }>();
const SESSION_COOKIE = "portal_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

// ── Rate limiter (5 failures per IP → 15 min lockout) ────────────────────────
type RateEntry = { count: number; lockedUntil: number };
const loginAttempts = new Map<string, RateEntry>();

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress ?? "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return { allowed: true };
  if (entry.lockedUntil > now) {
    return { allowed: false, retryAfterMs: entry.lockedUntil - now };
  }
  // Lock expired — reset
  if (entry.count >= 5 && entry.lockedUntil <= now) {
    loginAttempts.delete(ip);
  }
  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= 5) {
    entry.lockedUntil = now + 15 * 60 * 1000; // 15 min
  }
  loginAttempts.set(ip, entry);
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// ── Auth helpers ──────────────────────────────────────────────────────────────
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function isAuthenticated(req: Request): boolean {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return false;
  }
  return true;
}

// ── POST /api/portal/login ────────────────────────────────────────────────────
router.post("/portal/login", (req, res) => {
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = checkRateLimit(ip);

  if (!allowed) {
    const mins = Math.ceil((retryAfterMs ?? 0) / 60000);
    res.status(429).json({ error: `Too many attempts. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.` });
    return;
  }

  const { password } = req.body as { password?: string };
  const portalPassword = process.env.PORTAL_PASSWORD;

  if (!portalPassword) {
    res.status(500).json({ error: "Portal password not configured" });
    return;
  }

  if (!password || password !== portalPassword) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  clearAttempts(ip);
  const token = generateToken();
  sessions.set(token, { createdAt: Date.now() });

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_TTL_MS,
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ ok: true });
});

// ── POST /api/portal/logout ───────────────────────────────────────────────────
router.post("/portal/logout", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (token) sessions.delete(token);
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

// ── GET /api/portal/auth ─────────────────────────────────────────────────────
router.get("/portal/auth", (req, res) => {
  res.json({ authenticated: isAuthenticated(req) });
});

// ── Auth middleware for all /portal/* data routes ─────────────────────────────
router.use("/portal", (req, res, next) => {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
});

// ── GET /api/portal/recent-work ──────────────────────────────────────────────
router.get("/portal/recent-work", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(recentWorkTable)
      .orderBy(desc(recentWorkTable.dateAdded));
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Portal: failed to fetch");
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// ── POST /api/portal/recent-work ─────────────────────────────────────────────
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
    req.log.error({ err }, "Portal: failed to create");
    res.status(500).json({ error: "Failed to create entry" });
  }
});

// ── PATCH /api/portal/recent-work/:id ────────────────────────────────────────
router.patch("/portal/recent-work/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

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
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json(item);
  } catch (err) {
    req.log.error({ err }, "Portal: failed to update");
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// ── DELETE /api/portal/recent-work/:id ───────────────────────────────────────
router.delete("/portal/recent-work/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  try {
    const [item] = await db
      .delete(recentWorkTable)
      .where(eq(recentWorkTable.id, id))
      .returning();
    if (!item) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Portal: failed to delete");
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default router;

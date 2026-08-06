import { Router, type Request } from "express";
import { db, recentWorkTable, insertRecentWorkSchema, updateRecentWorkSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

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

// POST /api/portal/login
router.post("/portal/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const portalPassword = process.env.PORTAL_PASSWORD;

  if (!portalPassword) {
    res.status(500).json({ error: "Portal password not configured" });
    return;
  }

  if (!password || password !== portalPassword) {
    res.status(401).json({ error: "Invalid password" });
    return;
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

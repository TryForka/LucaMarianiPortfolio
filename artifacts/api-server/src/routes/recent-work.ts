import { Router } from "express";
import { db, recentWorkTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

// Public: active items for the homepage carousel
router.get("/recent-work", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(recentWorkTable)
      .where(eq(recentWorkTable.active, true))
      .orderBy(desc(recentWorkTable.dateAdded))
      .limit(10);

    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch recent work");
    res.status(500).json({ error: "Failed to fetch recent work" });
  }
});

// Public: all photos for the photography page
router.get("/photos", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(recentWorkTable)
      .where(eq(recentWorkTable.type, "photo"))
      .orderBy(desc(recentWorkTable.dateAdded));

    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch photos");
    res.status(500).json({ error: "Failed to fetch photos" });
  }
});

// Public: all videos for the videography page
router.get("/videos", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(recentWorkTable)
      .where(eq(recentWorkTable.type, "video"))
      .orderBy(desc(recentWorkTable.dateAdded));

    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch videos");
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

export default router;

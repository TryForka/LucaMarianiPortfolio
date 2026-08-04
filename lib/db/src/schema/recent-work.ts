import { pgTable, serial, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const recentWorkTypeEnum = pgEnum("recent_work_type", ["photo", "video"]);
export const recentWorkCategoryEnum = pgEnum("recent_work_category", [
  "Music",
  "Sports",
  "Hospitality & Events",
]);

export const recentWorkTable = pgTable("recent_work", {
  id: serial("id").primaryKey(),
  type: recentWorkTypeEnum("type").notNull(),
  embedUrl: text("embed_url").notNull(),
  title: text("title").notNull(),
  category: recentWorkCategoryEnum("category").notNull(),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});

export const insertRecentWorkSchema = createInsertSchema(recentWorkTable).omit({ id: true, dateAdded: true });
export const updateRecentWorkSchema = insertRecentWorkSchema.partial();

export type InsertRecentWork = z.infer<typeof insertRecentWorkSchema>;
export type UpdateRecentWork = z.infer<typeof updateRecentWorkSchema>;
export type RecentWork = typeof recentWorkTable.$inferSelect;

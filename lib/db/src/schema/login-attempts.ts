import { pgTable, serial, text, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// Tracks failed portal login attempts per IP for rate limiting.
// Works across serverless cold starts because it lives in Postgres.
export const loginAttemptsTable = pgTable(
  "login_attempts",
  {
    id: serial("id").primaryKey(),
    // One row per IP address — enforced by the unique index below.
    ip: text("ip").notNull(),
    // Number of failed attempts in the current window.
    count: integer("count").notNull().default(1),
    // When the current window started (i.e. first failure in this run).
    windowStart: timestamp("window_start", { withTimezone: true })
      .notNull()
      .defaultNow(),
    // Convenience column: last failure time, for debugging.
    lastAttempt: timestamp("last_attempt", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("login_attempts_ip_idx").on(t.ip)],
);

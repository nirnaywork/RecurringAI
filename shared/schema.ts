import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  analysisStatus: varchar("analysis_status").notNull().default("pending"), // pending, processing, completed, failed
  analysisResults: jsonb("analysis_results"),
});

export const recurringPayments = pgTable("recurring_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  merchantName: varchar("merchant_name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  frequency: varchar("frequency").notNull(), // monthly, yearly, weekly, bi-weekly
  category: varchar("category"), // entertainment, software, news, fitness, etc.
  lastPaymentDate: timestamp("last_payment_date"),
  nextPaymentDate: timestamp("next_payment_date"),
  status: varchar("status").notNull().default("active"), // active, cancelled, paused
  detectedDate: timestamp("detected_date").defaultNow(),
  uploadId: varchar("upload_id").references(() => uploads.id),
});

export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  frequency: varchar("frequency").notNull().default("monthly"), // monthly, weekly, bi-weekly, quarterly
  sendTime: varchar("send_time").notNull().default("first_day"), // first_day, last_day, 15th
  isActive: boolean("is_active").notNull().default(true),
  lastSent: timestamp("last_sent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminderHistory = pgTable("reminder_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sentDate: timestamp("sent_date").defaultNow(),
  status: varchar("status").notNull(), // delivered, failed, bounced
  subscriptionCount: integer("subscription_count").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertUploadSchema = createInsertSchema(uploads).omit({
  id: true,
  uploadDate: true,
});

export const insertRecurringPaymentSchema = createInsertSchema(recurringPayments).omit({
  id: true,
  detectedDate: true,
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export const insertReminderHistorySchema = createInsertSchema(reminderHistory).omit({
  id: true,
  sentDate: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type RecurringPayment = typeof recurringPayments.$inferSelect;
export type InsertRecurringPayment = z.infer<typeof insertRecurringPaymentSchema>;
export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type ReminderHistory = typeof reminderHistory.$inferSelect;
export type InsertReminderHistory = z.infer<typeof insertReminderHistorySchema>;

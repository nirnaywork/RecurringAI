import {
  users,
  uploads,
  recurringPayments,
  reminders,
  reminderHistory,
  type User,
  type UpsertUser,
  type Upload,
  type InsertUpload,
  type RecurringPayment,
  type InsertRecurringPayment,
  type Reminder,
  type InsertReminder,
  type ReminderHistory,
  type InsertReminderHistory,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Upload operations
  createUpload(upload: InsertUpload): Promise<Upload>;
  getUploadsByUserId(userId: string): Promise<Upload[]>;
  updateUploadAnalysis(uploadId: string, status: string, results?: any): Promise<Upload>;
  
  // Recurring Payment operations
  createRecurringPayment(payment: InsertRecurringPayment): Promise<RecurringPayment>;
  getRecurringPaymentsByUserId(userId: string): Promise<RecurringPayment[]>;
  updateRecurringPaymentStatus(paymentId: string, status: string): Promise<RecurringPayment>;
  
  // Reminder operations
  upsertReminder(reminder: InsertReminder): Promise<Reminder>;
  getReminderByUserId(userId: string): Promise<Reminder | undefined>;
  
  // Reminder history operations
  createReminderHistory(history: InsertReminderHistory): Promise<ReminderHistory>;
  getReminderHistoryByUserId(userId: string): Promise<ReminderHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Upload operations
  async createUpload(upload: InsertUpload): Promise<Upload> {
    const [newUpload] = await db.insert(uploads).values(upload).returning();
    return newUpload;
  }

  async getUploadsByUserId(userId: string): Promise<Upload[]> {
    return await db
      .select()
      .from(uploads)
      .where(eq(uploads.userId, userId))
      .orderBy(desc(uploads.uploadDate));
  }

  async updateUploadAnalysis(uploadId: string, status: string, results?: any): Promise<Upload> {
    const [upload] = await db
      .update(uploads)
      .set({
        analysisStatus: status,
        analysisResults: results,
      })
      .where(eq(uploads.id, uploadId))
      .returning();
    return upload;
  }

  // Recurring Payment operations
  async createRecurringPayment(payment: InsertRecurringPayment): Promise<RecurringPayment> {
    const [newPayment] = await db.insert(recurringPayments).values(payment).returning();
    return newPayment;
  }

  async getRecurringPaymentsByUserId(userId: string): Promise<RecurringPayment[]> {
    return await db
      .select()
      .from(recurringPayments)
      .where(eq(recurringPayments.userId, userId))
      .orderBy(desc(recurringPayments.detectedDate));
  }

  async updateRecurringPaymentStatus(paymentId: string, status: string): Promise<RecurringPayment> {
    const [payment] = await db
      .update(recurringPayments)
      .set({ status })
      .where(eq(recurringPayments.id, paymentId))
      .returning();
    return payment;
  }

  // Reminder operations
  async upsertReminder(reminder: InsertReminder): Promise<Reminder> {
    const existing = await this.getReminderByUserId(reminder.userId);
    
    if (existing) {
      const [updated] = await db
        .update(reminders)
        .set(reminder)
        .where(eq(reminders.userId, reminder.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(reminders).values(reminder).returning();
      return created;
    }
  }

  async getReminderByUserId(userId: string): Promise<Reminder | undefined> {
    const [reminder] = await db
      .select()
      .from(reminders)
      .where(eq(reminders.userId, userId));
    return reminder;
  }

  // Reminder history operations
  async createReminderHistory(history: InsertReminderHistory): Promise<ReminderHistory> {
    const [newHistory] = await db.insert(reminderHistory).values(history).returning();
    return newHistory;
  }

  async getReminderHistoryByUserId(userId: string): Promise<ReminderHistory[]> {
    return await db
      .select()
      .from(reminderHistory)
      .where(eq(reminderHistory.userId, userId))
      .orderBy(desc(reminderHistory.sentDate));
  }
}

export const storage = new DatabaseStorage();

import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";

// Types for local storage
type User = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

type Upload = {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadDate: Date;
  analysisStatus: string;
  analysisResults?: any;
};

type InsertUpload = Omit<Upload, 'id' | 'uploadDate'>;

type RecurringPayment = {
  id: string;
  userId: string;
  merchantName: string;
  amount: string;
  frequency: string;
  category: string;
  status: string;
  confidence: number;
  detectedDate: Date;
  nextPaymentDate?: Date | null;
};

type InsertRecurringPayment = Omit<RecurringPayment, 'id' | 'detectedDate'>;

type Reminder = {
  id: string;
  userId: string;
  emailEnabled: boolean;
  emailAddress?: string | null;
  reminderDay: number;
  lastSent?: Date | null;
  createdAt: Date;
};

type InsertReminder = Omit<Reminder, 'id' | 'createdAt'>;

type ReminderHistory = {
  id: string;
  userId: string;
  type: string;
  sentDate: Date;
  recipientEmail: string;
  status: string;
};

type InsertReminderHistory = Omit<ReminderHistory, 'id' | 'sentDate'>;

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

export class FileStorage implements IStorage {
  private dataDir: string;
  
  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private getFilePath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  private loadData<T>(collection: string): T[] {
    const filePath = this.getFilePath(collection);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading ${collection}:`, error);
      return [];
    }
  }

  private saveData<T>(collection: string, data: T[]): void {
    const filePath = this.getFilePath(collection);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving ${collection}:`, error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const users = this.loadData<User>('users');
    return users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const users = this.loadData<User>('users');
    const existingIndex = users.findIndex(user => user.id === userData.id);
    
    const now = new Date();
    const user: User = {
      ...userData,
      createdAt: existingIndex >= 0 ? users[existingIndex].createdAt : now,
      updatedAt: now,
    };
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    this.saveData('users', users);
    return user;
  }

  // Upload operations
  async createUpload(upload: InsertUpload): Promise<Upload> {
    const uploads = this.loadData<Upload>('uploads');
    const newUpload: Upload = {
      ...upload,
      id: nanoid(),
      uploadDate: new Date(),
    };
    uploads.push(newUpload);
    this.saveData('uploads', uploads);
    return newUpload;
  }

  async getUploadsByUserId(userId: string): Promise<Upload[]> {
    const uploads = this.loadData<Upload>('uploads');
    return uploads
      .filter(upload => upload.userId === userId)
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  async updateUploadAnalysis(uploadId: string, status: string, results?: any): Promise<Upload> {
    const uploads = this.loadData<Upload>('uploads');
    const index = uploads.findIndex(upload => upload.id === uploadId);
    
    if (index < 0) {
      throw new Error('Upload not found');
    }
    
    uploads[index].analysisStatus = status;
    uploads[index].analysisResults = results;
    this.saveData('uploads', uploads);
    return uploads[index];
  }

  // Recurring Payment operations
  async createRecurringPayment(payment: InsertRecurringPayment): Promise<RecurringPayment> {
    const payments = this.loadData<RecurringPayment>('recurringPayments');
    const newPayment: RecurringPayment = {
      ...payment,
      id: nanoid(),
      detectedDate: new Date(),
    };
    payments.push(newPayment);
    this.saveData('recurringPayments', payments);
    return newPayment;
  }

  async getRecurringPaymentsByUserId(userId: string): Promise<RecurringPayment[]> {
    const payments = this.loadData<RecurringPayment>('recurringPayments');
    return payments
      .filter(payment => payment.userId === userId)
      .sort((a, b) => new Date(b.detectedDate).getTime() - new Date(a.detectedDate).getTime());
  }

  async updateRecurringPaymentStatus(paymentId: string, status: string): Promise<RecurringPayment> {
    const payments = this.loadData<RecurringPayment>('recurringPayments');
    const index = payments.findIndex(payment => payment.id === paymentId);
    
    if (index < 0) {
      throw new Error('Payment not found');
    }
    
    payments[index].status = status;
    this.saveData('recurringPayments', payments);
    return payments[index];
  }

  // Reminder operations
  async upsertReminder(reminder: InsertReminder): Promise<Reminder> {
    const reminders = this.loadData<Reminder>('reminders');
    const existingIndex = reminders.findIndex(r => r.userId === reminder.userId);
    
    const now = new Date();
    const reminderData: Reminder = {
      ...reminder,
      id: existingIndex >= 0 ? reminders[existingIndex].id : nanoid(),
      createdAt: existingIndex >= 0 ? reminders[existingIndex].createdAt : now,
    };
    
    if (existingIndex >= 0) {
      reminders[existingIndex] = reminderData;
    } else {
      reminders.push(reminderData);
    }
    
    this.saveData('reminders', reminders);
    return reminderData;
  }

  async getReminderByUserId(userId: string): Promise<Reminder | undefined> {
    const reminders = this.loadData<Reminder>('reminders');
    return reminders.find(reminder => reminder.userId === userId);
  }

  // Reminder history operations
  async createReminderHistory(history: InsertReminderHistory): Promise<ReminderHistory> {
    const historyData = this.loadData<ReminderHistory>('reminderHistory');
    const newHistory: ReminderHistory = {
      ...history,
      id: nanoid(),
      sentDate: new Date(),
    };
    historyData.push(newHistory);
    this.saveData('reminderHistory', historyData);
    return newHistory;
  }

  async getReminderHistoryByUserId(userId: string): Promise<ReminderHistory[]> {
    const historyData = this.loadData<ReminderHistory>('reminderHistory');
    return historyData
      .filter(history => history.userId === userId)
      .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());
  }
}

export const storage = new FileStorage();

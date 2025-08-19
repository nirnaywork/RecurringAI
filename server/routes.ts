import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: function (req: any, file: any, cb: any) {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req: any, file: any, cb: any) {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  }
});

// Simulate AI analysis of bank statements
function simulateAIAnalysis(fileName: string): any {
  // This would normally be replaced with actual AI/ML processing
  const mockResults = {
    totalRecurringPayments: Math.floor(Math.random() * 15) + 5,
    monthlyTotal: (Math.random() * 200 + 50).toFixed(2),
    detectedPayments: [
      {
        merchantName: "Netflix",
        amount: "15.99",
        frequency: "monthly",
        category: "entertainment",
        confidence: 0.95
      },
      {
        merchantName: "Spotify Premium",
        amount: "9.99",
        frequency: "monthly",
        category: "entertainment",
        confidence: 0.92
      },
      {
        merchantName: "Adobe Creative Cloud",
        amount: "52.99",
        frequency: "monthly",
        category: "software",
        confidence: 0.88
      }
    ]
  };
  return mockResults;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Upload routes
  app.post('/api/uploads', isAuthenticated, upload.array('files', 10), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const files = req.files as any[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadPromises = files.map(async (file) => {
        const uploadData = {
          userId,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          analysisStatus: "pending"
        };

        const upload = await storage.createUpload(uploadData);

        // Simulate AI processing after a delay
        setTimeout(async () => {
          try {
            await storage.updateUploadAnalysis(upload.id, "processing");
            
            // Simulate processing time
            setTimeout(async () => {
              const analysisResults = simulateAIAnalysis(file.originalname);
              await storage.updateUploadAnalysis(upload.id, "completed", analysisResults);

              // Create recurring payments from analysis
              for (const payment of analysisResults.detectedPayments) {
                await storage.createRecurringPayment({
                  userId,
                  merchantName: payment.merchantName,
                  amount: payment.amount,
                  frequency: payment.frequency,
                  category: payment.category,
                  uploadId: upload.id,
                  status: "active"
                });
              }
            }, 3000);
          } catch (error) {
            console.error("Error processing upload:", error);
            await storage.updateUploadAnalysis(upload.id, "failed");
          }
        }, 1000);

        return upload;
      });

      const uploads = await Promise.all(uploadPromises);
      res.json({ uploads, message: `${files.length} file(s) uploaded successfully` });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload files" });
    }
  });

  app.get('/api/uploads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const uploads = await storage.getUploadsByUserId(userId);
      res.json(uploads);
    } catch (error) {
      console.error("Error fetching uploads:", error);
      res.status(500).json({ message: "Failed to fetch uploads" });
    }
  });

  // Recurring payments routes
  app.get('/api/recurring-payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getRecurringPaymentsByUserId(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching recurring payments:", error);
      res.status(500).json({ message: "Failed to fetch recurring payments" });
    }
  });

  app.patch('/api/recurring-payments/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['active', 'cancelled', 'paused'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const payment = await storage.updateRecurringPaymentStatus(id, status);
      res.json(payment);
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status" });
    }
  });

  // Reminder routes
  app.get('/api/reminders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminder = await storage.getReminderByUserId(userId);
      res.json(reminder || { userId, frequency: "monthly", sendTime: "first_day", isActive: true });
    } catch (error) {
      console.error("Error fetching reminder settings:", error);
      res.status(500).json({ message: "Failed to fetch reminder settings" });
    }
  });

  app.post('/api/reminders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reminderData = { ...req.body, userId };
      
      const reminder = await storage.upsertReminder(reminderData);
      res.json(reminder);
    } catch (error) {
      console.error("Error saving reminder settings:", error);
      res.status(500).json({ message: "Failed to save reminder settings" });
    }
  });

  app.get('/api/reminder-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getReminderHistoryByUserId(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching reminder history:", error);
      res.status(500).json({ message: "Failed to fetch reminder history" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getRecurringPaymentsByUserId(userId);
      
      const activePayments = payments.filter(p => p.status === 'active');
      const monthlyCost = activePayments
        .filter(p => p.frequency === 'monthly')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      const yearlyCost = monthlyCost * 12;
      const potentialSavings = payments
        .filter(p => p.status === 'cancelled')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const stats = {
        totalSubscriptions: activePayments.length,
        monthlyCost: monthlyCost.toFixed(2),
        yearlyCost: yearlyCost.toFixed(2),
        potentialSavings: potentialSavings.toFixed(2)
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

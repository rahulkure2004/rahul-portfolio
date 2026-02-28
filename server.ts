import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// -----------------------------------------
// MIDDLEWARE
// -----------------------------------------
app.use((req, res, next) => {
  // Normalize URL to collapse multiple slashes (e.g., //api -> /api)
  // This helps when VITE_API_BASE_URL has a trailing slash
  if (req.url.startsWith('//')) {
    req.url = req.url.replace(/\/+/g, '/');
  }
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Database setup
const db = new Database("portfolio.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    projectType TEXT,
    budgetRange TEXT,
    deadline TEXT,
    description TEXT,
    status TEXT DEFAULT 'NEW',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'ADMIN'
  );
`);

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Email server error:", error);
  } else {
    console.log("Email server ready");
  }
});

// Seed admin user
const seedAdmin = () => {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "password123";
  const existing = db.prepare("SELECT * FROM users WHERE username = ?").get(adminUser);
  
  const hashed = bcrypt.hashSync(adminPass, 10);
  
  if (!existing) {
    db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'ADMIN')").run(adminUser, hashed);
    console.log(`Admin user created: ${adminUser}`);
  } else {
    // Force update password to match environment variable on startup
    // This helps if the user changes the password in the environment
    db.prepare("UPDATE users SET password = ? WHERE username = ?").run(hashed, adminUser);
    console.log(`Admin password synchronized for: ${adminUser}`);
  }
};
seedAdmin();

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

async function startServer() {
  // -----------------------------------------
  // 1. API ROUTES (Must be first)
  // -----------------------------------------
  
  // Health Check
  app.get("/api/health", (req, res) => {
    return res.json({ success: true, status: "ok" });
  });

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
      return res.json({ success: true, token });
    } else {
      console.log(`Failed login attempt for username: ${username}`);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Contact
  app.post("/api/contact", async (req, res) => {
    try {
      const { fullName, email, description, phone, projectType, budgetRange, deadline } = req.body;

      if (!fullName || !email || !description) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing"
        });
      }

      // 1. Save to Database
      const stmt = db.prepare(`
        INSERT INTO messages (fullName, email, phone, projectType, budgetRange, deadline, description, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')
      `);
      const info = stmt.run(fullName, email, phone, projectType, budgetRange, deadline, description);
      const saved = db.prepare("SELECT * FROM messages WHERE id = ?").get(info.lastInsertRowid) as any;

      // 2. Send Email Notifications (Fail-safe)
      // Admin Notification
      try {
        await transporter.sendMail({
          from: `"Portfolio Notification" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: "New Portfolio Inquiry Received",
          html: `
            <h3>New Inquiry</h3>
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Project Type:</strong> ${projectType}</p>
            <p><strong>Budget:</strong> ${budgetRange}</p>
            <p><strong>Deadline:</strong> ${deadline}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          `
        });
      } catch (adminEmailErr) {
        console.error("Admin notification email failed:", adminEmailErr);
      }

      // Client Auto-Reply
      try {
        await transporter.sendMail({
          from: `"Rahul Kure" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Thank you for contacting Rahul",
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Thank you for reaching out.</p>
              <p>I have received your inquiry and will contact you soon.</p>
              <br/>
              <p>Best regards,<br/><strong>Rahul Kure</strong></p>
            </div>
          `
        });
      } catch (clientEmailErr) {
        console.error("Client auto-reply email failed:", clientEmailErr);
      }

      // 3. Telegram Notification (Optional & Fail-safe)
      try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
          const telegramMsg = `
🚀 *New Portfolio Inquiry*

👤 *Name:* ${fullName}
📧 *Email:* ${email}
📱 *Phone:* ${phone || 'N/A'}
🛠 *Project:* ${projectType || 'N/A'}
💰 *Budget:* ${budgetRange || 'N/A'}
⏳ *Deadline:* ${deadline || 'N/A'}

📝 *Description:*
${description}

📅 *Date:* ${saved.createdAt}
          `;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: telegramMsg,
              parse_mode: 'Markdown'
            })
          });
        }
      } catch (err) {
        console.error("Telegram notification failed:", err);
      }

      return res.status(200).json({
        success: true,
        message: "Your inquiry has been submitted successfully.",
        data: saved
      });

    } catch (error) {
      console.error("Contact error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  });

  // Admin Messages
  app.get("/api/admin/messages", authenticate, async (req, res) => {
    try {
      const messages = db.prepare("SELECT * FROM messages ORDER BY createdAt DESC").all();
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error("Admin error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  });

  app.get("/api/admin/messages/filter", authenticate, (req, res) => {
    try {
      const { projectType, fromDate, toDate } = req.query;
      let query = "SELECT * FROM messages WHERE 1=1";
      const params: any[] = [];

      if (projectType && projectType !== "All") {
        query += " AND projectType = ?";
        params.push(projectType);
      }
      if (fromDate) {
        query += " AND createdAt >= ?";
        params.push(fromDate);
      }
      if (toDate) {
        query += " AND createdAt <= ?";
        params.push(toDate);
      }

      query += " ORDER BY createdAt DESC";
      const messages = db.prepare(query).all(...params);
      return res.json({ success: true, data: messages });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.get("/api/admin/messages/search", authenticate, (req, res) => {
    try {
      const { keyword } = req.query;
      const query = "SELECT * FROM messages WHERE fullName LIKE ? OR email LIKE ? OR description LIKE ? ORDER BY createdAt DESC";
      const messages = db.prepare(query).all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
      return res.json({ success: true, data: messages });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.get("/api/admin/stats", authenticate, (req, res) => {
    try {
      const totalLeads: any = db.prepare("SELECT COUNT(*) as count FROM messages").get();
      const thisMonthLeads: any = db.prepare("SELECT COUNT(*) as count FROM messages WHERE createdAt >= date('now', 'start of month')").get();
      const todayLeads: any = db.prepare("SELECT COUNT(*) as count FROM messages WHERE createdAt >= date('now')").get();
      const typeBreakdown = db.prepare("SELECT projectType, COUNT(*) as count FROM messages GROUP BY projectType").all();
      const statusBreakdown = db.prepare("SELECT status, COUNT(*) as count FROM messages GROUP BY status").all();

      return res.json({
        success: true,
        data: {
          totalLeads: totalLeads.count,
          thisMonthLeads: thisMonthLeads.count,
          todayLeads: todayLeads.count,
          typeBreakdown,
          statusBreakdown
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.put("/api/admin/message/:id/status", authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Update record in database
      db.prepare("UPDATE messages SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(status, id);
      
      // Retrieve inquiry from database using ID
      const inquiry: any = db.prepare("SELECT * FROM messages WHERE id = ?").get(id);
      
      if (!inquiry) {
        return res.status(404).json({ success: true, message: "Inquiry not found" });
      }

      // Send email to client (Fail-safe)
      try {
        await transporter.sendMail({
          from: `"Rahul Kure" <${process.env.EMAIL_USER}>`,
          to: inquiry.email,
          subject: "Your Inquiry Status Has Been Updated",
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
              <p>Hi <strong>${inquiry.fullName}</strong>,</p>
              <p>Your project inquiry status has been updated to:</p>
              <p style="font-size: 1.2em; font-weight: bold; color: #10b981;">${status}</p>
              <p>We will reach out to you soon if required.</p>
              <br/>
              <p>Thank you,<br/><strong>Rahul Kure</strong></p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error("Status update email failed:", emailErr);
      }

      return res.status(200).json({
        success: true,
        message: "Status updated and client notified",
        updatedStatus: status
      });
    } catch (err) {
      console.error("Status update error:", err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  app.delete("/api/admin/message/:id", authenticate, (req, res) => {
    try {
      db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
      return res.json({ success: true, id: req.params.id });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  // API 404 Handler (Catch unmatched /api routes)
  app.all("/api*", (req, res) => {
    return res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl}`
    });
  });

  // -----------------------------------------
  // 2. STATIC FILES & SPA FALLBACK (After API)
  // -----------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    app.use(express.static(path.join(__dirname, "dist")));
    
    // SPA fallback
    app.get("*", (req, res) => {
      // Safety check: if it reached here and starts with /api, it's a 404 API
      if (req.path.startsWith("/api")) {
        return res.status(404).json({ success: false, message: "API not found" });
      }
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global error:", err);
    // Ensure we return JSON for API errors
    if (req.path.startsWith("/api")) {
      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }
    // For non-API errors, let Express handle it or return a generic message
    res.status(500).send("Internal Server Error");
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});

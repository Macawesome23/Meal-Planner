import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Redis } from '@upstash/redis';

// 1. Import Node.js Core Modules (Notice we don't need to 'npm install' these!)
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Middleware to simulate authentication verification
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId = req.body?.userId || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No userId provided in body or query' });
  }
  // Attach userId to request
  (req as any).user = { uid: userId };
  next();
};

// --- SYNC API ROUTES ---

// Save user data
app.post('/api/sync', requireAuth, async (req, res) => {
  try {
    const { userId, ...plannerData } = req.body;
    
    // Save to Upstash Redis
    await redis.set(`planner:${userId}`, JSON.stringify(plannerData));
    
    // 2. The Node.js File System & The Event Loop!
    const backupDir = path.join(__dirname, '..', 'backups');
    const backupFilePath = path.join(backupDir, `${userId}.json`);

    // We changed this to be ASYNCHRONOUS!
    // Instead of freezing the server, Node sends this to the background
    try {
      await fs.promises.access(backupDir);
    } catch {
      await fs.promises.mkdir(backupDir);
    }

    // Write the file asynchronously. The main thread is free to help other users while this saves!
    await fs.promises.writeFile(backupFilePath, JSON.stringify(plannerData, null, 2));
    
    console.log(`[SYNC] Saved planner data to Redis AND created local backup for user: ${userId}`);
    res.json({ success: true, message: 'Data synced to Redis successfully' });
  } catch (error) {
    console.error('[SYNC ERROR]', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Get user data
app.get('/api/sync', requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.uid;
    
    // Retrieve from Upstash Redis
    const data = await redis.get(`planner:${userId}`);
    
    res.json({ data: typeof data === 'string' ? JSON.parse(data) : data });
  } catch (error) {
    console.error('[SYNC ERROR]', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-sync-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 User Sync Microservice running on http://localhost:${PORT}`);
});

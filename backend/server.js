import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import analyzeRouter from './routes/analyze.js';
import historyRouter from './routes/history.js';
import chatRouter from './routes/chat.js';
import translateRouter from './routes/translate.js';
import verifiedRouter from './routes/verified.js';
import speakRouter from './routes/speak.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-gemini-key']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'SkinGuard AI Vision Core API',
    database: dbStatus,
    aiCoreReady: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE')
  });
});

// API Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/history', historyRouter);
app.use('/api/chat', chatRouter);
app.use('/api/translate', translateRouter);
app.use('/api/verified-info', verifiedRouter);
app.use('/api/speak', speakRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`🩺 Skin AI Screening Server running on port ${port}`);
    console.log(`🌐 Health check: http://localhost:${port}/api/health`);
    console.log(`===============================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Conflict] Port ${port} is in use. Retrying on port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('[Server Error]', err);
    }
  });
};

startServer(PORT);

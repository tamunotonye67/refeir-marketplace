import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { applicationsRouter } from './routes/applications.js';
import { authRouter } from './routes/auth.js';
import { staffRouter } from './routes/staff.js';
import { tasksRouter } from './routes/tasks.js';
import { submissionsRouter } from './routes/submissions.js';
import { certificatesRouter } from './routes/certificates.js';
import { governanceRouter } from './routes/governance.js';
import { errorHandler } from './middleware/errorHandler.js';
import { checkAdminFirebaseConnection } from './config/firebaseAdmin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.path.startsWith('/api/health')) {
      console.log(`[HTTP] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRouter);
app.use('/api/staff', staffRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/proofs', submissionsRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/governance', governanceRouter);
app.use('/api', governanceRouter); // mounts /api/health

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Refeir Pioneers Custom Backend API',
    status: 'ONLINE',
    version: '1.0.0',
    endpoints: [
      '/api/applications',
      '/api/applications/lookup?q=...',
      '/api/auth/signup',
      '/api/auth/signin',
      '/api/staff/login',
      '/api/tasks',
      '/api/proofs',
      '/api/certificates',
      '/api/governance/inactivity-check',
      '/api/health'
    ]
  });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`\n==================================================`);
  console.log(`🚀 REFEIR PIONEERS CUSTOM BACKEND IS RUNNING!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`==================================================\n`);

  const health = await checkAdminFirebaseConnection();
  console.log(`[Storage Mode] ${health.mode}: ${health.message}\n`);
});

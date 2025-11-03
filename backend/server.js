import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dsaRoutes from './routes/dsa.js';
import companyRoutes from './routes/company.js';
import mockRoutes from './routes/mocks.js';
import resourceRoutes from './routes/resources.js';
import analyticsRoutes from './routes/analytics.js';
import devRoutes from './routes/dev.js';

dotenv.config();

const app = express();

// Security & basics
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

// CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';
const allowedOrigins = [FRONTEND_URL, 'http://localhost:5000', 'http://127.0.0.1:5500'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Connect DB
await connectDB();

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dev', devRoutes);

// Serve frontend (optional; when FRONTEND is inside project)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Health endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});



import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import decisionRoutes from './routes/decision.routes';
import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/decisions', decisionRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Decision Engine is running!',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;

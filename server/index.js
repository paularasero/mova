import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import plansRouter from './routes/plans.js';
import usersRouter from './routes/users.js';
import experiencesRouter from './routes/experiences.js';
import authRouter from './routes/auth.js';
import conversationsRouter from './routes/conversations.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;
let dbReadyPromise;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    let hostname = '';
    try {
      hostname = new URL(origin).hostname;
    } catch {
      hostname = '';
    }

    const isAllowed = allowedOrigins.includes(origin) || /\.vercel\.app$/.test(hostname);
    callback(isAllowed ? null : new Error('Origen no permitido por CORS.'), isAllowed);
  },
}));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(async (_req, _res, next) => {
  try {
    dbReadyPromise ??= connectDB();
    await dbReadyPromise;
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/plans', plansRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/conversations', conversationsRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

if (!process.env.VERCEL) {
  connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MOVA server running on http://localhost:${PORT}`);
  });
  });
}

export default app;

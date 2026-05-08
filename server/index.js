import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import plansRouter from './routes/plans.js';
import usersRouter from './routes/users.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;
let dbReadyPromise;

app.use(cors());
app.use(express.json());

app.use(async (_req, _res, next) => {
  try {
    dbReadyPromise ??= connectDB();
    await dbReadyPromise;
    next();
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'MOVA API' });
});

app.use('/api/plans', plansRouter);
app.use('/api/users', usersRouter);

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

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import plansRouter from './routes/plans.js';
import usersRouter from './routes/users.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'MOVA API' });
});

app.use('/api/plans', plansRouter);
app.use('/api/users', usersRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MOVA server running on http://localhost:${PORT}`);
  });
});

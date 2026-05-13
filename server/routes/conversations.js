import { Router } from 'express';
import Conversation from '../models/Conversation.js';

const router = Router();

router.get('/', async (_req, res) => {
  const conversations = await Conversation.find().sort({ unread: -1, time: 1 });
  res.json(conversations);
});

export default router;

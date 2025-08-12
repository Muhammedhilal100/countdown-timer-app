import express from 'express';
import Timer from '../models/Timer.js';
import { findActiveTimer } from '../utils/activeTimer.js';

const router = express.Router();

router.get('/active', async (req, res) => {
  const shop = (req.query.shop || req.headers['x-shopify-shop-domain'] || '').toString();
  if (!shop) return res.status(400).json({ error: 'Missing shop' });
  const timers = await Timer.find({ shop });
  const active = findActiveTimer(timers);
  res.json({ timer: active });
});

export default router;

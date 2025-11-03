import { Router } from 'express';
import { execSeed } from '../utils/seed.js';

const router = Router();

router.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ error: 'Not allowed in production' });
  const key = req.headers['x-seed-key'] || req.query.key || '';
  if (!process.env.DEV_SEED_KEY || key !== process.env.DEV_SEED_KEY) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await execSeed();
    res.json({ ok: true, ...result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;



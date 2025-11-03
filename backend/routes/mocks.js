import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import Mock from '../models/Mock.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const items = await Mock.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(items);
});

const createValidator = [
  body('date').isISO8601(),
  body('interviewer').optional().isString().trim(),
  body('role').optional().isString().trim(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('notes').optional().isString().trim(),
  body('recordedAnswers').optional().isArray(),
];

router.post('/', authRequired, createValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const created = await Mock.create({ ...req.body, userId: req.user.id });
  res.status(201).json(created);
});

export default router;



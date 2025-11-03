import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import Resource from '../models/Resource.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const items = await Resource.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(items);
});

const createValidator = [
  body('title').isString().trim().isLength({ min: 2 }),
  body('url').isURL().trim(),
  body('type').isIn(['Article', 'Video', 'Course', 'Book']),
  body('tags').optional().isArray(),
];

router.post('/', authRequired, createValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const created = await Resource.create({ ...req.body, userId: req.user.id });
  res.status(201).json(created);
});

export default router;



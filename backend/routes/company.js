import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import Company from '../models/Company.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const items = await Company.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(items);
});

const createValidator = [
  body('companyName').isString().trim().isLength({ min: 2 }),
  body('role').optional().isString().trim(),
  body('rounds').optional().isArray(),
];

router.post('/', authRequired, createValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const created = await Company.create({ ...req.body, userId: req.user.id });
  res.status(201).json(created);
});

router.put('/:id', authRequired, async (req, res) => {
  const updated = await Company.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

export default router;



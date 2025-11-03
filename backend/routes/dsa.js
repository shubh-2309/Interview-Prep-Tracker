import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import DSA from '../models/DSA.js';

const router = Router();

router.get('/', authRequired, async (req, res) => {
  const items = await DSA.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(items);
});

const createValidator = [
  body('title').isString().trim().isLength({ min: 2 }),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('status').optional().isIn(['Not started', 'In progress', 'Completed']),
  body('link').optional().isURL().trim(),
  body('companyTags').optional().isArray(),
];

router.post('/', authRequired, createValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const data = { ...req.body, userId: req.user.id };
  const created = await DSA.create(data);
  res.status(201).json(created);
});

const updateValidator = [
  body('title').optional().isString().trim().isLength({ min: 2 }),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  body('status').optional().isIn(['Not started', 'In progress', 'Completed']),
  body('link').optional().isURL().trim(),
  body('companyTags').optional().isArray(),
];

router.put('/:id', authRequired, updateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const updated = await DSA.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { ...req.body, lastUpdated: new Date() }, { new: true });
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

router.delete('/:id', authRequired, async (req, res) => {
  const deleted = await DSA.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;



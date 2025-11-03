import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { setAuthCookie } from '../middleware/auth.js';

const router = Router();

const registerValidator = [
  body('name').isString().trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 }),
];

router.post('/register', registerValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  setAuthCookie(res, token);
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
});

const loginValidator = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 8 }),
];

router.post('/login', loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  setAuthCookie(res, token);
  res.json({ id: user._id, name: user.name, email: user.email });
});

router.post('/logout', async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  res.json({ ok: true });
});

export default router;



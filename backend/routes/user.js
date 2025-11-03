import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import User from '../models/User.js';
import DSA from '../models/DSA.js';
import Mock from '../models/Mock.js';
import Company from '../models/Company.js';

const router = Router();

router.get('/me', authRequired, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email settings createdAt');
  if (!user) return res.status(404).json({ error: 'User not found' });

  // Aggregated progress
  const [dsaStats, mockStats, companyStats] = await Promise.all([
    DSA.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
    Mock.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, total: { $sum: 1 } } },
    ]),
    Company.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: 1 } } },
    ]),
  ]);

  const dsaTotal = dsaStats.reduce((s, x) => s + x.count, 0) || 0;
  const completed = dsaStats.find((x) => x._id === 'Completed')?.count || 0;
  const dsaProgressPct = dsaTotal ? Math.round((completed / dsaTotal) * 100) : 0;
  const avgRating = mockStats[0]?.avgRating ? Number(mockStats[0].avgRating.toFixed(2)) : 0;
  const companies = companyStats[0]?.total || 0;

  res.json({
    user,
    aggregates: { dsaProgressPct, avgRating, companies },
  });
});

const updateValidator = [
  body('name').optional().isString().trim().isLength({ min: 2 }),
  body('settings.timezone').optional().isString(),
  body('settings.theme').optional().isIn(['light', 'dark']),
];

router.put('/me', authRequired, updateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const fields = ['name', 'settings'];
  const update = {};
  for (const f of fields) if (req.body[f] !== undefined) update[f] = req.body[f];
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('name email settings createdAt');
  res.json(user);
});

export default router;



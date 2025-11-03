import { Router } from "express";
import mongoose from "mongoose";
import { authRequired } from "../middleware/auth.js";
import DSA from "../models/DSA.js";
import Mock from "../models/Mock.js";
import Company from "../models/Company.js";

const router = Router();

router.get("/progress", authRequired, async (req, res) => {
  const userId = req.user.id;
  const userIdObj = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;
  const [dsaStats, mockStats, companies] = await Promise.all([
    DSA.aggregate([
      { $match: { userId: userIdObj } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).catch(async () => {
      const all = await DSA.find({ userId });
      const map = { "Not started": 0, "In progress": 0, Completed: 0 };
      all.forEach((x) => (map[x.status] = (map[x.status] || 0) + 1));
      return Object.entries(map).map(([k, v]) => ({ _id: k, count: v }));
    }),
    Mock.aggregate([
      { $match: { userId: userIdObj } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]).catch(async () => {
      const arr = await Mock.find({ userId });
      const avg = arr.length
        ? arr.reduce((s, x) => s + (x.rating || 0), 0) / arr.length
        : 0;
      return [{ _id: null, avgRating: avg, total: arr.length }];
    }),
    Company.find({ userId }),
  ]);

  const dsaTotal = dsaStats.reduce((s, x) => s + x.count, 0) || 0;
  const completed = dsaStats.find((x) => x._id === "Completed")?.count || 0;
  const dsaProgressPct = dsaTotal
    ? Math.round((completed / dsaTotal) * 100)
    : 0;
  const avgRating = mockStats[0]?.avgRating
    ? Number(mockStats[0].avgRating.toFixed(2))
    : 0;
  const companiesCleared = companies.filter((c) =>
    c.rounds?.every((r) => r.status === "Completed")
  ).length;

  res.json({
    dsaProgressPct,
    avgRating,
    companiesApplied: companies.length,
    companiesCleared,
  });
});

export default router;

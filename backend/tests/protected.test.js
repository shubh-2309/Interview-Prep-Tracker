import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { authRequired } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/protected', authRequired, (req, res) => res.json({ ok: true }));

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  await connectDB();
});

describe('Protected route', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
  });

  it('returns 200 with valid token', async () => {
    const token = jwt.sign({ id: '64b1f3b7c0ffee0000000001' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app).get('/protected').set('Cookie', [`token=${token}`]);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});



import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import authRoutes from '../routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  await connectDB();
});

describe('Auth', () => {
  const email = `user_${Date.now()}@test.com`;
  it('registers a user and sets cookie', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Test', email, password: 'Password123!' });
    expect(res.status).toBe(201);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('logins a user and sets cookie', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'Password123!' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });
});



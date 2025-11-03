import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import DSA from '../models/DSA.js';
import Company from '../models/Company.js';
import Mock from '../models/Mock.js';
import Resource from '../models/Resource.js';

dotenv.config();

export async function execSeed() {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    DSA.deleteMany({}),
    Company.deleteMany({}),
    Mock.deleteMany({}),
    Resource.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await User.create({ name: 'Demo User', email: 'demo@preptracker.test', passwordHash });

  const dsaDocs = await DSA.insertMany([
    { userId: user._id, title: 'Arrays basics', level: 'Beginner', status: 'Completed' },
    { userId: user._id, title: 'Strings manipulation', level: 'Beginner', status: 'In progress' },
    { userId: user._id, title: 'Trees traversal', level: 'Intermediate', status: 'Not started' },
    { userId: user._id, title: 'Graphs BFS/DFS', level: 'Intermediate', status: 'In progress' },
    { userId: user._id, title: 'Dynamic Programming intro', level: 'Advanced', status: 'Not started' },
  ]);

  const companies = await Company.insertMany([
    {
      userId: user._id,
      companyName: 'Google',
      role: 'SDE Intern',
      rounds: [
        { name: 'Online Test', status: 'Completed' },
        { name: 'Tech 1', status: 'Scheduled' },
        { name: 'Tech 2', status: 'Pending' },
        { name: 'HR', status: 'Pending' },
      ],
    },
    {
      userId: user._id,
      companyName: 'Amazon',
      role: 'SDE 1',
      rounds: [
        { name: 'Online Test', status: 'Completed' },
        { name: 'Tech 1', status: 'Completed' },
        { name: 'Tech 2', status: 'Pending' },
        { name: 'HR', status: 'Pending' },
      ],
    },
    {
      userId: user._id,
      companyName: 'Microsoft',
      role: 'SWE',
      rounds: [
        { name: 'Online Test', status: 'Pending' },
        { name: 'Tech 1', status: 'Pending' },
        { name: 'Tech 2', status: 'Pending' },
        { name: 'HR', status: 'Pending' },
      ],
    },
  ]);

  const mocks = await Mock.insertMany([
    { userId: user._id, date: new Date(), interviewer: 'Mentor A', role: 'SDE', rating: 5, notes: 'Great', duration: 60 },
    { userId: user._id, date: new Date(Date.now() - 86400000), interviewer: 'Mentor B', role: 'SDE', rating: 4, notes: 'Good', duration: 45 },
    { userId: user._id, date: new Date(Date.now() - 2 * 86400000), interviewer: 'Mentor C', role: 'SDE', rating: 3, notes: 'Average', duration: 30 },
    { userId: user._id, date: new Date(Date.now() - 3 * 86400000), interviewer: 'Mentor D', role: 'SDE', rating: 4, notes: 'Improved', duration: 40 },
  ]);

  const resources = await Resource.insertMany([
    { userId: user._id, title: 'LeetCode Two Sum', url: 'https://leetcode.com/problems/two-sum/', type: 'Article', tags: ['DSA'] },
    { userId: user._id, title: 'GFG DP Intro', url: 'https://geeksforgeeks.org/dynamic-programming/', type: 'Article', tags: ['DP'] },
    { userId: user._id, title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'Article', tags: ['System Design'] },
    { userId: user._id, title: 'Gaurav Sen YT', url: 'https://youtube.com/c/GauravSen', type: 'Video', tags: ['System Design'] },
    { userId: user._id, title: 'CLRS', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/', type: 'Book', tags: ['Algorithms'] },
    { userId: user._id, title: 'Cracking the Coding Interview', url: '#', type: 'Book', tags: ['Interview'] },
  ]);

  return { user: { email: user.email }, counts: { dsa: dsaDocs.length, companies: companies.length, mocks: mocks.length, resources: resources.length } };
}

if (process.argv[1] && process.argv[1].includes('seed.js')) {
  execSeed()
    .then((r) => {
      // eslint-disable-next-line no-console
      console.log('Seed complete', r);
      process.exit(0);
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      process.exit(1);
    });
}



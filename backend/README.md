# Interview Prep Tracker - Backend

Node.js + Express + MongoDB backend for the Interview Prep Tracker. Provides JWT auth (httpOnly cookie), CRUD for DSA, Companies, Mocks, Resources, user profile, analytics, and a dev seed.

## Requirements
- Node 18+
- MongoDB 5+

## Setup
1. Install deps
```bash
npm install
```
2. Create env file
```bash
cp backend/env.example backend/.env
# edit backend/.env with your values
```
3. Seed demo data (optional)
```bash
npm run seed
```
4. Start dev server
```bash
npm run dev
```
5. Serve frontend
- Option A (built-in): Express serves `frontend/` statically at `/`.
- Option B: external static server
```bash
npx serve frontend -l 5500
```

## Environment Variables
- MONGO_URI=mongodb://localhost:27017
- MONGO_DB=interview_prep_tracker
- JWT_SECRET=change_this_secret
- JWT_EXPIRES_IN=7d
- PORT=5000
- FRONTEND_URL=http://localhost:5500
- DEV_SEED_KEY=somekey

## API Overview
- POST /api/auth/register { name, email, password } -> 201, sets httpOnly cookie `token`
- POST /api/auth/login { email, password } -> 200, sets cookie
- POST /api/auth/logout -> clears cookie
- GET /api/user/me -> current user + aggregates
- PUT /api/user/me -> update profile fields
- DSA (auth):
  - GET /api/dsa/
  - POST /api/dsa/ { title, level, notes?, status?, companyTags?, link? }
  - PUT /api/dsa/:id
  - DELETE /api/dsa/:id
- Companies (auth):
  - GET /api/companies/
  - POST /api/companies/ { companyName, role?, rounds? }
  - PUT /api/companies/:id
- Mocks (auth):
  - GET /api/mocks/
  - POST /api/mocks/ { date, interviewer?, role?, rating(1-5), notes?, recordedAnswers? }
- Resources (auth):
  - GET /api/resources/
  - POST /api/resources/ { title, type, url, tags? }
- Analytics (auth):
  - GET /api/analytics/progress -> { dsaProgressPct, avgRating, companiesApplied, companiesCleared }
- Dev (non-prod only):
  - POST /api/dev/seed (header `x-seed-key: <DEV_SEED_KEY>`) -> runs seeder

## Security
- JWT in httpOnly cookie; SameSite=Strict; Secure in production
- Rate-limited auth endpoints
- Input validation with express-validator
- Sanitization via Mongoose schemas
- CORS restricted to FRONTEND_URL
- Helmet enabled

## Testing
```bash
npm test
```
Includes:
- auth.test.js: register + login set cookie
- protected.test.js: verifies 401/200 behavior

## Demo Flow
1. Seed data: `npm run seed`
2. Visit frontend `login.html`
3. Login as `demo@preptracker.test` / `Password123!`
4. See dashboard analytics; navigate to DSA, add a topic, mark completed; add a mock; visit dashboard to observe analytics update.



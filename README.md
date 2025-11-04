# Interview Prep Tracker

A comprehensive web application designed to help college students track and
manage their placement preparation journey. This full-stack project provides a
centralized dashboard for monitoring DSA progress, company-specific
preparation, mock interviews, and curated resources, with both frontend and
backend components.

## Why Choose Interview Prep Tracker?

Streamline your placement preparation with tools tailored for college students:

- **Comprehensive Tracking**: Monitor progress across DSA topics, company
  preparations, and mock interviews in one place.
- **Company-Focused Prep**: Prepare specifically for target companies with
  round-wise breakdowns and tailored resources.
- **Analytics & Insights**: Get detailed analytics on your preparation progress
  and performance metrics.
- **Curated Resources**: Access handpicked resources including LeetCode,
  GeeksforGeeks, system design materials, and resume tips.
- **User-Friendly Interface**: Clean, responsive design that's easy to navigate
  and use.

## Features

### Frontend Features

- **Landing Page**: Quick access to all features with intuitive navigation
- **Dashboard**: Overview of preparation progress with analytics
- **DSA Tracker**: Topic-wise progress tracking with completion status
- **Company Prep**: Company-specific preparation with round-wise breakdowns
- **Mock Interviews**: Log and track mock interview performance and feedback
- **HR/Tech Prep**: Common interview questions and preparation materials
- **Resources Page**: Curated links and materials for interview preparation
- **Authentication**: Login/Register pages with user profile management

### Backend Features

- **JWT Authentication**: Secure authentication with httpOnly cookies
- **CRUD Operations**: Full CRUD for DSA topics, companies, mocks, resources,
  and user profiles
- **Analytics API**: Progress tracking and performance metrics
- **Data Seeding**: Demo data seeding for development and testing
- **Security**: Rate limiting, input validation, CORS, and Helmet protection

## Tech Stack

### Frontend

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Google Fonts (Poppins, Inter)

### Backend

- Node.js (18+)
- Express.js
- MongoDB (5+)
- Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 18 or higher)
- MongoDB (version 5 or higher)
- npm or yarn package manager

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd interview-prep-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp backend/env.example backend/.env
   ```

   Edit `backend/.env` with your configuration:

   ```env
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB=interview_prep_tracker
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   PORT=5000
   FRONTEND_URL=http://localhost:5500
   DEV_SEED_KEY=your_seed_key_here
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on your system.

5. **Seed demo data (optional)**

   ```bash
   npm run seed
   ```

## Running the Application

### Development Mode

1. **Start the backend server**

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

2. **Serve the frontend**
   - Option A: Use the built-in Express static server (recommended)
     - The backend serves the frontend at `/`
     - Access the app at `http://localhost:5000`
   - Option B: Use an external static server
     ```bash
     npx serve frontend -l 5500
     ```
     - Access the frontend at `http://localhost:5500`
     - Backend API at `http://localhost:5000`

### Production Mode

```bash
npm start
```

## API Overview

The backend provides RESTful APIs for:

- **Authentication**: Register, login, logout
- **User Management**: Profile updates and user data
- **DSA Tracking**: CRUD operations for DSA topics
- **Company Prep**: Manage company-specific preparations
- **Mock Interviews**: Track mock interview sessions
- **Resources**: Curated resource management
- **Analytics**: Progress and performance metrics

For detailed API documentation, see `backend/README.md`.

## Testing

Run the test suite:

```bash
npm test
```

## Demo

1. Seed demo data: `npm run seed`
2. Visit the login page
3. Login with demo credentials: `demo@preptracker.test` / `Password123!`
4. Explore the dashboard and features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

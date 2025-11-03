import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    // eslint-disable-next-line no-console
    console.error('MONGO_URI is not set');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGO_DB || 'interview_prep_tracker',
    });
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Mongo connection error', err.message);
    process.exit(1);
  }
}



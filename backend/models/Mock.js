import mongoose from 'mongoose';

const MockSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    interviewer: { type: String, trim: true },
    role: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    notes: { type: String, trim: true },
    duration: { type: Number },
    recordedAnswers: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Mock', MockSchema);



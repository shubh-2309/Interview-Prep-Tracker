import mongoose from 'mongoose';

const DSASchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    status: { type: String, enum: ['Not started', 'In progress', 'Completed'], default: 'Not started', index: true },
    link: { type: String, trim: true },
    companyTags: [{ type: String, trim: true }],
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('DSA', DSASchema);



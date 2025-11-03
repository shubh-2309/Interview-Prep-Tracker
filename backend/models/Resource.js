import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Article', 'Video', 'Course', 'Book'], required: true },
    tags: { type: [String], default: [] },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Resource', ResourceSchema);



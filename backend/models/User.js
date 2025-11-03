import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    timezone: { type: String, default: 'UTC' },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    settings: { type: SettingsSchema, default: () => ({}) },
    dsa: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DSA' }],
    companies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' }],
    mocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mock' }],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.model('User', UserSchema);



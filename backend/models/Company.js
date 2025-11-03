import mongoose from 'mongoose';

const RoundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Scheduled'], default: 'Pending' },
    completedOn: { type: Date },
    date: { type: Date },
    note: { type: String, trim: true },
  },
  { _id: false }
);

const CompanySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    appliedDate: { type: Date },
    rounds: { type: [RoundSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Company', CompanySchema);



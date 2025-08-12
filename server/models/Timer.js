import mongoose from 'mongoose';

const TimerSchema = new mongoose.Schema(
  {
    shop: { type: String, index: true, required: true },
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#16a34a' },
    size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    position: { type: String, enum: ['top', 'bottom'], default: 'top' },
    urgency: { type: String, enum: ['none', 'colorPulse', 'banner'], default: 'none' }
  },
  { timestamps: true }
);

export default mongoose.model('Timer', TimerSchema);

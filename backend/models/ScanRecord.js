import mongoose from 'mongoose';

const ConditionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  likelihood_percent: { type: Number, required: true },
  description: { type: String, default: '' },
  severity: { type: String, enum: ['Mild', 'Moderate', 'Severe', 'Low Risk', 'High Risk'], default: 'Mild' }
}, { _id: false });

const ScanRecordSchema = new mongoose.Schema({
  imageThumbnail: { type: String, required: true }, // base64 data url
  imageName: { type: String, default: 'scan-image.jpg' },
  mimeType: { type: String, default: 'image/jpeg' },
  fileSizeKB: { type: Number, default: 0 },
  symptoms: [{ type: String }],
  bodyLocation: { type: String, default: 'Not specified' },
  durationDays: { type: String, default: 'Not specified' },
  possibleConditions: [ConditionSchema],
  visibleFeatures: [{ type: String }],
  causesAndTriggers: [{ type: String }],
  preventionTips: [{ type: String }],
  homeCareAdvice: [{ type: String }],
  seeDoctorUrgency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  clinicalSummary: { type: String, default: '' },
  immediateCareSigns: [{ type: String }],
  disclaimer: { type: String, default: 'This is a preliminary AI screening tool and does not replace medical advice from a qualified doctor.' },
  aiModelUsed: { type: String, default: 'Clinical Deep Vision AI' },
  createdAt: { type: Date, default: Date.now }
});

const ScanRecord = mongoose.models.ScanRecord || mongoose.model('ScanRecord', ScanRecordSchema);

export default ScanRecord;

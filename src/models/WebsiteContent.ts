import mongoose from 'mongoose';

const WebsiteContentSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g., 'reunion_date'
  value: { type: String, required: true }, // e.g., '2026-12-31T23:59:59'
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.WebsiteContent || mongoose.model('WebsiteContent', WebsiteContentSchema);

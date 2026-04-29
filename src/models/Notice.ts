import mongoose, { Schema, model, models } from 'mongoose';

const NoticeSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'GENERAL' }, // IMPORTANT, GENERAL, etc.
  showNewBadge: { type: Boolean, default: true },
  hasAttachment: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notice = models.Notice || model('Notice', NoticeSchema);

export default Notice;

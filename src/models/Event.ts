import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true }, // REUNION, CULTURAL, etc.
  image: { type: String, required: true },
  description: { type: String },
  isOpen: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Event = models.Event || model('Event', EventSchema);

export default Event;

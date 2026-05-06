import mongoose, { Schema, model, models } from 'mongoose';

const SponsorshipSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  currentCountry: { type: String, required: true }, // Bangladesh, Italy, Korea, Malaysia, Saudi Arabia, Japan, India
  occupation: { type: String, required: true }, // পেশা
  amount: { type: Number, required: true },
  paymentSystem: { type: String, required: true }, // Bkash, Nagad, Rocket
  transactionId: { type: String, required: true }, // TrxID
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

const Sponsorship = models.Sponsorship || model('Sponsorship', SponsorshipSchema);

export default Sponsorship;

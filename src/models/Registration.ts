import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  photo: { type: String }, // URL to hosted image
  section: { type: String, required: true }, // ক, খ
  department: { type: String, required: true }, // Science, Arts
  code: { type: String },
  institute: { type: String, required: true },
  currentSection: { type: String },
  currentDepartment: { type: String },
  occupation: { type: String },
  tshirtSize: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentOption: { type: String, required: true }, // Bkash, Nagad
  transactionId: { type: String, required: true }, // TrxID from payment
  comment: { type: String },
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

const Registration = models.Registration || model('Registration', RegistrationSchema);

export default Registration;

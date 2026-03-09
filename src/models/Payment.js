const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  amount: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  method: {
    type: String,
    enum: ['cash', 'bank_transfer', 'check', 'other'],
    default: 'other'
  },
  note: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

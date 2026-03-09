const mongoose = require('mongoose');

const recoveryActionSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  type: {
    type: String,
    enum: ['call', 'email', 'letter', 'visit'],
    required: true
  },
  notes: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  result: {
    type: String,
    enum: ['promise_to_pay', 'no_answer', 'refused', 'paid', 'other'],
    default: 'other'
  },
  nextFollowUp: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('RecoveryAction', recoveryActionSchema);

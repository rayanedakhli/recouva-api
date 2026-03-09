const Joi = require('joi');

// Auth validators
exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('agent', 'manager', 'admin').default('agent')
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Client validators
exports.createClientSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(8).max(20).required(),
  address: Joi.string().max(200).optional(),
  company: Joi.string().max(100).optional()
});

exports.updateClientSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  email: Joi.string().email(),
  phone: Joi.string().min(8).max(20),
  address: Joi.string().max(200),
  company: Joi.string().max(100)
});

// Invoice validators
exports.createInvoiceSchema = Joi.object({
  client: Joi.string().required(),
  amount: Joi.number().positive().required(),
  dueDate: Joi.date().required(),
  description: Joi.string().max(500).optional()
});

exports.updateInvoiceSchema = Joi.object({
  amount: Joi.number().positive(),
  dueDate: Joi.date(),
  status: Joi.string().valid('pending', 'partial', 'paid', 'overdue'),
  description: Joi.string().max(500)
});

// Payment validators
exports.createPaymentSchema = Joi.object({
  invoice: Joi.string().required(),
  amount: Joi.number().positive().required(),
  date: Joi.date().optional(),
  method: Joi.string().valid('cash', 'bank_transfer', 'check', 'other').default('other'),
  note: Joi.string().max(300).optional()
});

// Recovery action validators
exports.createRecoveryActionSchema = Joi.object({
  invoice: Joi.string().required(),
  client: Joi.string().required(),
  type: Joi.string().valid('call', 'email', 'letter', 'visit').required(),
  notes: Joi.string().max(500).optional(),
  date: Joi.date().optional(),
  result: Joi.string().valid('promise_to_pay', 'no_answer', 'refused', 'paid', 'other').optional(),
  nextFollowUp: Joi.date().optional()
});

exports.updateRecoveryActionSchema = Joi.object({
  type: Joi.string().valid('call', 'email', 'letter', 'visit'),
  notes: Joi.string().max(500),
  result: Joi.string().valid('promise_to_pay', 'no_answer', 'refused', 'paid', 'other'),
  nextFollowUp: Joi.date()
});

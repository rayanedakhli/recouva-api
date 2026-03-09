const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

exports.getPayments = async (req, res) => {
  try {
    const { invoice } = req.query;
    const query = invoice ? { invoice } : {};
    const payments = await Payment.find(query)
      .populate('invoice', 'invoiceNumber amount')
      .populate('recordedBy', 'name')
      .sort('-date');
    res.json({ count: payments.length, payments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.body.invoice);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    if (invoice.status === 'paid') return res.status(400).json({ message: 'Invoice already paid' });

    const remaining = invoice.amount - invoice.paidAmount;
    if (req.body.amount > remaining) {
      return res.status(400).json({ message: `Amount exceeds remaining balance of ${remaining}` });
    }

    const payment = await Payment.create({ ...req.body, recordedBy: req.user._id });

    // Update invoice paidAmount and status
    invoice.paidAmount += req.body.amount;
    await invoice.save();

    res.status(201).json({ payment, invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Revert invoice paidAmount
    const invoice = await Invoice.findById(payment.invoice);
    if (invoice) {
      invoice.paidAmount = Math.max(0, invoice.paidAmount - payment.amount);
      await invoice.save();
    }

    await payment.deleteOne();
    res.json({ message: 'Payment deleted and invoice updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

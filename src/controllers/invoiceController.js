const Invoice = require('../models/Invoice');

exports.getInvoices = async (req, res) => {
  try {
    const { status, client, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (client) query.client = client;

    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate('client', 'name email')
        .populate('createdBy', 'name')
        .skip(skip).limit(Number(limit)).sort('-createdAt'),
      Invoice.countDocuments(query)
    ]);
    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('createdBy', 'name');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ invoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const RecoveryAction = require('../models/RecoveryAction');

exports.getRecoveryActions = async (req, res) => {
  try {
    const { invoice, client, type } = req.query;
    const query = {};
    if (invoice) query.invoice = invoice;
    if (client) query.client = client;
    if (type) query.type = type;

    const actions = await RecoveryAction.find(query)
      .populate('invoice', 'invoiceNumber amount status')
      .populate('client', 'name email')
      .populate('agent', 'name')
      .sort('-date');
    res.json({ count: actions.length, actions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecoveryAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findById(req.params.id)
      .populate('invoice', 'invoiceNumber amount status')
      .populate('client', 'name email phone')
      .populate('agent', 'name');
    if (!action) return res.status(404).json({ message: 'Recovery action not found' });
    res.json({ action });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRecoveryAction = async (req, res) => {
  try {
    const action = await RecoveryAction.create({ ...req.body, agent: req.user._id });
    res.status(201).json({ action });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRecoveryAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!action) return res.status(404).json({ message: 'Recovery action not found' });
    res.json({ action });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecoveryAction = async (req, res) => {
  try {
    const action = await RecoveryAction.findByIdAndDelete(req.params.id);
    if (!action) return res.status(404).json({ message: 'Recovery action not found' });
    res.json({ message: 'Recovery action deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

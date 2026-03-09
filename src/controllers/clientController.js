const Client = require('../models/Client');

exports.getClients = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * limit;
    const [clients, total] = await Promise.all([
      Client.find(query).populate('createdBy', 'name email').skip(skip).limit(Number(limit)).sort('-createdAt'),
      Client.countDocuments(query)
    ]);
    res.json({ total, page: Number(page), pages: Math.ceil(total / limit), clients });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('createdBy', 'name email');
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ client });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ client });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Payment = require('../models/Payment');
const RecoveryAction = require('../models/RecoveryAction');

exports.getStats = async (req, res) => {
  try {
    // Invoice stats
    const invoiceStats = await Invoice.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalPaid: { $sum: '$paidAmount' }
        }
      }
    ]);

    // Total amounts
    const totals = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: '$amount' },
          totalCollected: { $sum: '$paidAmount' },
          totalInvoices: { $sum: 1 }
        }
      }
    ]);

    // Recovery actions by type
    const actionStats = await RecoveryAction.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Recovery actions by result
    const resultStats = await RecoveryAction.aggregate([
      { $group: { _id: '$result', count: { $sum: 1 } } }
    ]);

    // Top overdue clients
    const overdueClients = await Invoice.aggregate([
      { $match: { status: { $in: ['overdue', 'pending', 'partial'] } } },
      {
        $group: {
          _id: '$client',
          totalOwed: { $sum: { $subtract: ['$amount', '$paidAmount'] } },
          invoiceCount: { $sum: 1 }
        }
      },
      { $sort: { totalOwed: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      { $project: { 'client.name': 1, 'client.email': 1, totalOwed: 1, invoiceCount: 1 } }
    ]);

    // Recent payments (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPayments = await Payment.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const totalData = totals[0] || { totalInvoiced: 0, totalCollected: 0, totalInvoices: 0 };
    const recoveryRate = totalData.totalInvoiced > 0
      ? ((totalData.totalCollected / totalData.totalInvoiced) * 100).toFixed(2)
      : 0;

    const clientCount = await Client.countDocuments();

    res.json({
      summary: {
        totalClients: clientCount,
        totalInvoices: totalData.totalInvoices,
        totalInvoiced: totalData.totalInvoiced,
        totalCollected: totalData.totalCollected,
        totalOutstanding: totalData.totalInvoiced - totalData.totalCollected,
        recoveryRate: `${recoveryRate}%`
      },
      invoicesByStatus: invoiceStats,
      recoveryActionsByType: actionStats,
      recoveryActionsByResult: resultStats,
      topOverdueClients: overdueClients,
      recentPayments: recentPayments[0] || { total: 0, count: 0 }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

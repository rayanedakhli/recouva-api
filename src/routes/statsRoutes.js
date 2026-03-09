const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Dashboard statistics
 */

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Statistics summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: object
 *                 invoicesByStatus:
 *                   type: array
 *                 recoveryActionsByType:
 *                   type: array
 *                 topOverdueClients:
 *                   type: array
 */
router.get('/', authenticate, authorize('manager', 'admin'), getStats);

module.exports = router;

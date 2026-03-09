const express = require('express');
const router = express.Router();
const { getPayments, createPayment, deletePayment } = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createPaymentSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manual payment recording
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: invoice
 *         schema: { type: string }
 *         description: Filter by invoice ID
 *     responses:
 *       200: { description: List of payments }
 */
router.get('/', authenticate, getPayments);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Record a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoice, amount]
 *             properties:
 *               invoice: { type: string }
 *               amount: { type: number }
 *               method: { type: string, enum: [cash, bank_transfer, check, other] }
 *               note: { type: string }
 *     responses:
 *       201: { description: Payment recorded }
 *       400: { description: Invoice already paid or amount too high }
 */
router.post('/', authenticate, validate(createPaymentSchema), createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment deleted }
 */
router.delete('/:id', authenticate, authorize('manager', 'admin'), deletePayment);

module.exports = router;

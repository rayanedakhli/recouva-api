const express = require('express');
const router = express.Router();
const { getInvoices, getInvoice, createInvoice, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createInvoiceSchema, updateInvoiceSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice management
 */

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, partial, paid, overdue] }
 *       - in: query
 *         name: client
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *     responses:
 *       200: { description: List of invoices }
 */
router.get('/', authenticate, getInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Invoice found }
 *       404: { description: Invoice not found }
 */
router.get('/:id', authenticate, getInvoice);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client, amount, dueDate]
 *             properties:
 *               client: { type: string }
 *               amount: { type: number }
 *               dueDate: { type: string, format: date }
 *               description: { type: string }
 *     responses:
 *       201: { description: Invoice created }
 */
router.post('/', authenticate, authorize('manager', 'admin'), validate(createInvoiceSchema), createInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Invoice updated }
 */
router.put('/:id', authenticate, authorize('manager', 'admin'), validate(updateInvoiceSchema), updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Invoice deleted }
 */
router.delete('/:id', authenticate, authorize('admin'), deleteInvoice);

module.exports = router;

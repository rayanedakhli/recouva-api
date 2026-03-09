const express = require('express');
const router = express.Router();
const { getRecoveryActions, getRecoveryAction, createRecoveryAction, updateRecoveryAction, deleteRecoveryAction } = require('../controllers/recoveryController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { createRecoveryActionSchema, updateRecoveryActionSchema } = require('../validators/schemas');

/**
 * @swagger
 * tags:
 *   name: Recovery
 *   description: Recovery action tracking
 */

/**
 * @swagger
 * /api/recovery:
 *   get:
 *     summary: Get all recovery actions
 *     tags: [Recovery]
 *     parameters:
 *       - in: query
 *         name: invoice
 *         schema: { type: string }
 *       - in: query
 *         name: client
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [call, email, letter, visit] }
 *     responses:
 *       200: { description: List of recovery actions }
 */
router.get('/', authenticate, getRecoveryActions);

/**
 * @swagger
 * /api/recovery/{id}:
 *   get:
 *     summary: Get recovery action by ID
 *     tags: [Recovery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recovery action found }
 */
router.get('/:id', authenticate, getRecoveryAction);

/**
 * @swagger
 * /api/recovery:
 *   post:
 *     summary: Create recovery action
 *     tags: [Recovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoice, client, type]
 *             properties:
 *               invoice: { type: string }
 *               client: { type: string }
 *               type: { type: string, enum: [call, email, letter, visit] }
 *               notes: { type: string }
 *               result: { type: string, enum: [promise_to_pay, no_answer, refused, paid, other] }
 *               nextFollowUp: { type: string, format: date }
 *     responses:
 *       201: { description: Recovery action created }
 */
router.post('/', authenticate, validate(createRecoveryActionSchema), createRecoveryAction);

/**
 * @swagger
 * /api/recovery/{id}:
 *   put:
 *     summary: Update recovery action
 *     tags: [Recovery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recovery action updated }
 */
router.put('/:id', authenticate, validate(updateRecoveryActionSchema), updateRecoveryAction);

/**
 * @swagger
 * /api/recovery/{id}:
 *   delete:
 *     summary: Delete recovery action
 *     tags: [Recovery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Recovery action deleted }
 */
router.delete('/:id', authenticate, authorize('manager', 'admin'), deleteRecoveryAction);

module.exports = router;

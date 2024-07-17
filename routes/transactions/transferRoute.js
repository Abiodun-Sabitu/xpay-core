import express from "express";
import walletTransfer from "../../controllers/transactions/transferController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { transferSchema } from "../../helpers/userValidationSchemas.js";
import validate from "../../middlewares/validationMiddleware.js";
const router = express.Router();

router.post(
  "/transfer",
  isAuthenticated,
  validate(transferSchema),
  walletTransfer
);
export default router;

/**
 * @swagger
 * /transfer:
 *   post:
 *     summary: Transfers funds between two wallets owned by users.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     description: "Allows a user to transfer funds from their wallet to another user's wallet within the same currency. Ensures sufficient funds, correct ownership, and KYC limitations."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderWalletId
 *               - receiverWalletId
 *               - amount
 *               - description
 *             properties:
 *               senderWalletId:
 *                 type: string
 *                 description: "The ID of the sender's wallet."
 *                 example: "0018577272"
 *               receiverWalletId:
 *                 type: string
 *                 description: "The ID of the receiver's wallet."
 *                 example: "0016560810"
 *               amount:
 *                 type: number
 *                 format: string
 *                 description: "The amount of money to be transferred."
 *                 example: "150.00"
 *               description:
 *                 type: string
 *                 description: "A brief description of the transfer."
 *                 example: "Payment for services rendered."
 *     responses:
 *       200:
 *         description: Transfer completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transfer successful."
 *                 transactionDetails:
 *                   type: object
 *                   properties:
 *                     transactionId:
 *                       type: integer
 *                       example: 12345
 *                     type:
 *                       type: string
 *                       example: "Transfer"
 *                     amount:
 *                       type: string
 *                       example: "150.00"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2021-09-01T12:30:00Z"
 *                     description:
 *                       type: string
 *                       example: "Payment for services rendered."
 *                     sender:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         walletId:
 *                           type: integer
 *                           example: 1
 *                         balance:
 *                           type: string
 *                           example: "845.50"
 *                     receiver:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "Jane Smith"
 *                         walletId:
 *                           type: integer
 *                           example: 2
 *                         balance:
 *                           type: string
 *                           example: "995.50"
 *       400:
 *         description: Bad request due to input validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input, please check your data."
 *       403:
 *         description: Forbidden operation either due to KYC limits or attempting to transfer from a non-owned wallet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operation Forbidden, please verify your identity or check your wallet permissions."
 *       500:
 *         description: Internal server error during the transfer process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to complete transfer due to server error."
 */

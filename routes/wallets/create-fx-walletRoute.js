import express from "express";
import createFxWallet from "../../controllers/wallets/createFxWalletController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create-FX-wallet", isAuthenticated, createFxWallet);
export default router;

/**
 * @swagger
 * /create-FX-wallet:
 *   post:
 *     summary: Creates a new foreign currency wallet for the authenticated user.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     description: "Allows the creation of a new wallet with specified foreign currency (GBP or USD). Each user can only have one wallet per currency."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *             properties:
 *               currency:
 *                 type: string
 *                 description: "The currency of the wallet to be created."
 *                 enum:
 *                   - GBP
 *                   - USD
 *                 example: "GBP"
 *     responses:
 *       201:
 *         description: Currency wallet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "GBP Wallet created successfully."
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 102
 *                     userId:
 *                       type: integer
 *                       example: 101
 *                     accountNumber:
 *                       type: string
 *                       example: "0023456789"
 *                     currency:
 *                       type: string
 *                       example: "GBP"
 *                     balance:
 *                       type: decimal
 *                       format: double
 *                       example: 0.00
 *       400:
 *         description: Bad request due to invalid currency input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid currency. Only GBP or USD allowed."
 *       409:
 *         description: Conflict due to existing wallet in the same currency.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already has a GBP wallet."
 *       500:
 *         description: Internal server error during the wallet creation process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

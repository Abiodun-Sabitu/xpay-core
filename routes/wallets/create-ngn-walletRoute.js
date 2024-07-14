import express from "express";
import createNgnWallet from "../../controllers/wallets/createNgnWalletController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create-NGN-wallet", isAuthenticated, createNgnWallet);
export default router;

/**
 * @swagger
 * /create-NGN-wallet:
 *   post:
 *     summary: Creates a new NGN wallet for the authenticated user.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     description: "Creates a new wallet with NGN currency for the user. Each user can only have one NGN wallet."
 *     responses:
 *       201:
 *         description: NGN Wallet created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "NGN Wallet created successfully."
 *                 wallet:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 101
 *                     accountNumber:
 *                       type: string
 *                       example: "0012345678"
 *                     currency:
 *                       type: string
 *                       example: "NGN"
 *                     balance:
 *                       type: decimal
 *                       format: double
 *                       example: 0.00
 *       409:
 *         description: User already has an NGN wallet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "you can only have one NGN wallet."
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

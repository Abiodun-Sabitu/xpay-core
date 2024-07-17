import express from "express";
import { fetchWallets } from "../../controllers/wallets/fetchWalletsController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/fetch-wallets", isAuthenticated, fetchWallets);

export default router;

/**
 * @swagger
 * /fetch-wallets:
 *   get:
 *     summary: Retrieves all wallets associated with the authenticated user.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     description: "Fetches all the wallets for the logged-in user, showing details like account number, currency, and balance."
 *     responses:
 *       200:
 *         description: Successfully retrieved all wallets.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wallets retrieved successfully"
 *                 wallets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 101
 *                       accountNumber:
 *                         type: string
 *                         example: "0123456789"
 *                       currency:
 *                         type: string
 *                         example: "USD"
 *                       balance:
 *                         type: string
 *                         description: "Formatted as a string."
 *                         example: "100.00"
 *       500:
 *         description: Failed to fetch wallets due to an internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch wallets"
 */

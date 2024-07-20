import express from "express";
import nameEnquiry from "../../controllers/wallets/nameEnquiryController.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/name-enquiry", isAuthenticated, nameEnquiry);

export default router;
/**
 * @swagger
 * /name-enquiry:
 *   post:
 *     summary: Retrieves the name of the wallet owner based on the wallet number.
 *     tags:
 *       - Wallets
 *     security:
 *       - BearerAuth: []
 *     description: "Performs a name enquiry by wallet number to fetch the owner's full name. This is commonly used for validation purposes before initiating transactions."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletNumber
 *             properties:
 *               walletNumber:
 *                 type: string
 *                 description: "The account number of the wallet for which the name enquiry is being made."
 *                 example: "0123456789"
 *     responses:
 *       200:
 *         description: Name enquiry successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name enquiry successful."
 *                 ownerName:
 *                   type: string
 *                   description: "The full name of the wallet owner."
 *                   example: "John Doe"
 *       404:
 *         description: Wallet not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Wallet not found."
 *       500:
 *         description: Internal server error occurred while processing the name enquiry.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

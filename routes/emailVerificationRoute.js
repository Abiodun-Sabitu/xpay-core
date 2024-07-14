import express from "express";
import verifyUserEmail from "../controllers/emailVerificationController.js";
const router = express.Router();
router.get("/verify-email", verifyUserEmail);
export default router;

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify user's email address
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Verification token sent to the user's email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email verified successfully!"
 *       400:
 *         description: This link is either invalid or has expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This link is either invalid or has expired."
 *       401:
 *         description: Invalid or expired token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Failed to verify email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to verify email."
 */

import express from "express";
const router = express.Router();
import resendOtp from "../controllers/resendOtpController.js";

router.get("/resend-otp", resendOtp);

export default router;

/**
 * @swagger
 * /resend-otp:
 *   post:
 *     summary: Resend OTP to the user's registered email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address to which the OTP should be resent.
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: A new OTP has been successfully sent to the user's email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A new OTP has been sent to your registered email."
 *                 tempToken:
 *                   type: string
 *                   example: "temporary.jwt.token.here"
 *                 userId:
 *                   type: integer
 *                   example: 123
 *       403:
 *         description: User has not verified their email yet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please verify your email before requesting a new OTP."
 *       404:
 *         description: No user found with the provided email address.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       500:
 *         description: Internal server error when trying to resend OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to resend OTP, please try again later."
 */

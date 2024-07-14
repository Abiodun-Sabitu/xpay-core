import express from "express";
import verifyOtp from "../controllers/otpVerificationController.js";
const router = express.Router();
router.post("/verify-otp", verifyOtp);
export default router;
/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verifies the one-time password (OTP) for user login and provides a JWT for authenticated sessions.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The one-time password sent to the user's email.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verification successful, user is now logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully. You are now logged in."
 *                 authToken:
 *                   type: string
 *                   example: "jwt.token.here"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 101
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     phoneNo:
 *                       type: string
 *                       example: "+1234567890"
 *                     emailVerified:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized access - either the OTP is incorrect, expired, or the session has ended.
 *       404:
 *         description: User not found or unauthorized.
 *       500:
 *         description: Server error during the OTP verification process.
 */

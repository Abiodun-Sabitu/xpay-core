import express from "express";
import { verifyTempToken } from "../../middlewares/tempTokenAuth.js";
import resendOtp from "../../controllers/users/resendOtpController.js";
const router = express.Router();

router.post("/resend-otp", verifyTempToken, resendOtp);

export default router;

/**
 * @swagger
 * /resend-otp:
 *   post:
 *     summary: Resends the OTP to the user's registered email within a valid login session / instance.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     description: "This endpoint resends a new OTP to the user's email. The user must be authenticated with a valid temporary JWT and must have their email verified."
 *     responses:
 *       200:
 *         description: A new OTP has been successfully sent to the registered email.
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
 *                   description: "The temporary token that was used for authentication."
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 userId:
 *                   type: integer
 *                   description: "The unique identifier of the user."
 *                   example: 123
 *       401:
 *         description: Unauthorized access, either due to missing, expired, or invalid temporary token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized Operation. Authentication required."
 *       403:
 *         description: User email is not verified or other authorization related issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Operation Forbidden. Please verify your email before requesting a new OTP."
 *       404:
 *         description: No user found with the provided credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized, user unknown."
 *       500:
 *         description: An internal error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while sending OTP . Please try again."
 */

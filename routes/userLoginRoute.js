import express from "express";
import login from "../controllers/users/loginController.js";
import validate from "../middlewares/validationMiddleware.js";
import { loginUserSchema } from "../helpers/userValidationSchemas.js";
const router = express.Router();
router.post("/auth/login", validate(loginUserSchema), login);
export default router;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: starts the user login operation and sends otp + auth token to client if checks are passed.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "userpassword"
 *     responses:
 *       200:
 *         description: Login successful or OTP sent for verification.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent to your registered email."
 *                 tempToken:
 *                   type: string
 *                   example: "temporary.jwt.token"
 *                 userId:
 *                   type: string
 *                   example: "user-id-12345"
 *       401:
 *         description: Invalid password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid password."
 *       403:
 *         description: Email verification pending.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your email verification is still pending. Please check your mailbox (and spam folder) to verify your email before logging in."
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found. Please register first."
 *       500:
 *         description: Error sending OTP or login failure.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error sending OTP, please try again."
 */

import express from "express";
import forgotPassword from "../../controllers/users/forgotPasswordController.js";
const router = express.Router();

router.post("/forgot-password", forgotPassword);
export default router;

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Initiates a password reset process for a user.
 *     tags:
 *       - Users
 *     description: "Allows users to request a password reset link that is sent to their registered email. The link includes a token that expires in 10 minutes."
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
 *                 description: "The email address associated with the user's account."
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: "Provides a generic response to prevent email enumeration attacks. Indicates that a reset link will be sent if the email is registered."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "If that email address is in our system, we've sent a password reset link."
 *       500:
 *         description: Internal server error indicating failure to process the password reset request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong. Please try again later."
 */

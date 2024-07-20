import express from "express";
import resetPassword from "../../controllers/users/resetPasswordController.js";
// import validate from "../../middlewares/validationMiddleware.js";
// import { loginUserSchema } from "../../helpers/userValidationSchemas.js";
const router = express.Router();

// console.log(loginUserSchema.password);
router.post("/reset-password", resetPassword);
export default router;

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Resets the user's password using a token.
 *     tags:
 *       - Users
 *     description: "Allows users to reset their password through a secure token received via email. The token must be valid and not expired."
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: The password reset token received by the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: "The new password to be set for the user."
 *                 example: "newSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password has been successfully reset.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password has been successfully reset."
 *       400:
 *         description: Invalid or expired password reset link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired password reset link."
 *       500:
 *         description: Internal server error during the password reset process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */

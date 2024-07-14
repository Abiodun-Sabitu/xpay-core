import express from "express";
import onboardUser from "../controllers/onboardUserController.js";
import validate from "../helpers/validationMiddleware.js";
import { onboardUserSchema } from "../helpers/userValidationSchemas.js";

const router = express.Router();
router.post("/onboard-user", validate(onboardUserSchema), onboardUser);
export default router;

/**
 * @swagger
 * /onboard-user:
 *   post:
 *     summary: Register a new user and initiate email verification.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The last name of the user.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user, which must be unique.
 *                 example: johndoe@example.com
 *               phoneNo:
 *                 type: string
 *                 description: The phone number of the user, which must be unique.
 *                 example: "07012345678"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user account.
 *                 example: "yoursecure234password@@"
 *     responses:
 *       201:
 *         description: User registered successfully. A verification email has been sent to complete the onboarding process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully. Please verify your email to complete the onboarding process."
 *       409:
 *         description: A user with the given email or phone number already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A user with the given email or phone number already exists."
 *       500:
 *         description: An error occurred during the registration process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred during the registration process. Please try again."
 */

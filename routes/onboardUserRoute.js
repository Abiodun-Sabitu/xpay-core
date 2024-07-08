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
 *     summary: Register a new user
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
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNo:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: johndoe@example.com
 *               phoneNo: "07012345678"
 *               password: "yoursecure234password@@"
 *     responses:
 *       201:
 *         description: User registered successfully. Please verify your email to complete the onboarding process.
 *       409:
 *         description: A user with the given email or phone number already exists.
 *       500:
 *         description: An error occurred during the registration process.
 */

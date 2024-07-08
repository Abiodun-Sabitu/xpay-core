// onboardingController.js

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "../services/emailService.js"; // Correct path as necessary
import { generateToken } from "../helpers/generateToken.js"; // Correct path as necessary

const prisma = new PrismaClient();
const onboardUser = async (req, res) => {
  const { firstName, middleName, lastName, email, phoneNo, password } =
    req.body;

  if (req.validationError) {
    // Extract and format the validation errors to a simple list of messages
    const errorMessages = req.validationError.details.map(
      (detail) => detail.message
    );

    // Join the error messages into a single string if you want all in one line
    const errorMessageString = errorMessages.join("\n");

    return res.status(400).send(errorMessageString);
  }

  try {
    // Check if user already exists

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { phoneNo: phoneNo }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with the given email or phone number already exists.",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database with initial unverified status
    const newUser = await prisma.user.create({
      data: {
        firstName,
        middleName,
        lastName,
        email,
        phoneNo,
        password: hashedPassword,
        emailVerified: false,
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    });

    if (newUser) {
      const userId = newUser.id; // newUser is the result of the Prisma create call
      const verificationToken = generateToken({ id: userId }); // Generate token using user ID

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      // Respond to the client
      res.status(201).json({
        messages:
          "Signup successful!\nPlease check your email (and spam folder) to verify your account and complete the onboarding process.",
        userId: newUser.id,
      });
    } else {
      return res
        .status(500)
        .json({ message: "DB error, please contact admin." });
    }
  } catch (error) {
    console.error("Onboarding failed:", error); // Log the detailed error for internal review

    // Check if the error should be exposed
    if (process.env.NODE_ENV === "development") {
      // In development, send back detailed errors to facilitate debugging
      res.status(500).json({ error: error.message });
    } else {
      // In production, send a generic error message
      res.status(500).json({
        error:
          "An issue occurred during your request. Please try again or contact support if the problem persists.",
      });
    }
  }
};

export default onboardUser;

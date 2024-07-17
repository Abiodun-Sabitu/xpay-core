import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { emailVerificationContent } from "../../emails/emailVerificationMail.js";
import { sendMail } from "../../services/emailService.js";
import { generateEmailVerificationToken } from "../../helpers/generateTokens.js";

const prisma = new PrismaClient();

const onboardUser = async (req, res) => {
  const { firstName, lastName, email, phoneNo, password } = req.body;

  // Handle request validation errors
  if (req.validationError) {
    const errorMessages = req.validationError.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errorMessages.join("\n")); // Send validation errors
  }

  try {
    // Check if user already exists based on email or phone number
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNo }] },
    });
    if (existingUser) {
      return res.status(409).json({
        error: "A user with the given email or phone number already exists.",
      });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token using the new user's ID
    const tokenExpiry = new Date(new Date().getTime() + 24 * 3600 * 1000); // Set token expiry for 24 hours from now

    // Begin a database transaction to ensure atomicity
    const userRecord = await prisma.$transaction(async (transaction) => {
      // Create a new user record in the database
      const newUser = await transaction.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNo,
          password: hashedPassword,
          emailVerified: false, // Set email as unverified initially
        },
      });

      const userId = newUser.id;
      const verificationToken = generateEmailVerificationToken({ id: userId });

      // Update the new user record with the verification token and its expiry
      await transaction.user.update({
        where: { id: newUser.id },
        data: {
          verificationToken: verificationToken,
          tokenExpiry: tokenExpiry,
        },
      });

      return { ...newUser, verificationToken }; // Return the newly created user record with the token
    });

    // Log the generated token to verify it's not null
    console.log(
      `Generated verification token: ${userRecord.verificationToken}`
    );

    // Send a verification email to the new user
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${userRecord.verificationToken}`;
    await sendMail(
      userRecord.email,
      emailVerificationContent(verificationUrl, userRecord.firstName),
      "VERIFY YOUR EMAIL"
    );

    // Respond to the client that the signup was successful
    res.status(201).json({
      message:
        "Signup successful! Please check your email (and spam folder) to verify your account and complete the onboarding process.",
      userId: userRecord.id,
    });
  } catch (error) {
    // Log and handle any errors that occurred during the process
    console.error("Onboarding failed:", error);
    res.status(500).json({
      error:
        "An error occurred during the user registration process. Please contact admin",
    });
  }
};

export default onboardUser;

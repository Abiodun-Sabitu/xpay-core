import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {
  generateOtp,
  generateEmailVerificationToken,
} from "../../helpers/generateTokens.js";
import { sendMail } from "../../services/emailService.js";
import { emailVerificationContent } from "../../emails/emailVerificationMail.js";
import { otpVerificationMail } from "../../emails/otpVerificationMail.js";

const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, password } = req.body;

  // Handle request validation errors
  if (req.validationError) {
    const errorMessages = req.validationError.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errorMessages.join("\n")); // Send validation errors
  }

  try {
    // Attempt to find the user by their email address
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({
        message: "User not found. It looks like you need to register first",
      });
    }

    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // If the user's email is not verified
    if (!user.emailVerified) {
      // Check if the stored token has expired
      const tokenIsExpired = new Date() > new Date(user.tokenExpiry);
      if (!tokenIsExpired) {
        // If the token is not expired, inform the user to check their email
        return res.status(403).json({
          message:
            "Your email verification is still pending, please check your mailbox and (spam folder) to verify your email before logging in.",
        });
      }

      // If the token is expired, generate a new token and send a new verification email
      const newToken = generateEmailVerificationToken({ id: user.id });
      const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${newToken}`;
      const subject = "VERIFY YOUR EMAIL";
      await sendMail(
        user.email,
        emailVerificationContent(verificationUrl),
        subject
      );

      // Update the user record with the new token and its expiry
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken: newToken,
          tokenExpiry: new Date(new Date().getTime() + 24 * 3600 * 1000),
        }, // 24 hours from now
      });

      // Inform the user that a new verification email has been sent
      return res.status(200).json({
        message:
          "We noticed your initial verification email expired. No worries, we've sent another one. Please check your mailbox and verify your email to login.",
      });
    }

    // If email is verified, proceed to generate OTP and send it
    const otp = generateOtp();
    const otpSubject = "X-Pay LOGIN VERIFICATION";
    await sendMail(user.email, otpVerificationMail(otp), otpSubject);

    // Set the OTP expiry to 2 minutes from now
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 4);

    // Update the user with the OTP and its expiry
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // Generate a temporary token for OTP verification
    const tempToken = jwt.sign(
      { userId: user.id },
      process.env.TEMP_JWT_SECRET,
      { expiresIn: "10m" }
    );

    // Return the OTP notification and the temporary token
    return res.status(200).json({
      message: "OTP sent to your registered email.",
      tempToken,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Error sending OTP, please try again." });
  }
};

export default login;

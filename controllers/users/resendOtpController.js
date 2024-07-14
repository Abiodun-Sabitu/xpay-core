import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateOtp } from "../../helpers/generateTokens.js";
import { sendVerificationEmail } from "../../services/emailService.js";
import { otpVerificationMail } from "../../emails/otpVerificationMail.js";

const prisma = new PrismaClient();

const resendOtp = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized Operation" });
  }
  const tempToken = authHeader.split(" ")[1];

  if (!tempToken) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    // Decode the temporary token to extract the userId
    const decoded = jwt.verify(tempToken, process.env.TEMP_JWT_SECRET);
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Unauthorized, user unknown" });
    }

    if (!user.emailVerified) {
      console.log("Please verify your email before requesting a new OTP");
      return res.status(403).json({
        message: "Operation Forbidden",
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 4); // Set OTP expiry to 4 minutes from now

    // Update the user's OTP and expiry in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // Send the new OTP to the user's email
    const subject = "Your new OTP";
    await sendVerificationEmail(user.email, otpVerificationMail(otp), subject);

    return res.status(200).json({
      message: "A new OTP has been sent to your registered email.",
      tempToken, // Return the existing tempToken without reissuing a new one
      userId: user.id,
    });
  } catch (error) {
    // Handle token verification errors
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Expire tempToken:", error);
      return res.status(401).json({
        message:
          "Your session has expired. Please log in again to continue and keep your account secure",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("possible tampered tempToken:", error);
      return res
        .status(401)
        .json({ message: "Login session aborted. Please log in again." });
    } else {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        message: "An error occurred while sending OTP . Please try again.",
      });
    }
  }
};

export default resendOtp;

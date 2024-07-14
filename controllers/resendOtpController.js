import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateOtp } from "../helpers/generateTokens.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { otpVerificationMail } from "../emails/otpVerificationMail.js";

const prisma = new PrismaClient();

const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before requesting a new OTP.",
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 4); // Set OTP expiry to 2 minutes from now

    await prisma.user.update({
      where: { id: user.id },
      data: { otp, otpExpiry },
    });

    // Send the new OTP to the user's email
    const subject = "Your new OTP";
    await sendVerificationEmail(user.email, otpVerificationMail(otp), subject);

    const tempToken = jwt.sign(
      { userId: user.id },
      process.env.TEMP_JWT_SECRET,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      message: "A new OTP has been sent to your registered email.",
      tempToken,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return res
      .status(500)
      .json({ message: "Failed to resend OTP, please try again later." });
  }
};

export default resendOtp;

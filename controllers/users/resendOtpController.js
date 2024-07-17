import { PrismaClient } from "@prisma/client";
import { generateOtp } from "../../helpers/generateTokens.js";
import { sendMail } from "../../services/emailService.js";
import { otpVerificationMail } from "../../emails/otpVerificationMail.js";

const prisma = new PrismaClient();

const resendOtp = async (req, res) => {
  const user = req.user; // Extracted by verifyTempToken middleware

  try {
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
    await sendMail(user.email, otpVerificationMail(otp), subject);

    res.status(200).json({
      message: "A new OTP has been sent to your registered email.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      message:
        "An error occurred while resending the OTP. Please try again later.",
    });
  }
};

export default resendOtp;

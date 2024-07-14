// verifyOtpController.js
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const verifyOtp = async (req, res) => {
  const otp = req.body.otp;

  const { user } = req; // User is already set by the verifyTempToken middleware

  if (!user) {
    return res.status(404).json({ message: "Unauthorized, user unknown." });
  }

  // Check if OTP is set or already verified
  if (!user.otp) {
    console.log("OTP set or already verified");
    return res.status(403).json({
      message: "Operation not allowed",
    });
  }

  // Check if the provided OTP matches the stored OTP
  if (otp !== user.otp) {
    return res.status(401).json({
      message: "OTP does not match. Please enter a valid OTP.",
    });
  }

  // Check if the OTP has expired
  if (new Date() > new Date(user.otpExpiry)) {
    return res.status(401).json({
      message: "Expired OTP. Please request a new one.",
    });
  }

  // OTP is correct and not expired, proceed with user verification
  const authToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Example expiration time
  );

  // Clear the OTP and its expiry from the database to prevent reuse
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiry: null },
  });

  // Respond with the new authToken after successful verification
  res.status(200).json({
    message: "OTP verified successfully. You are now logged in.",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNo: user.phoneNo,
      emailVerified: user.emailVerified,
      kycProfileId: user.kycProfileId,
      kycProfile: user.kycProfile,
    },
    authToken,
  });
};

export default verifyOtp;

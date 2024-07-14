import { generateOtp } from "../helpers/generateTokens.js";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const saveOtpToDatabase = async (userId, otp) => {
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes

  await prisma.user.update({
    where: { id: userId },
    data: { otp, otpExpiry },
  });
};

export const sendOtp = async (user) => {
  const otp = generateOtp();
  await saveOtpToDatabase(user.id, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

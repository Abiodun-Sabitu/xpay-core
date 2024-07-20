// ForgotPassword.js
import { PrismaClient } from "@prisma/client";
import { sendMail } from "../../services/emailService.js";
import { generateRandomToken } from "../../helpers/generateTokens.js";
import { passwordResetMail } from "../../emails/passwordResetMail.js";

const prisma = new PrismaClient();

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Log internally that an attempt was made for a non-existent email
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        message:
          "If that email address is in our system, we've sent a password reset link.",
      });
    }

    const resetToken = generateRandomToken();
    const tokenExpiry = new Date(Date.now() + 600000); // 10 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: resetToken,
        tokenExpiry: tokenExpiry,
      },
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    const subject = `x-PAY PASSWORD RESET`;
    await sendMail(
      user.email,
      passwordResetMail(resetLink, user.firstName),
      subject
    );
    res.status(200).json({
      message:
        "If that email address is in our system, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("Failed to process password reset:", error);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};

export default forgotPassword;

// resetPasswordController.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find user by reset token and check if token is still valid
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiry: {
          gt: new Date(), // checks if the token expiry time is greater than the current time
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired  password reset link." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user with new hashed password and remove reset token and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        verificationToken: null, // Clear the reset token
        tokenExpiry: null, // Clear the token expiry date
      },
    });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res
      .status(500)
      .json({ message: "Unable to reset password, please try again." });
  }
};

export default resetPassword;

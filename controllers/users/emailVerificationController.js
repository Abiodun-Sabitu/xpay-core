import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const verifyUserEmail = async (req, res) => {
  const { token } = req.query;
  try {
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const userId = decoded.id; // Assuming the token includes the user ID

    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId.trim() },
    });

    if (!user) {
      return res.status(404).send("User not found.");
    } else if (user.emailVerified) {
      return res.status(400).send("Email is already verified.");
    }

    // Check if the token matches and is still valid
    if (
      user.verificationToken !== token ||
      new Date() > new Date(user.tokenExpiry)
    ) {
      return res.status(401).send("Invalid or expired verification link");
    }

    // Update user's email verified status and clear the token
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verificationToken: null, // Clear the token from the database
        tokenExpiry: null, // Optionally clear the expiry date
      },
    });

    res.send("Email verified successfully!");
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("Invalid or expired token.");
    } else {
      console.error("Verification failed:", error);
      res.status(500).send("Error 500, please contact admin.");
    }
  }
};

export default verifyUserEmail;

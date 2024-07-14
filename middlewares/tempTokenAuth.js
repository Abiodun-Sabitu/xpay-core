// tempTokenAuth.js
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyTempToken(req, res, next) {
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
    req.user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!req.user) {
      return res.status(404).json({ message: "Unauthorized, user unknown" });
    }

    if (!req.user.emailVerified) {
      console.log("Please verify your email before requesting a new OTP");
      return res.status(403).json({ message: "Operation Forbidden" });
    }

    next();
  } catch (error) {
    // Handle token verification errors
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Expired tempToken:", error);
      return res.status(401).json({
        message:
          "Your session has expired. Please log in again to continue and keep your account secure",
      });
    } else error instanceof jwt.JsonWebTokenError;
    console.error("Possible tampered tempToken:", error);
    return res
      .status(401)
      .json({ message: "Login session aborted. Please log in again." });
  }
}

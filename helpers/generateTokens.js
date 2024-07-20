import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
// Load environment variables from .env file
dotenv.config();

/**
 * Generates a JWT for use in email verification links.
 * @param {Object} payload - The payload to encode in the JWT.
 * @returns {string} - Returns the JWT.
 */
export function generateEmailVerificationToken(payload) {
  const secretKey = process.env.JWT_SECRET; // Ensure you have JWT_SECRET defined in your .env file
  const options = { expiresIn: "24h" }; // Token expires in 24 hours
  return jwt.sign(payload, secretKey, options);
}

export const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generates a secure random token using the crypto library.
 * @return {string} A secure random token.
 */
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex"); // Generates a 64-character hexadecimal token
};

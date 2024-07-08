import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Generates a JWT for use in email verification links.
 * @param {Object} payload - The payload to encode in the JWT.
 * @returns {string} - Returns the JWT.
 */
export function generateToken(payload) {
  const secretKey = process.env.JWT_SECRET; // Ensure you have JWT_SECRET defined in your .env file
  const options = { expiresIn: "24h" }; // Token expires in 24 hours
  return jwt.sign(payload, secretKey, options);
}

// authMiddleware.js
import jwt from "jsonwebtoken";
export function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized Operation" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // More detailed and specific error handling
      if (err instanceof jwt.TokenExpiredError) {
        console.error("Expired tempToken:", err);
        return res.status(401).json({
          message:
            "Your session has expired. Please log in again to continue and keep your account secure",
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        console.error("Possible tampered tempToken:", err);
        return res.status(401).json({
          message:
            "Your session has expired or is invalid. Please log in again to continue.",
        });
      } else {
        return res.status(401).json({
          message: "Unauthorized: Authentication could not be processed",
        });
      }
    }
    req.user = decoded.userId; // Attach the decoded payload to request object
    console.log(req.user);
    next();
  });
}

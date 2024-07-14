// authMiddleware.js
import jwt from "jsonwebtoken";

export function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract the token from Bearer

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Handle different kinds of errors
        if (err.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ message: "Unauthorized: Token has expired" });
        } else if (err.name === "JsonWebTokenError") {
          return res
            .status(401)
            .json({ message: "Unauthorized: Invalid token" });
        } else {
          return res
            .status(401)
            .json({ message: "Unauthorized: Token could not be processed" });
        }
      } else {
        req.user = decoded; // Attach the decoded payload to request object
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }
}

// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import "dotenv/config";
// const prisma = new PrismaClient();

// const verifyOtp = async (req, res) => {
//   // Retrieve the temporary token from the request headers
//   // const tempToken = req.headers.authorization?.split(" ")[1];
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized Operation" });
//   }
//   const tempToken = authHeader.split(" ")[1];

//   if (!tempToken) {
//     return res.status(401).json({ message: "Unauthorized Operation" });
//   }
//   console.log(tempToken);
//   let userId;
//   try {
//     // Decode the temporary token to extract the userId
//     const decoded = jwt.verify(tempToken, process.env.TEMP_JWT_SECRET);
//     userId = decoded.userId;
//     console.log(userId);
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized user" });
//   }

//   const { otp } = req.body;
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user) {
//     return res.status(404).send("User not found.");
//   }

//   if (user.otp === otp && new Date() <= new Date(user.otpExpiry)) {
//     // OTP is correct and not expired
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     // Optionally clear the OTP after successful verification
//     await prisma.user.update({
//       where: { id: userId },
//       data: { otp: null, otpExpiry: null },
//     });

//     return res.status(200).json({
//       message: "Login successful.",
//       token,
//       user: { name: user.name, email: user.email },
//     });
//   } else {
//     return res.status(401).send("Invalid or expired OTP.");
//   }
// };

// export default verifyOtp;
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const verifyOtp = async (req, res) => {
  const otp = req.body.otp;

  // Handle request validation errors
  if (req.validationError) {
    const errorMessages = req.validationError.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errorMessages.join("\n")); // Send validation errors
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized Operation" });
  }
  const tempToken = authHeader.split(" ")[1];

  if (!tempToken) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    // Authenticate and decode the temporary token
    const decoded = jwt.verify(tempToken, process.env.TEMP_JWT_SECRET);
    const userId = decoded.userId;

    // Retrieve the OTP and its expiry from the user record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { otp: true, otpExpiry: true, wallets: true },
    });

    // Ensure user exists and OTP data is available
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "Unauthorized, user unknown." });
    }
    if (!user.otp) {
      console.log("OTP not set or already verified");
      return res.status(403).json({
        message: "Operation Forbidden",
      });
    }

    // Validate the OTP against the stored value and check its expiry
    if (otp === user.otp && new Date() < new Date(user.otpExpiry)) {
      // Generate a new authToken for further authenticated sessions
      const authToken = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Example expiration time
      );

      // Clear the OTP and its expiry from the database to prevent reuse
      await prisma.user.update({
        where: { id: userId },
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
          kycProfileId: user.kycProfileId, // Include the KYCProfileId directly in the user object
          kycProfile: user.kycProfile
            ? {
                street: user.kycProfile.street,
                city: user.kycProfile.city,
                state: user.kycProfile.state,
                country: user.kycProfile.country,
                photo: user.kycProfile.photo,
                bvn: user.kycProfile.bvn,
                addressDocument: user.kycProfile.addressDocument,
                validID: user.kycProfile.validID,
              }
            : null,
        },
        authToken: authToken, // Assuming authToken is the JWT or similar token generated after login
        wallets: user.wallets
          ? user.wallets.map((wallet) => ({
              id: wallet.id,
              accountNumber: wallet.accountNumber,
              currency: wallet.currency,
              balance: wallet.balance,
            }))
          : [],
      });
    } else {
      // Respond with an error if OTP is invalid or expired
      return res.status(401).json({
        message: "Invalid OTP or OTP has expired. Please request a new one.",
      });
    }
  } catch (error) {
    // Handle token verification errors
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Expire tempToken:", error);
      return res.status(401).json({
        message:
          "Your session has expired. Please log in again to continue and keep your account secure",
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("possible tampered tempToken:", error);
      return res
        .status(401)
        .json({ message: "Login session aborted. Please log in again." });
    } else {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        message: "An error occurred during OTP verification. Please try again.",
      });
    }
  }
};

export default verifyOtp;

// // // onboardingController.js

// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";
// import { emailVerificationContent } from "../emails/emailVerificationMail.js";
// import { sendVerificationEmail } from "../services/emailService.js";
// import { generateEmailVerificationToken } from "../helpers/generateTokens.js";

// const prisma = new PrismaClient();
// const tokenExpiry = new Date(new Date().getTime() + 24 * 3600 * 1000);

// const onboardUser = async (req, res) => {
//   const { firstName, lastName, email, phoneNo, password } = req.body;

//   if (req.validationError) {
//     // Extract and format the validation errors to a simple list of messages
//     const errorMessages = req.validationError.details.map(
//       (detail) => detail.message
//     );

//     // Join the error messages into a single string if you want all in one line
//     const errorMessageString = errorMessages.join("\n");

//     return res.status(400).send(errorMessageString);
//   }

//   try {
//     // Check if user already exists

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ email: email }, { phoneNo: phoneNo }],
//       },
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         message: "A user with the given email or phone number already exists.",
//       });
//     }

//     // Hash the password before storing it
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user in the database with initial unverified status
//     const newUser = await prisma.user.create({
//       data: {
//         firstName,
//         lastName,
//         email,
//         phoneNo,
//         password: hashedPassword,
//         emailVerified: false,
//         tokenExpiry: tokenExpiry, // 24 hours from now
//       },
//     });

//     if (newUser) {
//       const userId = newUser.id; // newUser is the result of the Prisma create call
//       const verificationToken = generateEmailVerificationToken({ id: userId }); // Generate token using user ID
//       const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
//       const subject = "VERIFY YOUR EMAIL";
//       // Send verification email
//       await sendVerificationEmail(
//         newUser.email,
//         emailVerificationContent(verificationUrl, newUser.firstName),
//         subject
//       );

//       // Respond to the client
//       res.status(201).json({
//         messages:
//           "Signup successful!\n Please check your email (and spam folder) to verify your account and complete the onboarding process.",
//         userId: newUser.id,
//       });
//     } else {
//       return res
//         .status(500)
//         .json({ message: "DB error, please contact admin." });
//     }
//   } catch (error) {
//     console.error("Onboarding failed:", error); // Log the detailed error for internal review

//     // Check if the error should be exposed
//     if (process.env.NODE_ENV === "development") {
//       // In development, send back detailed errors to facilitate debugging
//       res.status(500).json({ error: error.message });
//     } else {
//       // In production, send a generic error message
//       res.status(500).json({
//         error:
//           "An issue occurred during your request. Please try again or contact support if the problem persists.",
//       });
//     }
//   }
// };

// export default onboardUser;

// import bcrypt from "bcrypt";
// import { PrismaClient } from "@prisma/client";
// import { emailVerificationContent } from "../emails/emailVerificationMail.js";
// import { sendVerificationEmail } from "../services/emailService.js";
// import { generateEmailVerificationToken } from "../helpers/generateTokens.js";

// const prisma = new PrismaClient();

// const onboardUser = async (req, res) => {
//   const { firstName, lastName, email, phoneNo, password } = req.body;

//   // Handle request validation errors
//   if (req.validationError) {
//     const errorMessages = req.validationError.details.map(
//       (detail) => detail.message
//     );
//     return res.status(400).send(errorMessages.join("\n")); // Send validation errors
//   }

//   try {
//     // Begin a database transaction with a custom timeout to ensure atomicity
//     const userRecord = await prisma.$transaction(
//       async (transaction) => {
//         // Check if user already exists based on email or phone number
//         const existingUser = await transaction.user.findFirst({
//           where: { OR: [{ email }, { phoneNo }] },
//         });
//         if (existingUser) {
//           throw new Error("409 User already exists"); // Throw an error to abort the transaction
//         }

//         // Hash the user's password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user record in the database
//         const newUser = await transaction.user.create({
//           data: {
//             firstName,
//             lastName,
//             email,
//             phoneNo,
//             password: hashedPassword,
//             emailVerified: false, // Set email as unverified initially
//           },
//         });

//         // Generate a verification token using the new user's ID
//         const userId = newUser.id;
//         const verificationToken = generateEmailVerificationToken({
//           id: userId,
//         });

//         const tokenExpiry = new Date(new Date().getTime() + 24 * 3600 * 1000); // Set token expiry for 24 hours from now

//         // Send a verification email to the new user
//         const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
//         await sendVerificationEmail(
//           newUser.email,
//           emailVerificationContent(verificationUrl, newUser.firstName),
//           "VERIFY YOUR EMAIL"
//         );

//         // Update the new user record with the verification token and its expiry
//         await transaction.user.update({
//           where: { id: newUser.id },
//           data: {
//             verificationToken: verificationToken,
//             tokenExpiry: tokenExpiry,
//           },
//         });

//         return newUser; // Return the newly created user record
//       },
//       {
//         timeout: 60000, // Set timeout to 30 seconds
//       }
//     );

//     // Respond to the client that the signup was successful
//     res.status(201).json({
//       message:
//         "Signup successful! Please check your email (and spam folder) to verify your account and complete the onboarding process.",
//       userId: userRecord.id,
//     });
//   } catch (error) {
//     // Log and handle any errors that occurred during the process
//     console.error("Onboarding failed:", error);
//     if (error.message.includes("409")) {
//       res.status(409).json({
//         error: "A user with the given email or phone number already exists.",
//       });
//     } else {
//       res.status(500).json({
//         error:
//           "An error occurred during the user registration process. Please contact admin",
//       });
//     }
//   }
// };

// export default onboardUser;

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { emailVerificationContent } from "../emails/emailVerificationMail.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { generateEmailVerificationToken } from "../helpers/generateTokens.js";

const prisma = new PrismaClient();

const onboardUser = async (req, res) => {
  const { firstName, lastName, email, phoneNo, password } = req.body;

  // Handle request validation errors
  if (req.validationError) {
    const errorMessages = req.validationError.details.map(
      (detail) => detail.message
    );
    return res.status(400).send(errorMessages.join("\n")); // Send validation errors
  }

  try {
    // Check if user already exists based on email or phone number
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNo }] },
    });
    if (existingUser) {
      return res.status(409).json({
        error: "A user with the given email or phone number already exists.",
      });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token using the new user's ID
    const tokenExpiry = new Date(new Date().getTime() + 24 * 3600 * 1000); // Set token expiry for 24 hours from now

    // Begin a database transaction to ensure atomicity
    const userRecord = await prisma.$transaction(async (transaction) => {
      // Create a new user record in the database
      const newUser = await transaction.user.create({
        data: {
          firstName,
          lastName,
          email,
          phoneNo,
          password: hashedPassword,
          emailVerified: false, // Set email as unverified initially
        },
      });

      const userId = newUser.id;
      const verificationToken = generateEmailVerificationToken({ id: userId });

      // Update the new user record with the verification token and its expiry
      await transaction.user.update({
        where: { id: newUser.id },
        data: {
          verificationToken: verificationToken,
          tokenExpiry: tokenExpiry,
        },
      });

      return { ...newUser, verificationToken }; // Return the newly created user record with the token
    });

    // Log the generated token to verify it's not null
    console.log(
      `Generated verification token: ${userRecord.verificationToken}`
    );

    // Send a verification email to the new user
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${userRecord.verificationToken}`;
    await sendVerificationEmail(
      userRecord.email,
      emailVerificationContent(verificationUrl, userRecord.firstName),
      "VERIFY YOUR EMAIL"
    );

    // Respond to the client that the signup was successful
    res.status(201).json({
      message:
        "Signup successful! Please check your email (and spam folder) to verify your account and complete the onboarding process.",
      userId: userRecord.id,
    });
  } catch (error) {
    // Log and handle any errors that occurred during the process
    console.error("Onboarding failed:", error);
    res.status(500).json({
      error:
        "An error occurred during the user registration process. Please contact admin",
    });
  }
};

export default onboardUser;

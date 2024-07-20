import express from "express";
// import basicAuth from "express-basic-auth";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swaggerConfig.js"; // Importing the options
import onboardUserRoutes from "./routes/users/onboardUserRoute.js";
import emailVerificationRoute from "./routes/users/emailVerificationRoute.js";
import userLoginRoute from "./routes/users/userLoginRoute.js";
import otpVerificationRoute from "./routes/users/otpVerificationRoute.js";
import resendOtpRoute from "./routes/users/resendOtpRoute.js";
import createFxWalletRoute from "./routes/wallets/create-fx-walletRoute.js";
import createNgnWalletRoute from "./routes/wallets/create-ngn-walletRoute.js";
import fetchWalletsRoute from "./routes/wallets/fetchWalletsRoute.js";
import transferRoute from "./routes/transactions/transferRoute.js";
import nameEnquiryRoute from "./routes/wallets/nameEnquiryRoute.js";
import forgotPasswordRoute from "./routes/users/forgotPasswordRoute.js";
import resetPasswordRoute from "./routes/users/resetPasswordRoute.js";
const app = express();
const specs = swaggerJsdoc(options);

app.use(express.json());

// Set up Swagger UI to serve the generated Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// app.use(
//   "/api-docs",
//   basicAuth({
//     users: { admin: "password123@" }, // Replace 'admin' and 'password' with your desired credentials
//     challenge: true, // This will cause most browsers to show a popup to enter credentials
//   }),
//   swaggerUi.serve,
//   swaggerUi.setup(specs)
// );

// Use your routes
app.use(onboardUserRoutes);
app.use(emailVerificationRoute);
app.use(userLoginRoute);
app.use(otpVerificationRoute);
app.use(resendOtpRoute);
app.use(createFxWalletRoute);
app.use(createNgnWalletRoute);
app.use(fetchWalletsRoute);
app.use(transferRoute);
app.use(nameEnquiryRoute);
app.use(forgotPasswordRoute);
app.use(resetPasswordRoute);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Define the Swagger configuration object
export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "X-PAY CORE",
    version: "1.0.0",
    description: "This is a REST API application for X-PAY Bank",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        // This name can be any string, used to reference the security scheme
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token in the following format: Bearer <token>",
      },
    },
  },
  security: [
    {
      BearerAuth: [], // References the security scheme defined above
    },
  ],
};

// Options for the swagger-jsdoc
export const options = {
  swaggerDefinition,
  apis: [
    "./routes/users/onboardUserRoute.js",
    "./routes/users/emailVerificationRoute.js",
    "./routes/users/userLoginRoute.js",
    "./routes/users/otpVerificationRoute.js",
    "./routes/users/resendOtpRoute.js",
    "./routes/wallets/create-fx-walletRoute.js",
    "./routes/wallets/create-ngn-walletRoute.js",
    "./routes/wallets/fetchWalletsRoute.js",
    "./routes/transactions/transferRoute.js",
  ], // Make sure this path is correct and points to your route files
};

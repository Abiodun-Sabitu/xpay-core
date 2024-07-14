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
    "./routes/onboardUserRoute.js",
    "./routes/emailVerificationRoute.js",
    "./routes/userLoginRoute.js",
    "./routes/otpVerificationRoute.js",
    "./routes/resendOtpRoute.js",
  ], // Make sure this path is correct and points to your route files
};

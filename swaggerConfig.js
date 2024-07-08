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
};

// Options for the swagger-jsdoc
export const options = {
  swaggerDefinition,
  apis: ["./routes/onboardUserRoute.js"], // Make sure this path is correct and points to your route files
};

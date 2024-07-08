// General validation function
// const validate = (schema) => (req, res, next) => {
//   const { error } = schema.validate(req.body, { abortEarly: false });
//   if (error) {
//     const errors = error.details.map((detail) => detail.message);
//     return res.status(400).json({ errors });
//   }
//   next();
// };

// export default validate;

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    req.validationError = error; // Attach the error to the request object
    next(); // Continue to the next middleware or controller
  } else {
    next(); // Continue processing if no error
  }
};

export default validate;

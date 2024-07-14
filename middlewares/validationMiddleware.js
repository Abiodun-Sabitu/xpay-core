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

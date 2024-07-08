import Joi from "joi";

// Schema for user onboarding
export const onboardUserSchema = Joi.object({
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  email: Joi.string().email().trim().required(),
  phoneNo: Joi.string().trim().min(1).max(11).required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W])"))
    .messages({
      "string.min": "Password must be at least 6 characters long.",
      "string.pattern.base":
        "Password must contain at least one uppercase, one number, and one special character.",
    })
    .required(),
});

// You can define other schemas for different endpoints here

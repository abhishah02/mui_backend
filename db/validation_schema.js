const Joi = require("joi");

const registerSchema = Joi.object({
  USER_NAME: Joi.string().required(),
  USER_EMAIL: Joi.string().email().lowercase().required(),
  USER_PASSWORD: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};

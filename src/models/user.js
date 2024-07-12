const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required(),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

module.exports = { userSchema, loginSchema };

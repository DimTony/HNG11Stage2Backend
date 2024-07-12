const Joi = require('joi');
const { userSchema, loginSchema } = require('../models/user');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.context.key,
      message: err.message,
    }));
    return res.status(422).json({ errors });
  }
  next();
};

module.exports = {
  validateUser: validate(userSchema),
  validateLogin: validate(loginSchema),
};

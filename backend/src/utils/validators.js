const { body } = require("express-validator");

const nameValidators = body("name")
  .isLength({ min: 20, max: 60 })
  .withMessage("Name must be between 20 and 60 characters");

const addressValidators = body("address")
  .isLength({ max: 400 })
  .withMessage("Address max 400 characters");

const passwordValidators = body("password")
  .isLength({ min: 8, max: 16 })
  .withMessage("Password must be 8-16 chars")
  .matches(/[A-Z]/).withMessage("Password must contain one uppercase")
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain one special char");

const emailValidators = body("email").isEmail().withMessage("Invalid email");

module.exports = {
  nameValidators,
  addressValidators,
  passwordValidators,
  emailValidators
};

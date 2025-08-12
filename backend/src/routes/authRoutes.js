const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { nameValidators, addressValidators, emailValidators, passwordValidators } = require("../utils/validators");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", [
  nameValidators, emailValidators, addressValidators, passwordValidators
], authController.register);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware, authController.me);

module.exports = router;

const { User, Store, Rating } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const signToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, address, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, address, passwordHash: hash, role: role || "user" });
    const token = signToken(user);
    // *** CHANGED LINE ***
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = signToken(user);
    // *** CHANGED LINE ***
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ["id","name","email","address","role"] });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

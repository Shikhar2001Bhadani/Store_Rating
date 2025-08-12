const { User, Store, Rating } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

// Admin: list users
exports.listUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, name, email, address, role, sortField="name", sortOrder="ASC" } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAndCountAll({
      where,
      limit: +pageSize,
      offset: (page-1)*pageSize,
      order: [[sortField, sortOrder]],
      attributes: ["id","name","email","address","role"]
    });

    return res.json({ total: users.count, users: users.rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, address, passwordHash: hash, role: role || "user" });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id);
    const hash = await bcrypt.hash(password, 10);
    user.passwordHash = hash;
    await user.save();
    return res.json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id, { attributes: ["id","name","email","address","role"] });
    if (!user) return res.status(404).json({ message: "Not found" });

    // if store owner include rating of their store(s)
    if (user.role === "owner") {
      const stores = await Store.findAll({ where: { ownerId: user.id }});
      return res.json({ user, stores });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Admin: delete user
exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    if (req.user.id === id) return res.status(400).json({ message: "Cannot delete own account" });

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Not found" });

    await Rating.destroy({ where: { userId: id } });
    await Store.update({ ownerId: null }, { where: { ownerId: id } });
    await user.destroy();
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
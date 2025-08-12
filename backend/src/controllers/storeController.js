const { Store, Rating, User } = require("../models");
const { Op } = require("sequelize");

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId });
    return res.json({ store });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.listStores = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, name, email, address, sortField = "name", sortOrder = "ASC" } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const stores = await Store.findAndCountAll({
      where,
      order: [[sortField, sortOrder]],
      limit: +pageSize,
      offset: (page - 1) * pageSize,
      include: [{ model: Rating, as: "ratings" }]
    });

    // compute average rating per store
    const rows = stores.rows.map(s => {
      const avg = s.ratings.length ? (s.ratings.reduce((a,b) => a + b.ratingValue, 0) / s.ratings.length) : 0;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        address: s.address,
        ownerId: s.ownerId,
        averageRating: +avg.toFixed(2)
      };
    });

    return res.json({ total: stores.count, stores: rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, { include: [{ model: Rating, as: "ratings", include: [{ model: User, as: "user", attributes: ["id","name","email"] }] }] });
    if (!store) return res.status(404).json({ message: "Not found" });
    const avg = store.ratings.length ? (store.ratings.reduce((a,b)=> a + b.ratingValue,0) / store.ratings.length) : 0;
    return res.json({ store, averageRating: +avg.toFixed(2) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getStoreRatingsForOwner = async (req, res) => {
  try {
    // owner sees ratings for stores they own
    const ownerId = req.user.id;
    const stores = await Store.findAll({ where: { ownerId }, include: [{ model: Rating, as: "ratings", include: [{ model: User, as: "user", attributes: ["id","name","email"] }]}]});
    const data = stores.map(s => {
      const avg = s.ratings.length ? (s.ratings.reduce((a,b)=> a + b.ratingValue,0) / s.ratings.length) : 0;
      return { storeId: s.id, name: s.name, average: +avg.toFixed(2), ratings: s.ratings };
    });
    return res.json({ stores: data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, address, ownerId } = req.body;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: "Not found" });
    if (typeof name !== "undefined") store.name = name;
    if (typeof email !== "undefined") store.email = email;
    if (typeof address !== "undefined") store.address = address;
    if (typeof ownerId !== "undefined") store.ownerId = ownerId;
    await store.save();
    return res.json({ store });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const id = req.params.id;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: "Not found" });
    // Remove dependent ratings first to satisfy FK constraints
    await Rating.destroy({ where: { storeId: id } });
    await store.destroy();
    return res.json({ message: "Store deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
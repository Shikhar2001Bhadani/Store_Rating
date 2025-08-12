const { Rating, Store } = require("../models");

exports.submitRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, ratingValue, comment } = req.body;
    if (!storeId || !ratingValue) return res.status(400).json({ message: "Missing data" });
    if (ratingValue < 1 || ratingValue > 5) return res.status(400).json({ message: "Rating must be 1-5" });

    // allow update: if user already rated store, update value
    let rating = await Rating.findOne({ where: { storeId, userId } });
    if (rating) {
      rating.ratingValue = ratingValue;
      if (typeof comment !== "undefined") rating.comment = comment;
      await rating.save();
    } else {
      rating = await Rating.create({ storeId, userId, ratingValue, comment: comment || null });
    }

    // update average on store
    const ratings = await Rating.findAll({ where: { storeId } });
    const avg = ratings.length ? (ratings.reduce((a,b) => a + b.ratingValue, 0) / ratings.length) : 0;
    const store = await Store.findByPk(storeId);
    if (store) {
      store.averageRating = +avg.toFixed(2);
      await store.save();
    }

    return res.json({ rating, average: +avg.toFixed(2) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getUserRatingForStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.storeId;
    const rating = await Rating.findOne({ where: { userId, storeId } });
    return res.json({ rating });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const total = await Rating.count();
    return res.json({ total });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

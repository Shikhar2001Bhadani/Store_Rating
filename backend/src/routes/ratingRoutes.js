const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, ratingController.submitRating);
router.get("/user/:storeId", auth, ratingController.getUserRatingForStore);
router.get("/stats/total", ratingController.stats);

module.exports = router;

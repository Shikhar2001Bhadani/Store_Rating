const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, role("admin"), storeController.createStore);
router.get("/", storeController.listStores);
router.get("/owner/me/ratings", auth, role("owner"), storeController.getStoreRatingsForOwner);
router.get("/:id", storeController.getStore);
router.put("/:id", auth, role("admin"), storeController.updateStore);
router.delete("/:id", auth, role("admin"), storeController.deleteStore);

module.exports = router;

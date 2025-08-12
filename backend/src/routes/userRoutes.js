const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// admin-only routes
router.get("/", auth, role("admin"), userController.listUsers);
router.post("/", auth, role("admin"), userController.createUserByAdmin);
router.delete("/:id", auth, role("admin"), userController.deleteUser);

// user routes
router.put("/password", auth, userController.updatePassword);
router.get("/:id", auth, role(["admin","owner","user"]), userController.getUserDetails);

module.exports = router;

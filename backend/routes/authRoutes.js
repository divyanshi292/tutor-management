const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);

module.exports = router;

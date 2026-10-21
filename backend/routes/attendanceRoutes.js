const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const {
  getAttendanceByDate,
  saveAttendance,
  getAttendanceStats,
} = require("../controllers/attendanceController");

router.use(requireAuth);

router.get("/", getAttendanceByDate);
router.post("/", saveAttendance);
router.get("/stats", getAttendanceStats);

module.exports = router;

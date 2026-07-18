const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/authMiddleware");
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.use(requireAuth);
router.get("/", getStudents);
router.post("/", createStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;

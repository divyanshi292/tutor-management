const Student = require("../models/Student");

const getStudents = async (req, res, next) => {
  try {
    return res.json(await Student.find());
  } catch (error) {
    return next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    return res.status(201).json(student);
  } catch (error) {
    return next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(student);
  } catch (error) {
    return next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({ message: "Student deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
};

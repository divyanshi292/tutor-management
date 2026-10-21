const Student = require("../models/Student");

const editableFields = [
  "name",
  "section",
  "email",
  "phone",
  "parentName",
  "parentPhone",
  "feeStatus",
  "monthlyFee",
  "notes",
  "attendance",
  "status",
  "image",
];

const pickStudentFields = (body) =>
  Object.fromEntries(
    editableFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );

const getStudents = async (req, res, next) => {
  try {
    return res.json(
      await Student.find({ owner: req.user._id }).sort({ createdAt: -1 })
    );
  } catch (error) {
    return next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create({
      ...pickStudentFields(req.body),
      owner: req.user._id,
    });
    return res.status(201).json(student);
  } catch (error) {
    return next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      pickStudentFields(req.body),
      { returnDocument: "after", runValidators: true }
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
    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

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

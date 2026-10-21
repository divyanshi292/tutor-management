const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one record per tutor, student, and date
attendanceRecordSchema.index(
  { owner: 1, student: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("AttendanceRecord", attendanceRecordSchema);

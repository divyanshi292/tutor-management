const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      default: "General",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    parentName: {
      type: String,
      default: "",
      trim: true,
    },

    parentPhone: {
      type: String,
      default: "",
      trim: true,
    },

    feeStatus: {
      type: String,
      enum: ["Paid", "Pending", "Overdue"],
      default: "Paid",
    },

    monthlyFee: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    attendance: {
      type: String,
      default: "0%",
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      default: "Present",
    },

    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);

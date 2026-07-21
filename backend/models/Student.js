const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  name: {
    type: String,
    required: true,
  },

  section: {
    type: String,
    required: true,
  },

  attendance: {
    type: String,
    default: "0%",
  },

  status: {
    type: String,
    default: "Present",
  },

  image: {
    type: String,
    default:
      "https://cdn-icons-png.flaticon.com/512/6997/6997662.png",
  },

}, {
  timestamps: true,
});

module.exports =
  mongoose.model("Student", studentSchema);

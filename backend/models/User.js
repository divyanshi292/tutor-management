const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    default: "+91 9876543210",
  },

  subject: {
    type: String,
    default: "Mathematics",
  },

  experience: {
    type: String,
    default: "3 Years",
  },

  location: {
    type: String,
    default: "Ajmer, Rajasthan",
  },

  bio: {
    type: String,
    default:
      "Passionate tutor helping students improve their academic performance through engaging and interactive learning methods.",
  },

  teachingMode: {
    type: String,
    default: "Online & Offline",
  },

  notificationsEnabled: {
    type: Boolean,
    default: true,
  },

  autoApprove: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
});

module.exports =
  mongoose.model("User", userSchema);
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const resetPassword = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  const email = (process.argv[2] || "divyanshi@gmail.com").trim().toLowerCase();
  const newPassword = process.argv[3] || "password123";

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  console.log(`Successfully reset password for ${email} to "${newPassword}".`);
};

resetPassword()
  .catch((error) => {
    console.error(`Password reset failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

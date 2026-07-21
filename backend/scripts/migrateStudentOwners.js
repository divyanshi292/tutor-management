const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("../models/Student");
const User = require("../models/User");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const migrateStudentOwners = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI);

  let owner;
  const requestedEmail = process.env.MIGRATION_USER_EMAIL?.trim().toLowerCase();

  if (requestedEmail) {
    owner = await User.findOne({ email: requestedEmail });
    if (!owner) {
      throw new Error("No user matches MIGRATION_USER_EMAIL");
    }
  } else {
    const users = await User.find().select("_id").limit(2);
    if (users.length !== 1) {
      throw new Error(
        "Expected exactly one user. Set MIGRATION_USER_EMAIL to choose an owner."
      );
    }
    [owner] = users;
  }

  const result = await Student.updateMany(
    { $or: [{ owner: { $exists: false } }, { owner: null }] },
    { $set: { owner: owner._id } }
  );

  console.log(`Assigned ${result.modifiedCount} existing student(s) to the user.`);
};

migrateStudentOwners()
  .catch((error) => {
    console.error(`Student owner migration failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

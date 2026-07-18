const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes =
  require("./routes/authRoutes");

const studentRoutes =
  require("./routes/studentRoutes");
const app = express();

// Middleware

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);


// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

// Test Route

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Server

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
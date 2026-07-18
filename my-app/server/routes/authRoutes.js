const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/User");

// ================= SIGNUP =================

router.post("/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // Check Existing User

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }

    // Hash Password

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create User

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate Token

    const token = jwt.sign(

      { id: user._id },

      "secretkey",

      {
        expiresIn: "7d",
      }

    );

    res.status(201).json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

// ================= LOGIN =================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // Find User

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User not found",
      });

    }

    // Compare Password

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid credentials",
      });

    }

    // Generate Token

    const token = jwt.sign(

      { id: user._id },

      "secretkey",

      {
        expiresIn: "7d",
      }

    );

    res.json({

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});

module.exports = router;
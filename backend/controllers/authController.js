const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    return res.status(201).json({
      token: createToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: createToken(user._id),
      user: formatUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { signup, login };

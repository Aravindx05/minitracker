const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json("User already exists");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hash
    });

    res.json("User registered");

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json("Internal Server Error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt:", email); // debug

    const user = await User.findOne({ email });

    // ✅ FIX 1: check if user exists
    if (!user) {
      return res.status(400).json("User not found");
    }

    // ✅ FIX 2: check password safely
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json("Invalid password");
    }

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({
      token,
      createdAt: user.createdAt
    });

  } catch (err) {
    console.error("Login error:", err); // VERY IMPORTANT
    res.status(500).json("Internal Server Error");
  }
});
module.exports = router;
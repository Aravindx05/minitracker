const router = require("express").Router();
const Data = require("../models/Data");
const jwt = require("jsonwebtoken");

// 🔐 AUTH MIDDLEWARE
function auth(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json("No token");
    }

    // handle "Bearer token"
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, "secret");

    req.userId = decoded.id;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    res.status(401).json("Invalid token");
  }
}

// 💾 SAVE DATA
router.post("/", auth, async (req, res) => {
  try {
    const { date, hours } = req.body;

    if (!date) {
      return res.status(400).json("Date required");
    }

    await Data.findOneAndUpdate(
      { userId: req.userId, date },
      { hours },
      { upsert: true }
    );

    res.json("Saved");
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json("Internal Server Error");
  }
});

// 📊 GET DATA
router.get("/", auth, async (req, res) => {
  try {
    const data = await Data.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
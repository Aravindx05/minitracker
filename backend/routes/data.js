const router = require("express").Router();
const Data = require("../models/Data");
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "secret");
  req.userId = decoded.id;
  next();
}

router.post("/", auth, async (req, res) => {
  const { date, hours } = req.body;

  await Data.findOneAndUpdate(
    { userId: req.userId, date },
    { hours },
    { upsert: true }
  );

  res.json("Saved");
});

router.get("/", auth, async (req, res) => {
  const data = await Data.find({ userId: req.userId });
  res.json(data);
});

module.exports = router;
const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: String,
  date: String,
  hours: Number
});

module.exports = mongoose.model("Data", dataSchema);
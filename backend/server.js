const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const cors = require("cors");

app.use(cors({
  origin: "*",   // for now allow all (later restrict)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/data", require("./routes/data"));

app.listen(5000, () => console.log("Server running on 5000"));
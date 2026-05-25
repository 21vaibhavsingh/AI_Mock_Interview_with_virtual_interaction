// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
const interviewRoutes = require("./routes/interview");
app.use("/api/interview", interviewRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
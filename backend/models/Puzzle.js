// server/models/Puzzle.js
const mongoose = require("mongoose");

const puzzleSchema = new mongoose.Schema({
  name: String,
  layout: [[String]], // 2D array of strings representing the board
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Puzzle", puzzleSchema);

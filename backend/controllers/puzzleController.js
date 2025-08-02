// server/controllers/puzzleController.js
const Puzzle = require("../models/Puzzle");

exports.getPuzzles = async (req, res) => {
  const puzzles = await Puzzle.find();
  res.json(puzzles);
};

exports.createPuzzle = async (req, res) => {
  const { name, layout } = req.body;
  const newPuzzle = new Puzzle({ name, layout });
  await newPuzzle.save();
  res.status(201).json(newPuzzle);
};

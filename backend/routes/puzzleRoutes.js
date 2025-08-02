// server/routes/puzzleRoutes.js
const express = require("express");
const router = express.Router();
const { getPuzzles, createPuzzle } = require("../controllers/puzzleController");

router.get("/", getPuzzles);
router.post("/", createPuzzle);

module.exports = router;

const express = require("express");
const router = express.Router();
const { generateQuestion, evaluateAnswer } = require("../aiService");

// Get AI Random Question
router.post("/question", async (req, res) => {
  try {
    const { domain, difficulty } = req.body;
    const question = await generateQuestion(domain, difficulty);
    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating question" });
  }
});

// Evaluate Answer
router.post("/evaluate", async (req, res) => {
  try {
    const { question, answer } = req.body;
    const evaluation = await evaluateAnswer(question, answer);
    res.json(evaluation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error evaluating answer" });
  }
});

module.exports = router;
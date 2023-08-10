const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Create a new question
router.post('/', async (req, res) => {
  const question = new Question(req.body);
  const savedQuestion = await question.save();
  res.json(savedQuestion);
});

// Get questions (with optional subject filtering)
router.get('/', async (req, res) => {
    const { subject } = req.query;
    console.log(subject);
    try {
      let questions = [];
      if (subject) {
        if (subject !== 'biology' && subject !== 'chemistry') {
          return res.status(400).json({ message: 'Invalid subject' });
        }
        questions = await Question.find({ subject: subject });
      } else {
        questions = await Question.find();
      }
      console.log(questions);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Get a question by ID
router.get('/:id', async (req, res) => {
  const question = await Question.findById(req.params.id);
  res.json(question);
});

// Update a question by ID
router.put('/:id', async (req, res) => {
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedQuestion);
});

// Delete a question by ID
router.delete('/:id', async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Question deleted' });
});

module.exports = router;

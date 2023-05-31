const express = require('express');
const multer = require('multer'); 
const upload = multer({dest: 'uploads/'});
const router = express.Router();
const Question = require('../models/Question');

// Create a new question
router.post('/', async (req, res) => {
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.json(savedQuestion);
});

// Get all questions
router.get('/', async (req, res) => {
    const questions = await Question.find();
    res.json(questions);
});

// Get a question by ID
router.get('/:id', async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.json(question);
});

// Update a question by ID
router.put('/:id', async (req, res) => {
    const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updatedQuestion);
});

// Delete a question by ID
router.delete('/:id', async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.json({message: 'Question deleted'});
});

module.exports = router;
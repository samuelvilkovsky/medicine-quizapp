const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  subject: String,
  id: Number,
  text: String,
  answers: [{
    text: String,
    isCorrect: Boolean
  }]
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

const express = require('express');
const mongoose = require('mongoose');
const Question = require('./models/Question'); // Import model
const questionsRoutes = require('./routes/questions'); // Import routes
const app = express();
app.use('/questions', questionsRoutes); // Use the routes
const port = 3000;

mongoose.connect('mongodb://localhost/med_app', {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', async (req, res) => {
    const question = await Question.find();
    res.json(question);
});

app.listen(port, () => {
    console.log(`Server listnening at http://localhost:${port}`);
});


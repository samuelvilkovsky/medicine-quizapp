const express = require('express');
const mongoose = require('mongoose');
const Question = require('./models/question'); // Import model
const questionsRoutes = require('./routes/questions'); // Import routes
const userRoutes = require('./routes/user'); // Import user route
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var corsOptions = {
    origin: 'http://localhost:3001',  // Zmeňte na adresu klienta
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,                
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // Niektoré staršie prehliadače (napr. IE11) nespracúvajú kódy HTTP 204
};  
app.use(cors(corsOptions));
app.options('*', cors())
app.use('/questions', questionsRoutes); // Use the routes
app.use('/user', userRoutes);

const port = 3000;

mongoose.connect('mongodb://localhost/med_app', {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', async (req, res) => {
    const question = await Question.find();
    res.json(question);
});

app.listen(port, () => {
    console.log(`Server listnening at http://localhost:${port}`);
});

const express = require('express');
const mongoose = require('mongoose');
// const Question = require('./models/question'); // Import model
const questionsRoutes = require('./routes/questions'); // Import routes
const userRoutes = require('./routes/user'); // Import user route
const AuthRoutes = require('./routes/verifyToken'); // Import token auth route
const testResultRoutes = require('./routes/testResults'); // Import test results route
const User = require('./models/user'); // Import user model
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
app.use('/testResult', testResultRoutes); // Use the test results route
app.use('/questions', questionsRoutes); // Use the routes
app.use('/user/verifyToken', AuthRoutes); 
app.use('/user', userRoutes);

const databaseConnection = process.env.MONGO_ATLAS_CONNECTION_STRING;
const port = 3000;

mongoose.connect(
    databaseConnection, 
    {useNewUrlParser: true, useUnifiedTopology: true})
    
    .catch(error => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });;

// app.get('/user', async (req, res) => {
//     const user = await User.find();
//     res.json(user);
// });

// app.get('/', async (req, res) => {
//     const question = await Question.find();
//     res.json(question);
// });

app.listen(port, () => {
    console.log(`Server listnening at http://localhost:${port}`);
});

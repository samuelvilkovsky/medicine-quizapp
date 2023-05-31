const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const Question = require('./models/Question');

mongoose.connect('mongodb://localhost:/med_app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connect to MongoDB', err));

const results = [];

fs.createReadStream('resources/bio1.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        importData(results);
    });

async function importData(data) {
    for (let row of data){
        console.log(row);
        console.log(row.isCorrect1);
        const question = new Question({
            text: row.question,
            answers: [
                {text: row.answer1, isCorrect: row.isCorrect1 == 1},
                {text: row.answer2, isCorrect: row.isCorrect2 == 1},
                {text: row.answer3, isCorrect: row.isCorrect3 == 1},
                {text: row.answer4, isCorrect: row.isCorrect4 == 1},
                {text: row.answer5, isCorrect: row.isCorrect5 == 1},
                {text: row.answer6, isCorrect: row.isCorrect6 == 1},
                {text: row.answer7, isCorrect: row.isCorrect7 == 1},
                {text: row.answer8, isCorrect: row.isCorrect8 == 1},
            ]
        });
        await question.save();
    }
    console.log('Data imported');
    mongoose.connection.close();
}
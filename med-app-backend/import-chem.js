/* IMPORT COMMAND FOR CHEMISTRY QUESTIONS (RUN IN TERMINAL):
scp -i medicine-quizapp-access.pem /Users/samuelvilkovsky/Development/medicine-quizapp-folder/med-app-backend/resources/chem1.csv ubuntu@16.170.202.251:~/medicine-quizapp/med-app-backend/resources/chem1.csv
*/

const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const Question = require('./models/Question');
require('dotenv').config();

const databaseConnection = process.env.MONGO_ATLAS_CONNECTION_STRING;
const reinsertFlag = process.argv.includes('--i');

mongoose.connect(databaseConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB (Chemistry)');
    if (reinsertFlag) {
      await Question.deleteMany({
        subject: 'chemistry',
      });
    }
    const chemResults = [];

    fs.createReadStream('resources/chem1.csv')
      .pipe(csvParser())
      .on('data', (data) => chemResults.push(data))
      .on('end', async () => {
        for (let i = 0; i < chemResults.length; i++) {
          const row = chemResults[i];
          console.log(row);
          console.log(row.isCorrect1);
          const existingQuestion = await Question.findOne({ text: row.question });

          if (existingQuestion && !reinsertFlag) {
            console.log(`Question "${row.question}" already exists at index ${i + 1}`);
            continue;
          }

          if (row.question === ''){
            console.log(`Question at index ${i + 1} is empty`);
            continue;
          }

          const question = new Question({
            subject: 'chemistry',
            id: row.id,
            text: row.question,
            answers: [
              { text: row.answer1, isCorrect: row.isCorrect1 == 1 },
              { text: row.answer2, isCorrect: row.isCorrect2 == 1 },
              { text: row.answer3, isCorrect: row.isCorrect3 == 1 },
              { text: row.answer4, isCorrect: row.isCorrect4 == 1 },
              { text: row.answer5, isCorrect: row.isCorrect5 == 1 },
              { text: row.answer6, isCorrect: row.isCorrect6 == 1 },
              { text: row.answer7, isCorrect: row.isCorrect7 == 1 },
              { text: row.answer8, isCorrect: row.isCorrect8 == 1 },
            ]
          });
          await question.save();
        }
        console.log('Chemistry data imported');
        mongoose.connection.close();
      });
  })
  .catch(err => console.log('Could not connect to MongoDB', err));
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './components/Question';

const Quiz = () => {
    const[questions, setQuestions] = useState([]);
    const[testQuestions, setTestQuestions] = useState([]);
    const[range, setRange] = useState({start: 0, end: 0});
    const[seconds, setSeconds] = useState(0);
    const[isTimerRunning, setIsTimerRunning] = useState(false);
    const[showResults, setShowResults] = useState(false);
    const[correctCount, setCorrectCount] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await axios.get('http://localhost:3000/questions');
            setQuestions(response.data);
        };
        fetchQuestions();
    }, []);

    useEffect(() => {
        let interval = null;
        if (isTimerRunning){
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isTimerRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, seconds]);

    const submitQuiz = () => {
        setIsTimerRunning(false);
        setShowResults(true);

        let correct = 0;
        testQuestions.forEach(question => {
            question.answers.forEach(answer => {
                if(answer.clicked && answer.isCorrect){
                    correct++;
                }
            });
        });
        setCorrectCount(correct);
    }

    // A function to shuffle an array
    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    const generateRandomTest = () => {
        // Shuffle the original questions array
        let shuffledQuestions = shuffle(questions);
        // Take the first 20 questions or all if there are less
        let generatedTest = shuffledQuestions.slice(0, Math.min(20, shuffledQuestions.length));

        setTestQuestions(generatedTest);
        setIsTimerRunning(true);
        setSeconds(0);
    }

    const generateRangeTest = () => {
        if(range.start >= 1 && range.end < questions.length+1 && range.start < range.end){
            let rangeTest = questions.slice(range.start-1, range.end);
            setTestQuestions(rangeTest);
        }else{
            console.error("Invalid range");
        }

        setIsTimerRunning(true);
        setSeconds(0);
    }

    const handleRangeChange = (event, position) => {
        const { value } = event.target;
        setRange(prev => ({...prev, [position]: Number(value)}));
    }

    return (
        <div className="flex flex-col items-center  min-h-screen pb-10">
            <div className="flex space-x-4 mb-4">
                <button onClick={generateRandomTest} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Náhodný test</button>
                <button onClick={generateRangeTest} className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">Generuj test</button>
            </div>
            <span className='pb-3 font-bold text-gray-600'>Čas: {seconds} s</span>
            <div className="flex space-x-4 mb-8">
                <input type="number" onChange={(e) => handleRangeChange(e, "start")} placeholder="Začiatok" className="px-2 py-1 border rounded"/>
                <input type="number" onChange={(e) => handleRangeChange(e, "end")} placeholder="Koniec" className="px-2 py-1 border rounded"/>
            </div>
            {testQuestions.map((question, index) => (
                <Question key={index} question={question} />
            ))}
            {isTimerRunning && <button onClick={submitQuiz} className="mt-5 px-8 py-4 font-bold text-white bg-green-500 rounded hover:bg-green-700">Potvrdiť</button>}
            {showResults &&
                <div>
                    <p>Correct answers: {correctCount}</p>
                    <p>Incorrect answers: {testQuestions.length - correctCount}</p>
                    <p>Success rate: {correctCount / testQuestions.length * 100}%</p>
                    <p>Time taken: {seconds} seconds</p>
                    <button onClick={() => setShowResults(false)}>Close</button>
                </div>
            }
        </div>
    );
};

export default Quiz;
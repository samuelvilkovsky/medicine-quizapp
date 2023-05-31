import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './components/Question';
// import { c } from 'tar';
// import { set } from 'mongoose';
// import { set } from 'mongoose';


const Quiz = () => {
    const[questions, setQuestions] = useState([]);
    const[testQuestions, setTestQuestions] = useState([]);
    const[range, setRange] = useState({start: 0, end: 0});
    const[seconds, setSeconds] = useState(1);
    const[minutes, setMinutes] = useState(0);
    const[isTimerRunning, setIsTimerRunning] = useState(false);
    const[showResults, setShowResults] = useState(false);
    const[correctCount, setCorrectCount] = useState(0);
    const[wrongCount, setWrongCount] = useState(0);
    const[questionIndex, setQuestionIndex] = useState(0);

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
                if (seconds % 60 === 0){
                    setMinutes(minutes => minutes + 1);
                    setSeconds(1);
                }
            }, 1000);
        } else if (!isTimerRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, seconds]);

    const submitQuiz = () => {
        setQuestionIndex(0);
        setIsTimerRunning(false);
        setShowResults(true);
    
        let correct = 0;
        let wrong = 0;
        testQuestions.forEach(question => {
            question.answers.forEach(answer => {
                if(answer.clicked && answer.isCorrect){
                    correct++;
                } else if(answer.clicked && !answer.isCorrect){
                    wrong++;
                }
            });
        });
        setCorrectCount(correct);
        setWrongCount(wrong);
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
        // reset question index
        setQuestionIndex(0);
        // Shuffle the original questions array
        let shuffledQuestions = shuffle(questions);
        // Take the first 20 questions or all if there are less
        let generatedTest = shuffledQuestions.slice(0, Math.min(20, shuffledQuestions.length));

        setTestQuestions(generatedTest);
        setIsTimerRunning(true);
        setSeconds(1);
    }

    const generateRangeTest = () => {
        // reset question index
        setQuestionIndex(0);
        if(range.start >= 1 && range.end < questions.length+1 && range.start < range.end){
            let rangeTest = questions.slice(range.start-1, range.end);
            setTestQuestions(rangeTest);
        }else{
            console.error("Invalid range");
        }

        setIsTimerRunning(true);
        setSeconds(1);
    }

    const handleRangeChange = (event, position) => {
        const { value } = event.target;
        setRange(prev => ({...prev, [position]: Number(value)}));
    }

    useEffect(() => {}, [questionIndex]);
    console.log(questionIndex, testQuestions.length);

    return (
        <div className="flex flex-col items-center  min-h-screen">
            <div className="flex space-x-4 mb-4">
                <button onClick={generateRandomTest} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Náhodný test</button>
                <button onClick={generateRangeTest} className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">Generuj test</button>
            </div>
            <span className='pb-3 font-bold text-gray-600'>Čas: {minutes} m {seconds - 1} s</span>
            <div className="flex space-x-4 mb-8">
                <input type="number" onChange={(e) => handleRangeChange(e, "start")} placeholder="Začiatok" className="px-2 py-1 border rounded"/>
                <input type="number" onChange={(e) => handleRangeChange(e, "end")} placeholder="Koniec" className="px-2 py-1 border rounded"/>
            </div>
            {!!testQuestions.length && (
                <Question question={testQuestions[questionIndex]} />
            )}
            <div className='flex justify-between space-x-4 mx-auto'>
                {questionIndex >= 1 && <button onClick={() => setQuestionIndex(questionIndex-1)} className='mt-5 px-8 py-4 font-bold text-white bg-orange-500 rounded hover:bg-orange-700'>Späť</button>} 
                {questionIndex < testQuestions.length - 1 && <button onClick={() => setQuestionIndex(questionIndex+1)} className='mt-5 px-8 py-4 font-bold text-white bg-green-500 rounded hover:bg-green-700'>Ďalej</button>} 
            </div>
            {questionIndex === testQuestions.length - 1 && <button onClick={submitQuiz} className="mt-5 px-8 py-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Potvrdiť</button>}
            {showResults &&
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-1/2">
                        <div className="flex flex-col items-center p-5">
                            <div className="text-gray-900 font-bold text-2xl mb-4">Výsledky</div>
                            <hr/>
                            <p className="my-2 text-green-600 text-lg font-semibold">Správne odpovede: {correctCount}</p>
                            <p className="my-2 text-red-600 text-lg font-semibold">Nesprávne odpovede: {wrongCount}</p>
                            <p className="my-2 text-blue-600 text-lg font-semibold">Počet bodov: {(correctCount * 4) - (wrongCount)}</p>
                            <p className="my-2 mb-2 text-gray-600 text-lg font-medium">Trvanie: {minutes} minút a {seconds - 1} sekúnd</p>
                            <button onClick={() => setShowResults(false)} className='mt-2 px-8 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700'>Zavrieť</button>
                        </div>
                    </div>
                </div>


            }
        </div>
    );
};

export default Quiz;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './components/Question';
import Notification from './components/Notification';
import './Quiz.css';
import { useAuth } from './AuthContext'; // Import the AuthContext hook
import { useNavigate } from 'react-router-dom';
require('dotenv').config();

const API_URL = process.env.REACT_APP_URI_ENDPOINT;

const Quiz = () => {
    const [originalQuestions, setOriginalQuestions] = useState([]);
    const [testQuestions, setTestQuestions] = useState([]);
    const [range, setRange] = useState({ start: 0, end: 0 });
    const [seconds, setSeconds] = useState(1);
    const [minutes, setMinutes] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [notification, setNotification] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const { user, authReady } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authReady && !user) {
            navigate('/login');
        }
    }, [user, authReady, navigate]);
    
    
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/questions?subject=${selectedSubject}`
            );
            setOriginalQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [selectedSubject]);
    

    useEffect(() => {
        let interval = null;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setSeconds((seconds) => seconds + 1);
                if (seconds % 60 === 0) {
                    setMinutes((minutes) => minutes + 1);
                    setSeconds(1);
                }
            }, 1000);
        } else if (!isTimerRunning && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, seconds]);

    const closeNotification = () => {
        setNotification(null);
    };

    const resetTimer = () => {
        setSeconds(1);
        setMinutes(0);
    };

    const submitQuiz = () => {
        setQuestionIndex(0);
        setIsTimerRunning(false);
        setShowResults(true);
    
        let correct = 0;
        let wrong = 0;
        testQuestions.forEach((question) => {
            question.answers.forEach((answer) => {
                if (answer.clicked && answer.isCorrect) {
                    correct++;
                } else if (answer.clicked && !answer.isCorrect) {
                    wrong++;
                }
            });
        });
        setCorrectCount(correct);
        setWrongCount(wrong);
    
        // Send the results to the backend
        axios.post(`${API_URL}/api/testResult`, {
            userId: user._id,
            subject: selectedSubject,
            correctCount: correct,
            wrongCount: wrong,
            duration: `${minutes} minút a ${seconds - 1} sekúnd`
        }).catch(error => {
            console.error("Error saving test results: ", error);
        });
    };

    const shuffle = (array) => {
        let currentIndex = array.length,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    };

    const generateRandomTest = async () => {
        setQuestionIndex(0);
        let shuffledQuestions = shuffle([...originalQuestions]);
        let generatedTest = shuffledQuestions.slice(
            0,
            Math.min(20, shuffledQuestions.length)
        );

        setTestQuestions(generatedTest);
        setIsTimerRunning(true);
        resetTimer();
    };

    const generateRangeTest = async () => {
        setQuestionIndex(0);
        if (
            range.start >= 1 &&
            range.end < originalQuestions.length + 1 &&
            range.start < range.end
        ) {
            let rangeTest = originalQuestions.slice(
                range.start - 1,
                range.end
            );
            setTestQuestions(rangeTest);
            setIsTimerRunning(true);
            resetTimer();
        } else {
            console.error('Invalid range of questions');
            setNotification({
                message: 'Neplatný interval zvolených testov',
                color: 'red',
            });
        }
    };

    const handleRangeChange = (event, position) => {
        const { value } = event.target;
        setRange((prev) => ({ ...prev, [position]: Number(value) }));
    };

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    return (
        <div className="flex flex-col items-center min-h-fit quiz-wrapper">
            {notification && (
                <Notification
                    message={notification.message}
                    color={notification.color}
                    closeNotification={closeNotification}
                />
            )}
            <div className="flex space-x-4 my-4">
                <select
                    value={selectedSubject}
                    onChange={handleSubjectChange}
                    className="px-4 py-2 font-bold text-purple-700 bg-purple-200 border border-purple-500 rounded hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                    <option value="">Zvoľ predmet</option>
                    <option value="biology">Biológia</option>
                    <option value="chemistry">Chémia</option>
                </select>
                <button
                    onClick={generateRandomTest}
                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                    disabled={!selectedSubject}
                >
                    Náhodný test
                </button>
                <button
                    onClick={generateRangeTest}
                    className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                    disabled={!selectedSubject}
                >
                    Generuj test
                </button>
                <div className="flex space-x-4">
                    <input
                        style={{ width: '100px', textAlign: 'center' }}
                        type="number"
                        onChange={(e) => handleRangeChange(e, 'start')}
                        placeholder="Začiatok"
                        className="px-2 py-1 border rounded"
                        disabled={!selectedSubject}
                    />
                    <input
                        style={{ width: '100px', textAlign: 'center' }}
                        type="number"
                        onChange={(e) => handleRangeChange(e, 'end')}
                        placeholder="Koniec"
                        className="px-2 py-1 border rounded"
                        disabled={!selectedSubject}
                    />
                </div>
                <span className="mt-2 font-bold text-gray-600">
                    Čas: {minutes} m {seconds - 1} s
                </span>
            </div>
            {!!testQuestions.length && (
                <Question question={testQuestions[questionIndex]} />
            )}
            <div className="flex justify-between space-x-4 mx-auto my-5">
                {questionIndex >= 1 && (
                    <button
                        onClick={() => setQuestionIndex(questionIndex - 1)}
                        className="px-8 py-4 font-bold text-white bg-orange-500 rounded hover:bg-orange-700"
                    >
                        Späť
                    </button>
                )}
                {questionIndex < testQuestions.length - 1 && (
                    <button
                        onClick={() => setQuestionIndex(questionIndex + 1)}
                        className="px-8 py-4 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                    >
                        Ďalej
                    </button>
                )}
                {questionIndex === testQuestions.length - 1 && (
                    <button
                        onClick={submitQuiz}
                        className="px-8 py-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                        Potvrdiť
                    </button>
                )}
            </div>
            {showResults && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-1/2">
                        <div className="flex flex-col items-center p-5">
                            <div className="text-gray-900 font-bold text-2xl mb-4">
                                Výsledky
                            </div>
                            <hr />
                            <p className="my-2 text-green-600 text-lg font-semibold">
                                Správne odpovede: {correctCount}
                            </p>
                            <p className="my-2 text-red-600 text-lg font-semibold">
                                Nesprávne odpovede: {wrongCount}
                            </p>
                            <p className="my-2 text-blue-600 text-lg font-semibold">
                                Počet bodov:{' '}
                                {(correctCount * 4) - wrongCount}
                            </p>
                            <p className="my-2 mb-2 text-gray-600 text-lg font-medium">
                                Trvanie: {minutes} minút a {seconds - 1} sekúnd
                            </p>
                            <button
                                onClick={() => {
                                    setShowResults(false);
                                    setTestQuestions([]);
                                }}
                                className="mt-2 px-8 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700"
                            >
                                Zavrieť
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;

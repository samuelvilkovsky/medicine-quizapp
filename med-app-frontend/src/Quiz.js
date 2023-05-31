import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Question from './components/Question';

const Quiz = () => {
    const[questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await axios.get('http://localhost:3000/questions');
            setQuestions(response.data);
        };
        fetchQuestions();
    }, []);

    return (
        <div className="container mx-auto">
            {questions.map((question, index) => (
                <Question key={index} question={question} />
            ))}
        </div>
    );
};

export default Quiz;
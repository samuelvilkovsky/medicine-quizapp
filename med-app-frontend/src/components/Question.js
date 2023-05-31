import React, { useState } from 'react';
import Answer from './Answer';

const Question = ({question}) => {
    const [score, setScore] = useState(0);
    const correctAnswers = question.answers.filter(answer => answer.isCorrect).length;

    const updateScore = () => {
        setScore(score + 1);
    };

    return (
        <div className='flex flex-col items-center p-4 m-2 border-2 border-gray-500 rounded-xl shadow-md bg-'>
            <div className="flex justify-between w-full">
                <h2 className='text-3xl mb-4 text-question-800 font-bold'>{question.text}</h2>
                <span className='text-3xl justify-self-end text-green-500'>PSO: {correctAnswers - score}</span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {question.answers.map((answer, index) => (
                    <Answer key={index} text={answer.text} isCorrect={answer.isCorrect} updateScore={updateScore}/>
                ))}
            </div>
        </div>
    );
};

export default Question;

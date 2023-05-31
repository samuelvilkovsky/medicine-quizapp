import React from 'react';
import Answer from './Answer';

const Question = ({question}) => {
    return (
        <div className='flex flex-col justify-center items-center p-4 m-2 border-2 border-gray-500 rounded-xl shadow-md bg-'>
            <h2 className='text-3xl mb-4 text-question-800 font-bold'>{question.text}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {question.answers.map((answer, index) => (
                    <Answer key={index} text={answer.text} isCorrect={answer.isCorrect} />
                ))}
            </div>
        </div>
    );
};

export default Question;

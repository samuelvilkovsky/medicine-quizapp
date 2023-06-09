import React, { useState, useEffect } from 'react';
import Answer from './Answer';

const Question = ({question}) => {
    const [clickedCorrect, setClickedCorrect] = useState(0);
    const [clickedWrong, setClickedWrong] = useState(0);

    const correctAnswers = question.answers.filter(answer => answer.isCorrect).length;

    const updateAnswerState = (isCorrect, index) => {
        if (isCorrect){
            setClickedCorrect(clickedCorrect + 1);
        } else {
            setClickedWrong(clickedWrong + 1);
        }
        // tu aktualizujeme stav odpovede na 'clicked'
        question.answers[index].clicked = true;
    };

    useEffect(() => {
        setClickedCorrect(0);
        setClickedWrong(0);
        // resetujeme stav 'clicked' všetkých odpovedí pri zmene otázky
        question.answers.forEach(answer => answer.clicked = false);
    }, [question]);


    return (
        <div className='flex flex-col items-center p-4 m-2 border-2 border-gray-500 rounded-xl shadow-md bg-'>
            <div className="flex justify-between w-full">
                <h2 className='text-3xl mb-4 text-question-800 font-bold'>{question.id}. {question.text}</h2>
                <span className='text-3xl justify-self-end text-green-500'>PSO: {correctAnswers - clickedCorrect}</span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {question.answers.map((answer, index) => (
                    <Answer key={index} text={answer.text} answer={answer} updateAnswerState={(isCorrect) => updateAnswerState(isCorrect, index)}/>
                ))}
            </div>
        </div>
    );
};

export default Question;

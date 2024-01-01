import React, { useState, useEffect } from 'react';
import Answer from './Answer';

const Question = ({ question }) => {
    const [clickedCorrect, setClickedCorrect] = useState(0);
    const [clickedWrong, setClickedWrong] = useState(0);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);

    const correctAnswers = question.answers.filter(answer => answer.isCorrect).length;

    const updateAnswerState = (isCorrect, index) => {
        if (isCorrect) {
            setClickedCorrect(clickedCorrect + 1);
        } else {
            setClickedWrong(clickedWrong + 1);
        }
        // Mark the answer as clicked
        let updatedAnswers = [...shuffledAnswers];
        updatedAnswers[index].clicked = true;
        setShuffledAnswers(updatedAnswers);
    };

    // Shuffle function using Fisher-Yates algorithm
    const shuffleArray = array => {
        let newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    useEffect(() => {
        setClickedCorrect(0);
        setClickedWrong(0);
        // Reset the clicked state of all answers when the question changes
        const resetAnswers = question.answers.map(answer => ({ ...answer, clicked: false }));
        
        // Shuffle the answers and set them
        setShuffledAnswers(shuffleArray(resetAnswers));
    }, [question]);

    return (
        <div className='flex flex-col items-center w-full max-w-screen-xl p-4 m-2 border-2 border-gray-500 rounded-xl shadow-md bg-white' style={{ maxWidth: '1400px', minWidth: '1400px' }}>
            <div className="flex justify-between w-full">
                <h2 className='w-2/3 text-3xl mb-4 text-question-800 font-bold'>{question.id}. {question.text}</h2>
                <span className='text-3xl justify-self-end text-green-500'>PSO: {correctAnswers - clickedCorrect}</span>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                {shuffledAnswers.map((answer, index) => (
                    <div key={index} className='w-full'>
                        <Answer text={answer.text} answer={answer} updateAnswerState={(isCorrect) => updateAnswerState(isCorrect, index)}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Question;

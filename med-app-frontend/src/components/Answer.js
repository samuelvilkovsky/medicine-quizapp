import React from "react";

const Answer = ({text, answer, updateAnswerState}) => {   // pridajte 'answer' a 'updateAnswerState' do props
    const handleClick = () => {
        if(!answer.clicked){  // použite 'answer.clicked' miesto 'clicked'
            if (answer.isCorrect){
                updateAnswerState(true);
            } else {
                updateAnswerState(false);
            }
        }
    };

    return (
        <button 
            onClick={handleClick} 
            className={`w-full text-center p-4 my-2 rounded-lg shadow-md font-medium text-lg ${answer.clicked ? (answer.isCorrect ? 'bg-green-500 text-white text-2xl' : 'bg-red-500 text-white') : 'bg-gray-200 text-gray-700 '}`}
            
        >
            {text}  
        </button>
    );
};

export default Answer;
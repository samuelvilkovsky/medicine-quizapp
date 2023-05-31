import React, { useState } from 'react';

const Answer = ({text, isCorrect}) => {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
    };

    return (
        <button 
            onClick={handleClick} 
            className={`w-full text-center p-4 my-2 rounded-lg shadow-md font-medium text-lg ${clicked ? (isCorrect ? 'bg-green-500 text-white text-2xl' : 'bg-red-500 text-white') : 'bg-gray-200 text-gray-700 '}`}
        >
            {text}  
        </button>
    );
};

export default Answer;

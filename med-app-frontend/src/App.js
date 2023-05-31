import React from 'react';
import Quiz from './Quiz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
// import Question from './components/Question';

const App = () => {
  return (
    <div className='flex flex-col items-center App w-full'>
      <div className='w-full bg-white'>
        <div className='flex flex-row my-5 items-center'>
          <FontAwesomeIcon icon={faUserDoctor} size="2xl" style={{color: "#d95000",}} className='m-2'/>
          <h1 className='text-2xl font-bold text-orange-600 m-2 '>Medicine Quizapp</h1>
        </div>
      </div>   
      <Quiz />
    </div>
  );
};

export default App;
import React from 'react';
import Quiz from './Quiz';
// import Question from './components/Question';

const App = () => {
  return (
    <div className='flex flex-col items-center App'>
      <h1 className='text-3xl font-light my-5 text-orange-600'>Maňa's road to medicine!</h1>
      <Quiz />
    </div>
  );
};

export default App;
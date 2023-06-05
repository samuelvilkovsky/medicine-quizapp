import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Quiz from './Quiz';
import LoginComponent from '../src/components/LoginComponent';
import RegisterComponent from '../src/components/RegisterComponent';

const App = () => {
  return (
    <Router>
      <div className='flex flex-col items-center App w-full'>
        <div className='w-full bg-white'>
          <div className='flex flex-row my-5 items-center'>
            {/*<FontAwesomeIcon icon={faUserDoctor} size="2xl" style={{color: "#d95000",}} className='m-2'/> */}
            <h1 className='text-2xl font-bold text-orange-600 m-2 '>Medicine Quizapp</h1>
          </div>
        </div> 

        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

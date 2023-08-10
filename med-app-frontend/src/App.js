// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Quiz from './Quiz';
import LoginComponent from '../src/components/LoginComponent';
import RegisterComponent from '../src/components/RegisterComponent';
import Profile from '../src/components/Profile'; // assuming the file is in the same directory as App.js
import Header from './Header';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Header /> 
        <Routes>
          <Route path="/profile" element={<Profile />} />
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

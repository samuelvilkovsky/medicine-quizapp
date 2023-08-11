import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
require('dotenv').config();

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_URI_ENDPOINT;
console.log('aaa', API_URL);

export const useAuth = () => React.useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, { email, password });
      if (response.data.error) {
        throw new Error(response.data.error);
      }
  
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
  
      // Get user details
      axios.get(`${API_URL}/user/me`, {
          headers: {
              Authorization: `Bearer ${response.data.token}`
          }
      }).then(response => {
          setUser(response.data);
      }).catch(error => {
          console.log('Failed to get user details:', error);
      });
      
    } catch (error) {
      console.log('Login failed:', error);
      throw error; // This will ensure that an error is thrown when the login fails.
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setAuthReady(false);
  };

  useEffect(() => {
    // Check if the user has a valid token when the component mounts
    const token = localStorage.getItem('token');
  
    if (token) {
      axios
        .get(`${API_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          setUser(response.data); // Set the user based on the response
          setIsLoggedIn(true); // Set the isLoggedIn state to true
          setAuthReady(true);
        })
        .catch((error) => {
          console.log('Failed to get user details:', error);
          logout(); // Clear the user and token on failed token verification
          setAuthReady(true);
        });
    } else {
      setAuthReady(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

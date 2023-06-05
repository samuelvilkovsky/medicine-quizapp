import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const LoginComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', color: '' });

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:3000/user/login', {
        email,
        password,
      });

      if (res.data) {
        localStorage.setItem('token', res.data.token);
        setNotification({ message: 'Prihlásenie prebehlo úspešne!', color: 'green' });
        setTimeout(() => navigate('/quiz'), 5000);
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Prihlásenie zlyhalo!', color: 'red' });
    }
  };

  return (
    <div>
      {notification.message && <Notification 
        message={notification.message} 
        color={notification.color} 
        closeNotification={() => setNotification({ message: '', color: '' })} // funkcia pre zatvorenie notifikácie
      />}
      <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default LoginComponent;

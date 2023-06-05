import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', color: '' });


  const register = async () => {
    try {
      const res = await axios.post('http://localhost:3000/user/register', {
        username,
        email,
        password,
      });

      if (res.data) {
        setNotification({ message: 'Registrácia prebehla úspešne!', color: 'green' });
        setTimeout(() => navigate('/login'), 5000);
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: 'Registrácia zlyhala!', color: 'red' });
    }
  };

  return (
    <div>
        {notification.message && <Notification 
            message={notification.message} 
            color={notification.color} 
            closeNotification={() => setNotification({ message: '', color: '' })} // funkcia pre zatvorenie notifikácie
        />}
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
};

export default RegisterComponent;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../components/styles/Register.css';

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // <-- add confirmPassword
  const [notification, setNotification] = useState({ message: '', color: '' });
  const [passwordError, setPasswordError] = useState(false); // <-- add passwordError 
  const [showPassword, setShowPassword] = useState(false); // <-- add showPassword
  const [emailError, setEmailError] = useState(false); // <-- add emailError


  const register = async () => {
    // Regular expression to validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Regular expression to validate password
    // At least one uppercase letter, one number
    // Minimum 6 characters
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  
    // Validate email and password before sending the request
    if (!emailRegex.test(email)) {
      setNotification({ message: 'Prosím, zadajte platnú emailovú adresu!', color: 'red' });
      setEmailError(true);
      setTimeout(() => setEmailError(false), 5000);
      return;
    }
  
    if (!passwordRegex.test(password)) {
      setNotification({ message: 'Heslo musí mať min. 6 znakov a obsahovať aspoň 1 veľké písmeno a 1 číslo!', color: 'red' });
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 5000);
      return;
    }

    if (password !== confirmPassword) { // <-- check if passwords match
      setNotification({ message: 'Heslá sa nezhodujú!', color: 'red' });
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 5000);
      return;
    }
  
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
  

  const redirect = () => {
    setTimeout (() => navigate('/login'), 500);
  };

  return (
    <div className='register-form'>
        {notification.message && <Notification 
            message={notification.message} 
            color={notification.color} 
            closeNotification={() => setNotification({ message: '', color: '' })} // funkcia pre zatvorenie notifikácie
        />}
      <input className='input-field' type="text" placeholder="Meno a Priezvisko" value={username} onChange={e => setUsername(e.target.value)} />
      <input className={`input-field ${emailError ? 'error-border' : ''}`} type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <div className="password-wrapper">
        <input className={`input-field ${passwordError ? 'error-border' : ''}`} type={showPassword ? "text" : "password"} placeholder="Heslo" value={password} onChange={e => setPassword(e.target.value)} />
        <button className='show-password-btn' onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)}>Zobraziť</button>
      </div>      
      <div className="password-wrapper">
        <input className={`input-field ${passwordError ? 'error-border' : ''}`} type={showPassword ? "text" : "password"} placeholder='Potvrď heslo' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button className='show-password-btn' onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)}>Zobraziť</button>
      </div>      
      <button className='register-btn' onClick={register}>Registrovať</button>
      <button className='redirect-link' onClick={redirect}>Už si zaregistrovaný/á?</button>
    </div>
  );
};

export default RegisterComponent;

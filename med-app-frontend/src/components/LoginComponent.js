import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import { useAuth } from '../AuthContext';  // <-- use the useAuth hook
import '../components/styles/Login.css'

const LoginComponent = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- use the login function from AuthProvider
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', color: '' });
  const [loginError, setLoginError] = useState(false); // <-- add loginError
  const [showPassword, setShowPassword] = useState(false); // <-- add showPassword

  const handleSubmit = async () => {

    try {
      await login(email, password); // <-- call the login function from AuthProvider
      setNotification({ message: 'Prihlásenie prebehlo úspešne!', color: 'green' });
      setTimeout(() => navigate('/quiz'), 500);
    } catch (err) {
      console.error(err);
      setLoginError(true);
      setNotification({ message: 'Nesprávne prihlasovacie údaje alebo neexistujúci účet!', color: 'red' });
      setTimeout(() => setLoginError(false), 5000);
    }
  };

  const redirect = () => {
    setTimeout (() => navigate('/register'), 500);
  };

  return (
    <div className='login-form'>
      {notification.message && <Notification 
        message={notification.message} 
        color={notification.color} 
        closeNotification={() => setNotification({ message: '', color: '' })} // funkcia pre zatvorenie notifikácie
      />}
      <input className={`input-field ${loginError ? 'error-border' : ''}`} type="text" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <div className='password-wrapper'>
        <input className={`input-field ${loginError ? 'error-border' : ''}`} type={showPassword ? "text" : "password"} placeholder="Heslo" value={password} onChange={e => setPassword(e.target.value)} />
        <button className='show-password-btn' onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)}>Zobraziť</button>
      </div>
      <button className="login-btn" onClick={handleSubmit}>Prihlásiť</button>
      <button className='redirect-link' onClick={redirect}>Ešte nemám registráciu.</button>
    </div>
  );
};

export default LoginComponent;

// Header.js
import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Navigate to /login after logout
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className='header'>
      <a href='/quiz' className='logo'>Medicine Quizapp</a>
      {user && (
        <div className="user-info">
          <span className="greeting">Ahoj, <a href='/profile'><span className='username'>{(user.username).split(' ')[0]}</span></a></span>
          <button className="profile-btn" onClick={handleProfile}>Profil</button>
          <button className="logout-btn" onClick={handleLogout}>Odhlásiť</button>
        </div>
      )}
    </div> 
  )
}

export default Header;

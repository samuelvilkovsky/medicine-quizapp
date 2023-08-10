// components/Notification.js
import React, { useEffect } from 'react';
import '../components/styles/Notification.css';

const Notification = ({ message, color, closeNotification }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
          closeNotification();
        }, 5000); // Change timeout to 5 seconds
        return () => clearTimeout(timer);
    }, [closeNotification]);

    return (
        <div 
            style={{backgroundColor: color}} 
            className="notification" 
            onClick={closeNotification} // Add onClick event to close notification
        >
            <p className="notification-message">{message}</p>
        </div>
    )
}

export default Notification;

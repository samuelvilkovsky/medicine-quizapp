import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../components/styles/Profile.css';  // Import your CSS file
require('dotenv').config();

const API_URL = process.env.URI_ENDPOINT;

const Profile = () => {
    const { authReady, user } = useAuth();
    const [testResults, setTestResults] = useState([]);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [notification, setNotification] = useState({ message: '', color: '' });
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (authReady && !user) {
            navigate('/login');
        }
    }, [user, authReady, navigate]);

    useEffect(() => {
        if (user) {
            axios.get(`${API_URL}/testResult?userId=${user._id}`)
                .then(response => {
                    console.log("Test results: ", response.data);
                    setTestResults(response.data.slice(-5));
                })
                .catch(error => {
                    console.error("Error fetching test results: ", error);
                });
        }
    }, [user]);

    function mapSubjectName(subject) {
        switch(subject) {
            case "biology": return "Biológia";
            case "chemistry": return "Chémia";
            default: return subject;
        }
    }

    const deleteTestResult = async (id) => {
        try {
            // Delete the test result from the database.
            await axios.delete(`${API_URL}/testResult/${id}`);
            setNotification({ message: 'Záznam bol vymazaný!', color: 'green' });
            // Fetch the latest 5 test results from the database.
            axios.get(`${API_URL}/testResult?userId=${user._id}`)
                .then(response => {
                    // Get the 5 latest test results.
                    const latestResults = response.data.slice(-5);
                    setTestResults(latestResults);
                })
                .catch(error => {
                    console.error("Error fetching test results: ", error);
                });
    
        } catch (err) {
            setNotification({ message: 'Vymazanie záznamu zlyhalo!', color: 'red' });
        }
    };
    
    

    const changePassword = async () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (newPassword !== confirmNewPassword) {
            setNotification({ message: 'Heslá sa nezhodujú!', color: 'red' });
            setPasswordError(true);
            setTimeout(() => setPasswordError(false), 5000);
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setNotification({ message: 'Heslo musí mať min. 6 znakov a obsahovať aspoň 1 veľké písmeno a 1 číslo!', color: 'red' });
            setPasswordError(true);
            setTimeout(() => setPasswordError(false), 5000);
            return;
          }
          
        const token = localStorage.getItem('token');
        console.log('Profile personal token: ', token);
        console.log(currentPassword, newPassword, confirmNewPassword)

        try {
            const res = await axios.post(`${API_URL}/user/change-password`, {
              userId: user._id, // assuming this is how you identify the user
              currentPassword,
              newPassword,
              
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
              });
            if (res.data.success) { // assuming the server responds with a success field
              setNotification({ message: 'Heslo bolo zmenené!', color: 'green' });
              setShowChangePasswordModal(false);
            } else if (res.data.error === 'Current password does not match') { // adapt as needed
              setNotification({ message: 'Current password is incorrect!', color: 'red' });
              setPasswordError(true);
              setTimeout(() => setPasswordError(false), 5000);
            }
        } catch (err) {
            console.error(err.response.data);
            setNotification({ message: 'Zmena hesla zlyhala!', color: 'red' });
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmationText.toLowerCase() === 'vymaz'){
            try {
                const token = localStorage.getItem('token');
                const res = await axios.delete(`${API_URL}/user/delete`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.message === 'User deleted successfully') {
                    setNotification({ message: 'Profil bol vymazaný!', color: 'green' });
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            } catch (err) {
                setNotification({ message: 'Vymazanie profilu zlyhalo!', color: 'red' });
                console.error('Error deleting user: ', err)
            }
        } else {
            setNotification({ message: 'Na zrušenie profilu napíš "vymaž"!', color: 'red' });
        }
    };

    return (
        <div className="profile-container">
            <h1>Osobný Profil</h1>
            <h2>Výsledky posledných 5 testov:</h2>
            {testResults.map((result, index) => (
                <div key={index} className="test-result">
                    <h3>Test {index + 1} <strong>({mapSubjectName(result.subject)})</strong></h3>
                    <p>Dátum: <strong>{new Date(result.createdAt).toLocaleString()}</strong></p>
                    <p className="correct-answers">Počet správnych odpovedí: <strong>{result.correctCount}</strong></p>
                    <p className="wrong-answers">Počet nesprávnych odpovedí: <strong>{result.wrongCount}</strong></p>
                    <p>Trvanie: <strong>{result.duration}</strong></p>
                    <button onClick={() => deleteTestResult(result._id)} className='test-result-delete'>Vymazať záznam</button>
                </div>
            ))}
            <button className="logout-btn" onClick={() => setShowChangePasswordModal(true)}>Zmena hesla</button>
            <button className="mt-2 px-5 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700" onClick={() => setShowDeleteModal(true)} style={{display: 'block', margin: '5px auto'}}>Vymazať profil</button>
            {showChangePasswordModal && (
                <div className="change-password-modal">
                  <div className="change-password-container">
                    <button className="close-modal-btn px-4 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700" onClick={() => setShowChangePasswordModal(false)}>X</button>
                        {notification.message && <Notification 
                                message={notification.message} 
                                color={notification.color} 
                                closeNotification={() => setNotification({ message: '', color: '' })} // funkcia pre zatvorenie notifikácie
                            />}
                        <div className='password-wrapper first-wrapper'>
                        <input className={`input-field ${passwordError ? 'error-border' : ''}`} type={showPassword ? "text" : "password"} placeholder="Súčasné heslo" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                        <button className='profile-show-password-btn' onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)}>Zobraziť</button>
                        </div>
                        <div className='password-wrapper'>
                            <input className={`input-field ${passwordError ? 'error-border' : ''}`} type={showPassword ? "text" : "password"} placeholder="Nové heslo" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            <button className='profile-show-password-btn' onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)}>Zobraziť</button>
                        </div>
                        <div className='password-wrapper'>
                            <input className={`input-field ${passwordError ? 'error-border' : ''}`} type={showPassword ? "text" : "password"} placeholder="Potvrď nové heslo" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}/>
                            <button className='profile-show-password-btn' onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)}>Zobraziť</button>
                        </div>
                        <button className='logout-btn' onClick={changePassword} style={{display: 'block', margin: '15px auto'}}>Zmeniť heslo</button>
                    </div>
                  </div>
              )}
              {showDeleteModal && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <h2>Potvrď zrušenie účtu</h2>
                        <p>Napíš "vymaz" na potvrdenie:</p>
                        <input 
                            type="text" 
                            value={deleteConfirmationText} 
                            onChange={(e) => setDeleteConfirmationText(e.target.value)} 
                        />
                        <button onClick={handleDeleteAccount}>Potvrdiť</button>
                        <button onClick={() => setShowDeleteModal(false)}>Zrušiť</button>
                    </div>
                </div>
              )}
            
        </div>
    );
};

export default Profile;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AUTH_URL, USERS_URL } from '../../API/constants.js';
import { AuthContext } from '../../contexts';
import axiosInstance from '../../API/axiosInstance.js';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { setUser, setIsLoggedIn } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post(`${AUTH_URL}/login`, { username, password });
            setSuccessMessage('Login successful! Retrieving user information...');

            try {
                const loggedInUser = (await axiosInstance.get(`${USERS_URL}/me`)).data.data;
                setUser(loggedInUser);
                setIsLoggedIn(true);

                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                setLoginError('Failed to retrieve user information.');
                setSuccessMessage('');
                console.error('Error retrieving user info:', error);
            }
        } catch (error) {
            setLoginError('Login failed. Please check your credentials.');
            setSuccessMessage('');
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <section className="login-section">
                    <h2>LOG IN</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="login-input-group">
                            <label htmlFor="username">Username *</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-input-group">
                            <label htmlFor="password">PASSWORD *</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            LOG IN
                        </button>
                        <a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>
                        {loginError && <p className="p-error-bubble">{loginError}</p>}
                        {successMessage && <p className="p-success-message">{successMessage}</p>}
                    </form>
                </section>
                <section className="new-customer-section">
                    <h2>NEW CUSTOMER</h2>
                    <p>Create an account with us and you'll be able to:</p>
                    <ul className="benefits-list">
                        <li>Check out faster</li>
                        <li>Save multiple shipping addresses</li>
                        <li>Access your order history</li>
                        <li>Track new orders</li>
                    </ul>
                    <button onClick={() => redirectTo('/register')} className="create-account-button">
                        CREATE ACCOUNT
                    </button>
                </section>
            </div>
        </div>
    );
};

const redirectTo = (route) => {
    window.location.href = route;
};

export default Login;

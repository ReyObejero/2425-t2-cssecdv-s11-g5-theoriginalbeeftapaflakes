import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { AUTH_URL } from '../../API/constants.js';
import { AuthContext } from '../../contexts';
import axiosInstance from '../../API/axiosInstance.js';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);  // Track visibility of the password
    const navigate = useNavigate();
    const { setUser, setIsLoggedIn } = useContext(AuthContext);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoginError('');
        setSuccessMessage('');
        try {
            // Call the login endpoint and expect lastLogin info in the response.
            const response = await axiosInstance.post(`${AUTH_URL}/login`, { username, password });
            const { token, user, lastLogin } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setIsLoggedIn(true);

            // Construct a user-friendly message using last login details.
            const lastSuccess = lastLogin.lastSuccessful
                ? new Date(lastLogin.lastSuccessful).toLocaleString()
                : 'N/A';
            const lastFailed = lastLogin.lastFailed
                ? new Date(lastLogin.lastFailed).toLocaleString()
                : 'N/A';
            setSuccessMessage(
                <>
                    Login successful!<br />
                    Last successful login: {lastSuccess}.<br />
                    Last failed login: {lastFailed}.
                </>
            );

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            if (error.response?.status === 403) {
                setLoginError('Your account is locked due to multiple failed login attempts. Please try again later.');
            } else {
                setLoginError('Login failed. Please check your credentials.');
            }
            console.error('Error logging in:', error);
        }
        
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        
        // If password field is empty, set visibility to false (Hide password)
        if (value === '') {
            setPasswordVisible(false);
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
                            <div className="password-input-wrapper">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={handlePasswordChange} // Updated to the new handler
                                    required
                                />
                                {/* Only show the password toggle button when there's input */}
                                {password.length > 0 && (
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? 'Hide' : 'Show'}
                                    </button>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="login-button">
                            LOG IN
                        </button>
                        {/*<a href="/forgot-password" className="forgot-password">
                            Forgot password?
                        </a>*/}
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
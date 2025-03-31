import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../API/axiosInstance';
import './Register.css';
import { AUTH_URL } from '../../API/constants';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorOption, setErrorOption] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Please enter a valid email address');
            setErrorOption('email');
            return;
        }

        try {
            const response = await axiosInstance.post(`${AUTH_URL}/register`, {
                email,
                username,
                password,
            });

            if (response.status === 201) {
                setErrorOption('');
                setErrorMessage('');
                setSuccessMessage(response.data.message);
                // Reset input fields
                setEmail('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                // Redirect to login page after a delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // 2000 milliseconds delay (2 seconds)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="register-container">
            <div className="form-container">
                <h2>CREATE YOUR ACCOUNT</h2>
                <form onSubmit={handleSubmit}>
                    <div className="register-input-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            className="register-input-field"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errorMessage && errorOption === 'email' && (
                            <div className="p-error-bubble">{errorMessage}</div>
                        )}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="username"
                            className="register-input-field"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {errorMessage && errorOption === 'username' && (
                            <div className="p-error-bubble">{errorMessage}</div>
                        )}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            className="register-input-field"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errorMessage && errorOption === 'password' && (
                            <div className="p-error-bubble">{errorMessage}</div>
                        )}
                    </div>
                    <div className="register-input-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            type="password"
                            className="register-input-field"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {errorMessage && errorOption === 'password' && (
                            <div className="p-error-bubble">{errorMessage}</div>
                        )}
                    </div>
                    <div>{successMessage && <div className="p-success-message">{successMessage}</div>}</div>
                    <button type="submit" className="register-button">
                        CREATE ACCOUNT
                    </button>
                    <a href="/login" className="login">
                        Already have an account?
                    </a>
                </form>
            </div>
        </div>
    );
};

export default Register;

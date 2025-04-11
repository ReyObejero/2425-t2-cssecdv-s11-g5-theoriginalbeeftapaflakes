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
    const [registrationError, setRegistrationError] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=[A-Za-z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(?:.*[^A-Za-z0-9]){2,})(?!.*(.)\1\1).{15,}$/;
        return passwordRegex.test(password);
    };

    const validateUsername = (username) => {
        const reserved = ['admin', 'null', 'undefined', 'root', 'system', 'guest'];
        const clean = username.trim();

        const usernameRegex = /^(?!.*[_.]{2})[A-Za-z0-9](?!.*[_.]{2})[A-Za-z0-9._]{1,28}[A-Za-z0-9]$/;
        return (
            usernameRegex.test(clean) &&
            !reserved.includes(clean.toLowerCase()) &&
            !/\s/.test(clean)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setErrorEmail('');
        setErrorUsername('');
        setErrorPassword('');
        setErrorConfirmPassword('');
        setRegistrationError('');
        setSuccessMessage('');

        let valid = true;

        if (!validateEmail(email)) {
            setErrorEmail('Invalid email');
            valid = false;
        }

        if (!validateUsername(username)) {
            setErrorUsername('Invalid username');
            valid = false;
        }

        if (!validatePassword(password)) {
            setErrorPassword('Invalid password');
            valid = false;
        }

        if (password !== confirmPassword) {
            setErrorConfirmPassword('Passwords do not match');
            valid = false;
        }

        if (!valid) return;

        try {
            const response = await axiosInstance.post(`${AUTH_URL}/register`, {
                email,
                username,
                password,
            });

            if (response.status === 201) {
                setSuccessMessage(response.data.message || 'Registration successful');
                setEmail('');
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (error) {
            console.log(error);
            setRegistrationError('Failed registration');
        }
    };

    return (
        <div className="register-container">
            <div className="form-container">
                <h2>CREATE YOUR ACCOUNT</h2>
                <form onSubmit={handleSubmit}>
                    {/* Success message block */}
                    {isSubmitted && successMessage && (
                        <div className="success-message success-big-box">
                            {successMessage}
                        </div>
                    )}

                    {/* Email */}
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
                        {isSubmitted && errorEmail && (
                            <div className="error-message">{errorEmail}</div>
                        )}
                    </div>

                    {/* Username */}
                    <div className="register-input-group">
                        <label htmlFor="username">Username *</label>
                        <input
                            type="text"
                            className="register-input-field"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {isSubmitted && errorUsername && (
                            <div className="error-message">{errorUsername}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="register-input-group">
                        <label htmlFor="password">Password *</label>
                        <div className="password-input-wrapper">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                className="register-input-field"
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (e.target.value === '') {
                                        setPasswordVisible(false); // Hide password toggle when input is empty
                                    }
                                }}
                                required
                            />
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
                        {isSubmitted && errorPassword && (
                            <div className="error-message">{errorPassword}</div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="register-input-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <div className="password-input-wrapper">
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                className="register-input-field"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (e.target.value === '') {
                                        setConfirmPasswordVisible(false); // Hide confirm password toggle when input is empty
                                    }
                                }}
                                required
                            />
                            {confirmPassword.length > 0 && (
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                >
                                    {confirmPasswordVisible ? 'Hide' : 'Show'}
                                </button>
                            )}
                        </div>
                        {isSubmitted && errorConfirmPassword && (
                            <div className="error-message">{errorConfirmPassword}</div>
                        )}
                    </div>

                    {/* Password Rules */}
                    <div className="password-requirements-box">
                        <h4>Password Requirements:</h4>
                        <ul>
                            <li>Minimum length should be at least 15</li>
                            <li>Must start with a letter</li>
                            <li>Must contain at least 1 upper case character(s)</li>
                            <li>Number of numerals to include 1</li>
                            <li>Must contain at least 1 lower case character(s)</li>
                            <li>Number of special characters to include 2</li>
                            <li>Must not contain any character more than 2 times consecutively</li>
                        </ul>
                    </div>

                    {/* Spacer */}
                    <div style={{ marginBottom: '20px' }}></div>

                    {/* Error message below policy box if general registration error */}
                    {isSubmitted && registrationError && (
                        <div className="error-message">{registrationError}</div>
                    )}

                    {/* Submit Button */}
                    <div className="submit-button-wrapper">
                        <button type="submit" className="register-button">
                            CREATE ACCOUNT
                        </button>
                    </div>

                    {/* Centered Login Link */}
                    <div className="login-link-container">
                        <a href="/login" className="login">
                            Already have an account?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;

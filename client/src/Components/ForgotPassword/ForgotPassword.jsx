import React, { useState } from 'react';
import './ForgotPassword.css';
import axiosInstance from '../../API/axiosInstance';
import { AUTH_URL, USERS_URL } from '../../API/constants';
import { useNavigate } from 'react-router-dom'; // Import navigation

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isReauthenticated, setIsReauthenticated] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigation

    const handleReauthenticate = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post(`${AUTH_URL}/login`, {
                username,
                password,
            });

            if (response.status === 201) {
                setIsReauthenticated(true);
            }
        } catch (err) {
            setError('Invalid username or password.');
            console.error('Reauthentication failed:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const response = await axiosInstance.post(`${USERS_URL}/password-reset`, {
                newPassword,
                securityAnswer,
            });

            if (response.status === 200) {
                setSuccessMessage('Password has been reset successfully!');
                setTimeout(() => {
                    navigate('/'); // Redirect after 1 second
                }, 1000);
            }
        } catch (err) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message;

            if (status === 403 && message?.includes('at least 1 day')) {
                setError(
                    'You have set your password too recently. Please wait at least 24 hours before changing it again.',
                );
            } else if (status === 403 && message?.includes('reuse')) {
                setError('You cannot reuse a previous password. Please choose a new one.');
            } else if (status === 401) {
                setError('Failed to reset password. Please try again.');
            } else {
                setError('Failed to reset password. Please try again.');
            }

            console.error('Password reset failed:', err);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-container">
                {!isReauthenticated ? (
                    <div>
                        <p className="instruction-text">
                            Please re-authenticate with your username and password before resetting your password.
                        </p>
                        <form className="reset-form" onSubmit={handleReauthenticate}>
                            <div className="input-group">
                                <label htmlFor="username" className="label">
                                    USERNAME *
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password" className="label">
                                    CURRENT PASSWORD *
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type="submit" className="reset-button">
                                REAUTHENTICATE
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h4>Password Requirements:</h4>
                        <ul>
                            <li>Minimum length should be at least 15</li>
                            <li>Must start with a letter</li>
                            <li>Must contain at least 1 upper case character(s)</li>
                            <li>Number of numerals to include 1</li>
                            <li>Must contain at least 1 lower case character(s)</li>
                            <li>Number of special characters to include 2</li>
                            <li>Must not contain any character more than 2 times consecutively</li>
                            <li>Must not have reset your password too recently.</li>
                            <li>Must not be a password you have already previously set.</li>
                        </ul>
                        <br />
                        <p className="instruction-text">
                            Please answer the security question: "What is your mother's maiden name?" and enter your new
                            password.
                        </p>
                        <form className="reset-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="security-answer" className="label">
                                    SECURITY ANSWER *
                                </label>
                                <input
                                    type="text"
                                    id="security-answer"
                                    className="input"
                                    value={securityAnswer}
                                    onChange={(e) => setSecurityAnswer(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="new-password" className="label">
                                    NEW PASSWORD *
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    className="input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            {successMessage && <p className="success-message">{successMessage}</p>}
                            <button type="submit" className="reset-button">
                                RESET PASSWORD
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

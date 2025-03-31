import React from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
    return (
        <div className="forgot-password-container">
            <div className="forgot-container">
                <p className="instruction-text">
                    Fill in your email below to request a new password. An email will be sent to the address below
                    containing a link to verify your email address.
                </p>
                <form className="email-form">
                	<label htmlFor="email" className="email-label">EMAIL ADDRESS *</label>
                    <input type="email" id="email" className="email-input" required />
                    <button type="submit" className="reset-button">RESET PASSWORD</button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;

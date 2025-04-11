import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="error-page-container">
            <div className="error-content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Oops! Something went wrong.</h2>
                <p className="error-message">
                    We’re sorry, but an unexpected error occurred. Please try again later.
                </p>
                <button className="go-home-button" onClick={handleGoHome}>
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;

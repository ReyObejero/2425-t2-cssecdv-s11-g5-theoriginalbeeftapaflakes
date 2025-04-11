import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts';

export const Protect = ({ element, requiredRole }) => {
    const { isLoggedIn, userRole, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    const isRoleValid = Array.isArray(requiredRole) ? requiredRole.includes(userRole) : userRole === requiredRole;

    if (requiredRole && !isRoleValid) {
        return <Navigate to="/" />;
    }

    return element;
};

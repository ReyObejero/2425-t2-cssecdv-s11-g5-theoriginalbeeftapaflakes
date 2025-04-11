import React, { useEffect, useState } from 'react';
import axiosInstance from '../API/axiosInstance';
import { USERS_URL } from '../API/constants';
import { AuthContext } from '../contexts';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get(`${USERS_URL}/me`);
                setUser(response.data.data);
                setIsLoggedIn(true);
            } catch (error) {
                console.log(error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                setIsLoggedIn,
                isLoading,
                userRole: user?.role || null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

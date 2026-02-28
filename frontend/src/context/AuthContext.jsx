import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session in localStorage
        const savedUser = localStorage.getItem('chaoszen_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem('chaoszen_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (email, role, msmeId = null) => {
        const userData = {
            email,
            role, // 'policymaker' or 'msme'
            msmeId, // Only for MSME users
            loginTime: new Date().toISOString()
        };
        setUser(userData);
        localStorage.setItem('chaoszen_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('chaoszen_user');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isPolicyMaker: user?.role === 'policymaker',
        isMSME: user?.role === 'msme'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

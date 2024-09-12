import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        return token ? { username, token } : null;
    });

    const login = (username, token) => {
        localStorage.setItem('username', username);
        localStorage.setItem('token', token);
        setUser({ username, token });
    };

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

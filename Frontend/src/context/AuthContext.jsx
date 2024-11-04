import React, { createContext, useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/Auth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Error al verificar el token:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await updateProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

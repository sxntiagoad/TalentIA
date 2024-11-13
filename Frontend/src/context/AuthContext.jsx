import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, updateProfile, updateCompanyProfile } from '../api/Auth.api';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

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
    setUser({
      ...userData,
      email: userData.email
    });
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateUser = async (userData) => {
    try {
      let updatedUser;
      // Verificar si el usuario es una compañía o un freelancer
      if (user && 'company_location' in user) {
        // Es una compañía
        updatedUser = await updateCompanyProfile(userData);
      } else {
        // Es un freelancer
        updatedUser = await updateProfile(userData);
      }
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

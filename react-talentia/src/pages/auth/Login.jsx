import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImageFreelancer from '../../assets/init.jpg';
import backgroundImageCompany from '../../assets/company-init.jpg';
import { motion } from 'framer-motion';
import Navbar from '../../components/general/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { login as loginApi } from '../../api/Auth.api';
import { LoginForm } from '../../components/LoginForm';

export function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  // Obtener el tipo de usuario de los parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get('type') || 'freelancer';

  const handleSubmit = async (data) => {
    setError('');
    try {
      console.log('Attempting login with:', data);
      const response = await loginApi(data.email, data.password);
      console.log('Login response:', response);
      if (response.data && response.data.token) {
        console.log('Login successful, token received');
        // Asegúrate de que estás pasando los datos correctos a la función login
        login(response.data[userType], response.data.token);
        
        // Redirige según el tipo de usuario
        if (userType === 'company') {
          navigate('/company-home');
        } else {
          navigate('/home');
        }
      } else {
        console.log('No token received in response');
        setError('No se recibió un token válido. Por favor, intente de nuevo.');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      if (error.response && error.response.status === 401) {
        setError('Credenciales inválidas. Por favor, verifique su correo y contraseña.');
      } else {
        setError('Hubo un problema al iniciar sesión. Por favor, intente de nuevo más tarde.');
      }
    }
  };

  const backgroundImage = userType === 'company' ? backgroundImageCompany : backgroundImageFreelancer;

  return (
    <>
      <Navbar isAuthenticated={false} />
      <div className="min-h-screen flex items-center justify-center" 
           style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <motion.div 
          className="w-full max-w-md p-8 rounded-lg glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoginForm onSubmit={handleSubmit} error={error} userType={userType} />
        </motion.div>
      </div>
    </>
  );
}

export default Login;

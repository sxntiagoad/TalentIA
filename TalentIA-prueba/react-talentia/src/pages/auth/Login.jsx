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
      const response = await loginApi(data.email, data.password);
      if (response.data && response.data.token) {
        login(response.data.user, response.data.token);
        if (userType === 'freelancer') {
          navigate('/home');
        } else if (userType === 'company') {
          // Aquí debes definir la ruta para la página de inicio de la compañía
          navigate('/company-dashboard'); // Ejemplo: redirige a un dashboard de compañía
        }
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError('Credenciales inválidas. Por favor, intente de nuevo.');
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
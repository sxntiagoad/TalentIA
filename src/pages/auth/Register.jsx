import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserForm } from '../../components/UserForm';
import backgroundImageFreelancer from '../../assets/init.jpg';
import backgroundImageCompany from '../../assets/company-init.jpg';
import { motion } from 'framer-motion';
import Navbar from '../../components/general/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../api/Auth.api';

export function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get('type') || 'freelancer';

  const backgroundImage = userType === 'company' ? backgroundImageCompany : backgroundImageFreelancer;

  const handleSubmit = async (data) => {
    try {
      const registrationData = {
        email: data.email,
        password: data.password,
        name: data.name,
      };

      if (userType === 'freelancer') {
        registrationData.lastname = data.lastname || '';
      }

      console.log('Datos de registro:', registrationData);
      const response = await register(registrationData, userType);
      
      if (response.data && response.data.token) {
        console.log('Registro exitoso, token recibido:', response.data.token);
        localStorage.setItem('token', response.data.token);
        login(response.data[userType], response.data.token);
        
        if (userType === 'freelancer') {
          if (!response.data[userType].profile_completed) {
            navigate('/completar-perfil');
          } else {
            navigate('/home');
          }
        } else {
          if (!response.data[userType].profile_completed) {
            navigate('/completar-perfil-compania');
          } else {
            navigate('/company-home');
          }
        }
      } else {
        console.error('No se recibió un token en la respuesta del registro');
        // Manejar el error apropiadamente, tal vez mostrar un mensaje al usuario
      }
    } catch (error) {
      console.error('Registro fallido:', error.response?.data || error.message);
      // Manejar el error apropiadamente, tal vez mostrar un mensaje al usuario
    }
  };

  return (
    <>
      <Navbar isAuthenticated={false} isCompanyMode={userType === 'company'} />
      <div className="min-h-screen flex items-center justify-center" 
           style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <motion.div 
          className="w-full max-w-md p-8 rounded-lg glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UserForm onSubmit={handleSubmit} userType={userType} />
        </motion.div>
      </div>
    </>
  );
}

export default Register;

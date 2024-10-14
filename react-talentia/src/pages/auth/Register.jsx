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
        // Estos campos opcionales se mantienen, pero podrían no ser necesarios en el registro inicial
        phone: data.phone || '',
        information: data.information || '',
        interests: data.interests || '',
      };

      if (userType === 'freelancer') {
        registrationData.lastname = data.lastname || ''; // Aseguramos que el apellido se envíe para freelancers
        // Estos campos opcionales se mantienen, pero podrían no ser necesarios en el registro inicial
        registrationData.role = data.role || '';
        registrationData.location = data.location || '';
        registrationData.language = data.language || 'es';
      } else {
        // Estos campos opcionales se mantienen, pero podrían no ser necesarios en el registro inicial
        registrationData.company_location = data.location || '';
        registrationData.company_language = data.language || 'es';
      }

      console.log('Datos de registro:', registrationData); // Para depuración
      const response = await register(registrationData, userType);
      localStorage.setItem('token', response.data.token);
      login(response.data[userType]);
      if (userType === 'freelancer' && !response.data[userType].profile_completed) {
        navigate('/completar-perfil');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Registro fallido:', error.response?.data || error.message);
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

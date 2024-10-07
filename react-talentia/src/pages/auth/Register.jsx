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
        username: data.username,
        email: data.email,
        password: data.password,
        custom_user: {
          type_user: userType
        }
      };
      console.log('Datos de registro:', registrationData); // Para depuración
      const response = await register(registrationData);
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/home');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
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

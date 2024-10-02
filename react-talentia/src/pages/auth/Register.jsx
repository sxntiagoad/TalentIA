import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserForm } from '../../components/UserForm';
import backgroundImage from '../../assets/init.jpg';
import { motion } from 'framer-motion';
import Navbar from '../../components/general/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { register } from '../../api/Auth.api';

export function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const response = await register(data.username, data.email, data.password);
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/home');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

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
          <UserForm onSubmit={handleSubmit} />
        </motion.div>
      </div>
    </>
  );
}

export default Register;

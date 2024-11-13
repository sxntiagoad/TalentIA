import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/general/Navbar';
import { Link, useLocation } from 'react-router-dom';
import initImage from '../assets/init.jpg';
import companyInitImage from '../assets/company-init.jpg';
import Footer from '../components/general/footer';
import ChatBot from './ChatBot';
import { AuthContext } from '../context/AuthContext';

function InitPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [currentType, setCurrentType] = useState('freelancer');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    setCurrentType(typeParam === 'company' ? 'company' : 'freelancer');
  }, [location]);

  const themeColor = currentType === 'company' ? 'green' : 'purple';
  const backgroundImage = currentType === 'company' ? companyInitImage : initImage;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Navbar isAuthenticated={!!user} hideSearch={true} isCompanyMode={currentType === 'company'} />
        <motion.div 
          className="relative h-screen bg-cover bg-center pt-16" 
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-start p-8 h-full text-white max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {currentType === 'company' 
                ? "Encuentra el talento ideal para tu negocio" 
                : "Encuentra el trabajo ideal para ti"}
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-6 max-w-2xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {currentType === 'company'
                ? "Conecta con profesionales calificados y lleva tu negocio al siguiente nivel."
                : "El mercado freelance más grande del mundo. Encuentra la persona ideal para cualquier trabajo."}
            </motion.p>
            <motion.div 
              className="flex space-x-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {user ? (
                <Link to={currentType === 'company' ? "/company-dashboard" : "/home"}>
                  <button className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}>
                    Ingresar
                  </button>
                </Link>
              ) : (
                <>
                  <Link to={currentType === 'company' ? "/login?type=company" : "/services"}>
                    <button className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}>
                      {currentType === 'company' ? "Publicar Trabajo" : "Buscar Servicios"}
                    </button>
                  </Link>
                  <Link to={currentType === 'company' ? "/login?type=company" : "/jobs"}>
                    <button className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}>
                      {currentType === 'company' ? "Buscar Talento" : "Buscar Trabajos"}
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default InitPage;

import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '../components/general/Navbar';
import { Link, useLocation } from 'react-router-dom';
import companyInitImage from '../assets/company-init.jpg';
import freelancerInitImage from '../assets/init.jpg';
import Footer from '../components/general/footer';
import { AuthContext } from '../context/AuthContext';
import JobPostingProcess from '../components/company/JobPostingProcess';

function CompanyInitPage() {
  const { user } = useContext(AuthContext);
  const [showJobPosting, setShowJobPosting] = useState(false);
  const location = useLocation();
  const [currentType, setCurrentType] = useState('company');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    setCurrentType(typeParam === 'freelancer' ? 'freelancer' : 'company');
  }, [location]);

  const themeColor = currentType === 'company' ? 'green' : 'purple';
  const backgroundImage = currentType === 'company' ? companyInitImage : freelancerInitImage;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Navbar isAuthenticated={!!user} isCompanyMode={currentType === 'company'} hideSearch={true} />
        {showJobPosting ? (
          <div className="pt-16">
            <JobPostingProcess />
          </div>
        ) : (
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
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {currentType === 'company' 
                  ? "Encuentra el talento perfecto para tu empresa" 
                  : "Encuentra oportunidades de trabajo freelance"}
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl mb-6 max-w-2xl"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                {currentType === 'company'
                  ? "Conecta con profesionales calificados y lleva tu negocio al siguiente nivel."
                  : "Explora proyectos y trabajos que se ajusten a tus habilidades y experiencia."}
              </motion.p>
              {currentType === 'freelancer' && (
                <motion.div 
                  className="flex space-x-4"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  {user ? (
                    <Link to="/freelancer-dashboard">
                      <button className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}>
                        Ingresar al Panel
                      </button>
                    </Link>
                  ) : (
                    <>
                      <button 
                        onClick={() => setShowJobPosting(true)} 
                        className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}
                      >
                        Buscar Proyectos
                      </button>
                      <Link to="/browse-jobs">
                        <button className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}>
                          Explorar Trabajos
                        </button>
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
              <Link to="/company-home">
                <button className={`bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105`}>
                  Ingresar al Portal de la Empresa
                </button>
              </Link>
            </div>
          </motion.div>
        )}
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default CompanyInitPage;

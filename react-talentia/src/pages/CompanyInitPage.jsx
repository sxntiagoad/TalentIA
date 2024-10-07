import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/general/Navbar';
import { Link } from 'react-router-dom';
import companyInitImage from '../assets/company-init.jpg'; // Asegúrate de tener esta imagen
import Footer from '../components/general/footer';
import { AuthContext } from '../context/AuthContext';
import JobPostingProcess from '../components/company/JobPostingProcess'; // Importa el componente

function CompanyInitPage() {
  const { user } = useContext(AuthContext);
  const [showJobPosting, setShowJobPosting] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} // Cambiado de 0.5 a 0.3
    >
      <Navbar isAuthenticated={!!user} isCompanyMode={true} hideSearch={true} />
      {showJobPosting ? (
        <div className="pt-16">
          <JobPostingProcess />
        </div>
      ) : (
        <div 
          className="relative h-screen bg-cover bg-center pt-16" 
          style={{ backgroundImage: `url(${companyInitImage})` }}
        >
          <div className="absolute inset-0 bg-black opacity-40"></div>
          
          <div className="relative z-10 flex flex-col justify-center items-start p-8 h-full text-white max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Encuentra el talento perfecto para tu empresa</h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl">
              Conecta con profesionales calificados y lleva tu negocio al siguiente nivel.
            </p>
            <div className="flex space-x-4">
              {user ? (
                <Link to="/company-dashboard">
                  <button className="bg-green-600 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                    Ingresar al Panel
                  </button>
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => setShowJobPosting(true)} 
                    className="bg-green-600 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    Publicar Trabajo
                  </button>
                  <Link to="/browse-talent">
                    <button className="bg-green-600 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                      Buscar Talento
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </motion.div>
  );
}

export default CompanyInitPage;
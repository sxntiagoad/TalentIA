import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/general/Navbar';
import { Link } from 'react-router-dom';
import initImage from '../assets/init.jpg';
import Footer from '../components/general/footer';
import ChatBot from './ChatBot';
import { AuthContext } from '../context/AuthContext';

function InitPage() {
  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Navbar isAuthenticated={!!user} hideSearch={true} />
      <div 
        className="relative h-screen bg-cover bg-center pt-16" 
        style={{ backgroundImage: `url(${initImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-start p-8 h-full text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Encuentra el talento ideal para tu negocio y el trabajo ideal para ti</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            El mercado freelance más grande del mundo. Encuentra la persona ideal para cualquier trabajo.
          </p>
          <div className="flex space-x-4">
            {user ? (
              <Link to="/home">
                <button className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                  Ingresar
                </button>
              </Link>
            ) : (
              <>
                <Link to="/services">
                  <button className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                    Buscar Servicios
                  </button>
                </Link>
                <Link to="/jobs">
                  <button className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                    Buscar Trabajos
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
}

export default InitPage;

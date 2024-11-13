import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const ServicePostedSuccess = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen flex items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl"
      >
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-800 tracking-tight leading-tight text-center mb-6">
            ¡Servicio Publicado!
          </h1>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 text-center"
        >
          <h2 className="text-3xl font-bold text-purple-600 mb-4">¡Felicidades!</h2>
          <p className="text-gray-700 text-lg mb-8 font-light leading-relaxed">
            Tu servicio ha sido publicado correctamente y ya está disponible para que otros lo vean.
          </p>
          <Link 
            to="/home" 
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105 inline-block"
          >
            Volver al inicio
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ServicePostedSuccess;

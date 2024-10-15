import React from "react";
import { Link } from "react-router-dom";
import JobPostingProcess from "../../components/company/JobPostingProcess";
import { motion } from "framer-motion";

const JobForm = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 tracking-tight leading-tight">
            Publica tu Oferta de Trabajo
          </h1>
          <Link 
            to="/company-home" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-sm uppercase tracking-wide"
          >
            Volver a Inicio
          </Link>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl p-6 sm:p-10"
        >
          <p className="text-gray-700 text-lg text-center mb-8 font-light leading-relaxed">
            Crea una oferta de trabajo atractiva y encuentra al candidato ideal para tu empresa
          </p>
          <JobPostingProcess />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobForm;

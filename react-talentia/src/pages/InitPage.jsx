import React from 'react';
import { Navbar } from '../components/general/Navbar';
import { Link } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import initImage from '../assets/init.jpg'; // Asegúrate de que la ruta de la imagen sea correcta
import Footer from '../components/general/footer';

function InitPage() {
  return (
    <>
      <Navbar isAuthenticated={false} />
      <div 
        className="relative h-screen bg-cover bg-center pt-16" 
        style={{ backgroundImage: `url(${initImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div> {/* Fondo oscuro transparente */}
        
        <div className="relative z-10 flex flex-col justify-center items-start p-8 h-full text-white max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Encuentra el talento ideal para tu negocio y el trabajo ideal para ti</h1>
          <p className="text-lg md:text-xl mb-6 max-w-2xl">
            El mercado freelance más grande del mundo. Encuentra la persona ideal para cualquier trabajo.
          </p>
          <div className="flex space-x-4">
            <Link to="/services">
              <button className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                Servicios
              </button>
            </Link>
            <Link to="/jobs">
              <button className="bg-purple-800 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded transition duration-300 ease-in-out transform hover:scale-105">
                Trabajos
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default InitPage;

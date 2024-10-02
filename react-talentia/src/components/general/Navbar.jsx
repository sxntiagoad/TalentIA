import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaSearch, FaExchangeAlt } from "react-icons/fa";
import '../../index.css';
import logo from "../../assets/logo.png";
import { searchItems } from '../../api/Search.api';

export function Navbar({ isAuthenticated = false, isCompanyMode = false }) {
  const [query, setQuery] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (query.trim()) {
      try {
        const response = await searchItems(query);
        navigate('/search', { 
          state: { 
            results: {
              services: response.data.services,
              jobs: response.data.jobs
            },
            originalQuery: query,
            suggestedQuery: response.data.suggested_query 
          } 
        });
      } catch (error) {
        console.error("Error en la búsqueda:", error);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMode = () => {
    const nextPath = isCompanyMode ? '/' : '/company';
    navigate(nextPath, { replace: true });
  };

  const themeColor = isCompanyMode ? 'green' : 'purple';

  return (
    <div className="fixed top-0 left-0 w-full p-4 flex justify-between items-center bg-white bg-opacity-30 backdrop-blur-md z-50">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-3xl text-black">
          <Link to="/">TalentIA</Link>
        </h1>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center justify-between w-full ml-64">
          <div className="relative w-2/3">
            <input
              type="text"
              placeholder="Busca servicios y empleos"
              className={`border ${showError ? 'border-red-500 animate-shake' : 'border-gray-300'} rounded-full px-4 py-2 w-full pr-16 transition-colors duration-300`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className={`absolute right-0 top-0 bottom-0 px-4 bg-${themeColor}-600 text-white rounded-full shadow-md hover:bg-${themeColor}-700 transition-colors duration-300`}
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
            {showError && (
              <p className="absolute text-red-500 text-xs mt-1">Por favor, ingresa una consulta de búsqueda.</p>
            )}
          </div>

          <div className="flex space-x-6 items-center">
            <FaBell className="text-black w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors duration-300" />
            <FaEnvelope className="text-black w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors duration-300" />
            <FaUserCircle className="text-black w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors duration-300" />
          </div>
        </div>
      ) : (
        <nav className="flex space-x-6">
          <ul className="flex space-x-6">
          </ul>
        </nav>
      )}

      {!isAuthenticated && (
        <div className="flex space-x-4 items-center">
          <a
            href={isCompanyMode ? "/post-job" : "/create-service"}
            className={`border-${themeColor}-600 border-2 text-${themeColor}-600 font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-600 hover:text-white`}
          >
            {isCompanyMode ? "Publicar Trabajo" : "Crear Servicio"}
          </a>
          <button className={`border-${themeColor}-600 border-2 text-${themeColor}-600 font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-600 hover:text-white`}>
            Iniciar Sesión
          </button>
          <a
            href="/register"
            className={`border-${themeColor}-600 border-2 text-${themeColor}-600 font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-600 hover:text-white`}
          >
            Regístrate
          </a>
          <button
            onClick={toggleMode}
            className={`bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-700 flex items-center`}
          >
            <FaExchangeAlt className="mr-2" />
            {isCompanyMode ? 'Modo Freelancer' : 'Modo Empresa'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;

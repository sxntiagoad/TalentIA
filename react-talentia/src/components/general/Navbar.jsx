import { Link, Navigate, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import '../../index.css';
import logo from "../../assets/logo.png";
import { searchItems } from '../../api/Search.api';


export function Navbar({ isAuthenticated = false }) {
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

  return (
    <div className="p-4 flex justify-between items-center bg-white">
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-3xl text-black">
          <Link to="/">TalentIA</Link>
        </h1>
      </div>

      {/* Desktop Menu or Search Bar */}
      {isAuthenticated ? (
        <div className="flex items-center justify-between w-full ml-64">
          {/* Centered Search Bar */}
          <div className="relative w-2/3">
            <input
              type="text"
              placeholder="Busca servicios y empleos"
              className={`border ${showError ? 'border-red-500 animate-shake' : 'border-gray-300'} rounded-full px-4 py-2 w-full pr-16`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="absolute right-0 top-0 bottom-0 px-4 bg-purple-500 text-white rounded-full"
              onClick={handleSearch}
            >
              <FaSearch />
            </button>
            {showError && (
              <p className="absolute text-red-500 text-xs mt-1">Por favor, ingresa una consulta de búsqueda.</p>
            )}
          </div>

          {/* Icons aligned to the far right */}
          <div className="flex space-x-6 items-center">
            <FaBell className="text-black w-6 h-6 cursor-pointer" />
            <FaEnvelope className="text-black w-6 h-6 cursor-pointer" />
            <FaUserCircle className="text-black w-6 h-6 cursor-pointer" />
          </div>
        </div>
      ) : (
        <nav className="flex space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="hover:text-purple-500 transition-colors duration-300"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/servicios"
                className="hover:text-purple-500 transition-colors duration-300"
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="hover:text-purple-500 transition-colors duration-300"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Desktop Buttons */}
      {!isAuthenticated && (
        <div className="flex space-x-4">
          <a
            href="/create-service"
            className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
          >
            Crear Servicio
          </a>
          <button className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white">
            Iniciar Sesión
          </button>
          <a
            href="/user-form"
            className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
          >
            Regístrate
          </a>
        </div>
      )}
    </div>
  );
}

export default Navbar;
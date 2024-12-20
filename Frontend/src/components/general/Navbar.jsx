import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBell, FaUserCircle, FaSearch, FaExchangeAlt, FaPlusCircle, FaListAlt, FaBriefcase } from "react-icons/fa";
import '../../index.css';
import logo from "../../assets/logo.png";
import { searchItems } from '../../api/Search.api';
import { AuthContext } from '../../context/AuthContext';
import ChatList from '../Chat/ChatList';

export function Navbar({ isAuthenticated = false, isCompanyMode = false, hideSearch = false, onToggleChat }) {
  const [query, setQuery] = useState("");
  const [showError, setShowError] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const [currentType, setCurrentType] = useState(isCompanyMode ? 'company' : 'freelancer');
  const [showChatList, setShowChatList] = useState(false);
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Verificar si estamos en una página de perfil o en una página de trabajo
  const isProfilePage = location.pathname.includes('/profile') || location.pathname.includes('/freelancer/') || location.pathname.includes('/company/');
  const isJobPage = location.pathname.includes('/jobs/');

  // No mostrar la navbar si es una compañía y está en una página de trabajo
  if (currentType === 'company' && isJobPage) {
    return null;
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type');
    if (typeParam === 'company' || typeParam === 'freelancer') {
      setCurrentType(typeParam);
    } else {
      setCurrentType(isCompanyMode ? 'company' : 'freelancer');
    }
  }, [location, isCompanyMode]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    const nextType = currentType === 'company' ? 'freelancer' : 'company';
    const nextPath = location.pathname + '?type=' + nextType;
    navigate(nextPath, { replace: true });
  };

  const themeColor = currentType === 'company' ? 'green' : 'purple';

  const handleAuth = (action) => {
    const path = `/${action}?type=${currentType}`;
    navigate(path);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (isCompanyMode || user?.type === 'company') {
        navigate('/company', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  return (
    <div className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center bg-white bg-opacity-30 backdrop-blur-md z-50 transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-3xl text-black">
          <Link to={isCompanyMode ? "/company" : "/"}>TalentIA</Link>
        </h1>
      </div>

      {isAuthenticated && !hideSearch && !isProfilePage && (
        <div className="flex items-center justify-center w-1/2 mx-auto">
          <div className="relative w-full">
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
        </div>
      )}

      {isAuthenticated && (
        <div className="flex space-x-6 items-center">
          {currentType === 'freelancer' && (
            <>
              <Link to="/post-service" className={`bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-700 flex items-center`}>
                <FaPlusCircle className="mr-2" />
                Crear Servicio
              </Link>
              <Link to="/my-services" className={`bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-700 flex items-center`}>
                <FaListAlt className="mr-2" />
                Mis Servicios
              </Link>
              <Link to="/my-jobs" className={`bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-700 flex items-center`}>
                <FaBriefcase className="mr-2" />
                Mi Trabajo
              </Link>
            </>
          )}
          {currentType === 'company' && (
            <>
              <Link to="/post-job" className={`bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-700 flex items-center`}>
                <FaPlusCircle className="mr-2" />
                Publicar Trabajo
              </Link>
            </>
          )}
          <FaBell className="text-black w-8 h-8 cursor-pointer hover:text-gray-600 transition-colors duration-300" />
          <div className="relative" ref={userMenuRef}>
            <FaUserCircle 
              className="text-black w-8 h-8 cursor-pointer hover:text-gray-600 transition-colors duration-300" 
              onClick={toggleUserMenu}
            />
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 z-10">
                <Link to="/profile" className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100 font-bold transition-colors duration-200">Perfil</Link>
                <Link to="/settings" className="block px-6 py-3 text-base text-gray-700 hover:bg-gray-100 font-bold transition-colors duration-200">Configuración</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-6 py-3 text-base text-gray-700 hover:bg-gray-100 font-bold transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showChatList && isAuthenticated && !isHomePage && (
        <div className="fixed bottom-0 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl z-50">
          <ChatList isFloating={true} />
        </div>
      )}

      {!isAuthenticated && (
        <div className="flex space-x-4 items-center">
          <button 
            onClick={() => handleAuth('login')}
            className={`border-${themeColor}-600 border-2 text-${themeColor}-600 font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-600 hover:text-white`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => handleAuth('register')}
            className={`border-${themeColor}-600 border-2 text-${themeColor}-600 font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-600 hover:text-white`}
          >
            Regístrate
          </button>
          <button
            onClick={toggleMode}
            className={`bg-${themeColor}-600 text-white font-bold py-2 px-4 rounded shadow-md transition-colors duration-300 hover:bg-${themeColor}-700 flex items-center`}
          >
            <FaExchangeAlt className="mr-2" />
            {currentType === 'company' ? 'Modo Freelancer' : 'Modo Empresa'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
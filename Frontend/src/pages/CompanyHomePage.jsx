import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaSearch, FaUsers, FaBriefcase, FaComments, FaUserTie } from 'react-icons/fa';
import Navbar from '../components/general/Navbar';
import ChatList from '../components/Chat/ChatList';
import { Footer } from "../components/general/footer";
import TalentSearch from '../components/company/TalentSearch';
import ResultsGrid from '../components/general/ResultsGrid';
import { getAllJobs } from '../api/Services.api';
import { useAuth } from '../context/AuthContext';

const CompanyHomePage = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        const companyJobs = response.data.filter(job => job.company?.id === user.id);
        setJobs(companyJobs);
      } catch (error) {
        console.error('Error al obtener trabajos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  const handleChatError = (error) => {
    console.error('Error en el chat:', error);
    setChatError(error);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} isCompanyMode={true} hideSearch={true} />

      <div className="h-20"></div>

      {/* Header mejorado */}
      <header className="bg-gradient-to-r from-green-600 to-green-500 text-white py-8 shadow-md">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Bienvenido a su Portal Empresarial</h1>
          <p className="text-green-100">Gestione sus ofertas y candidatos de manera eficiente</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Sección de búsqueda de talento */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Buscar Talento</h2>
          <TalentSearch />
        </section>

        {/* Acciones rápidas mejoradas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/post-job" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <FaBriefcase className="text-3xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Publicar Trabajo</h3>
            <p className="text-gray-600">Cree una nueva oferta de trabajo para atraer talento.</p>
          </Link>
          
          <Link to="/gestionar-candidatos" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <FaUsers className="text-3xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gestionar Candidatos</h3>
            <p className="text-gray-600">Revise y gestione las aplicaciones a sus ofertas.</p>
          </Link>
          
          <Link to="/empleados" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <FaUserTie className="text-3xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mis Empleados</h3>
            <p className="text-gray-600">Gestione y comuníquese con sus empleados contratados.</p>
          </Link>
          
          <Link to="/profile" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <FaBuilding className="text-3xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfil de Empresa</h3>
            <p className="text-gray-600">Actualice la información de su empresa.</p>
          </Link>
        </section>

        {/* Sección de trabajos mejorada */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Mis Trabajos Publicados</h2>
            <Link 
              to=""
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <span>Administrar publicaciones</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
              <p className="mt-4 text-gray-600 animate-pulse">Cargando trabajos publicados...</p>
              <div className="mt-2 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="animate-progress w-full h-full bg-green-600 rounded-full"></div>
              </div>
            </div>
          ) : jobs.length > 0 ? (
            <ResultsGrid 
              items={jobs}
              isService={false}
              title="Trabajos"
            />
          ) : (
            <div className="text-center bg-gray-50 rounded-xl p-8">
              <FaBriefcase className="text-5xl text-green-600 mb-4 mx-auto opacity-50" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay trabajos publicados</h3>
              <p className="text-gray-600 mb-4">Comience publicando su primera oferta de trabajo</p>
              <Link 
                to="/post-job"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Publicar Trabajo
              </Link>
            </div>
          )}
        </section>

        {/* Resumen de actividad mejorado */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumen de Actividad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 text-center transition-transform hover:-translate-y-1">
              <p className="text-4xl font-bold text-green-600 mb-2">{jobs.length}</p>
              <p className="text-gray-600">Trabajos Activos</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center transition-transform hover:-translate-y-1">
              <p className="text-4xl font-bold text-green-600 mb-2">48</p>
              <p className="text-gray-600">Candidatos Nuevos</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center transition-transform hover:-translate-y-1">
              <p className="text-4xl font-bold text-green-600 mb-2">5</p>
              <p className="text-gray-600">Trabajadores activos </p>
            </div>
          </div>
        </section>
      </main>

      {/* Chat flotante mejorado */}
      <div className="fixed right-6 bottom-6 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaComments size={24} />
          </button>
        ) : (
          <div className="bg-white rounded-xl shadow-xl w-96 h-[600px] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-green-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Mensajes</h2>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="h-[calc(600px-64px)]">
              {chatError ? (
                <div className="p-4 text-red-500 text-center">
                  <p>Error al cargar el chat. Por favor, intenta de nuevo.</p>
                </div>
              ) : (
                <ChatList 
                  isFloating={true} 
                  onError={handleChatError}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CompanyHomePage;
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaSearch, FaUsers, FaBriefcase } from 'react-icons/fa';
import Navbar from '../components/general/Navbar';

const CompanyHomePage = () => {
  return (
    <div className="bg-green-50 min-h-screen">
      {/* Navbar */}
      <Navbar isAuthenticated={true} isCompanyMode={true} />

      {/* Encabezado */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Bienvenido a su Portal Empresarial</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección de búsqueda */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Buscar Talento</h2>
          <div className="flex items-center bg-green-100 rounded-full p-2">
            <input
              type="text"
              placeholder="Buscar habilidades, roles o palabras clave"
              className="flex-grow bg-transparent outline-none px-4"
            />
            <button className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors">
              <FaSearch />
            </button>
          </div>
        </section>

        {/* Sección de acciones rápidas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/post-job" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <FaBriefcase className="text-4xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Publicar Trabajo</h3>
            <p className="text-gray-600">Cree una nueva oferta de trabajo para atraer talento.</p>
          </Link>
          <Link to="/gestionar-candidatos" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <FaUsers className="text-4xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Gestionar Candidatos</h3>
            <p className="text-gray-600">Revise y gestione las aplicaciones a sus ofertas.</p>
          </Link>
          <Link to="/perfil-empresa" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <FaBuilding className="text-4xl text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Perfil de Empresa</h3>
            <p className="text-gray-600">Actualice la información de su empresa.</p>
          </Link>
        </section>

        {/* Sección de estadísticas */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Resumen de Actividad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-4xl font-bold text-green-600">12</p>
              <p className="text-gray-600">Trabajos Activos</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-4xl font-bold text-green-600">48</p>
              <p className="text-gray-600">Candidatos Nuevos</p>
            </div>
            <div className="bg-green-100 rounded-lg p-4 text-center">
              <p className="text-4xl font-bold text-green-600">5</p>
              <p className="text-gray-600">Entrevistas Programadas</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyHomePage;

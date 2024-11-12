import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/general/Navbar';
import { useAuth } from '../context/AuthContext';
import applicationsApi from '../api/Applications.api';
import MyJobsList from '../components/freelancer/MyJobsList';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyJobsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const response = await applicationsApi.getMyApplications();
        // Filtrar para mostrar solo las aplicaciones pendientes y aceptadas
        const filteredApplications = response.data.filter(
          app => app.status === 'Pendiente' || app.status === 'Aceptada'
        );
        setApplications(filteredApplications);
      } catch (error) {
        console.error('Error al obtener aplicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyApplications();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <Link to="/home" className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200 mb-4">
                <FaArrowLeft className="mr-2" />
                <span>Volver al inicio</span>
              </Link>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Mis Aplicaciones</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Total: {applications.length} aplicaciones
                  </span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <MyJobsList applications={applications} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobsPage; 
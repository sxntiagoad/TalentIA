import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/general/Navbar';
import ChatComponent from '../components/Chat/ChatComponent';
import { FaArrowLeft, FaBriefcase } from 'react-icons/fa';
import applicationsApi from '../api/Applications.api';

const WorkspacePage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await applicationsApi.getApplication(applicationId);
        setApplication(response.data);
      } catch (error) {
        console.error('Error al obtener la aplicación:', error);
        navigate('/my-jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Aplicación no encontrada</h2>
            <Link to="/my-jobs" className="mt-4 inline-flex items-center text-purple-600 hover:text-purple-700">
              <FaArrowLeft className="mr-2" /> Volver a mis trabajos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link 
                to="/my-jobs" 
                className="text-purple-600 hover:text-purple-700 mr-4"
              >
                <FaArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaBriefcase className="mr-2" />
                  {application.job_title}
                </h1>
                <p className="text-sm text-gray-600">{application.company_name}</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {application.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat a pantalla completa */}
      <div className="flex-1 bg-gray-50">
        <ChatComponent
          otherUser={{
            id: application.company_id,
            name: application.company_name,
            type: 'company'
          }}
          isFullScreen={true}
        />
      </div>
    </div>
  );
};

export default WorkspacePage; 
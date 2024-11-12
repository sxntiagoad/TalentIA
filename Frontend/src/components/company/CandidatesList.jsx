import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import applicationsApi from '../../api/Applications.api';
import { getPublicProfile } from '../../api/Profile.api';
import { FaUserCircle, FaPhone, FaFileAlt, FaCheck, FaTimes, FaUser, FaComments, FaBriefcase } from 'react-icons/fa';
import ChatComponent from '../Chat/ChatComponent';

const CandidatesList = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [freelancerProfile, setFreelancerProfile] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [activeTab, setActiveTab] = useState('candidates'); // 'candidates' o 'employees'

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await applicationsApi.getJobApplications(jobId);
        const allApplications = response.data;
        
        // Separar las aplicaciones en aceptadas y pendientes
        setAcceptedApplications(allApplications.filter(app => app.status === 'Aceptada'));
        setApplications(allApplications.filter(app => app.status !== 'Aceptada'));
      } catch (error) {
        console.error('Error al obtener aplicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await applicationsApi.updateApplicationStatus(applicationId, newStatus);
      
      if (newStatus === 'Rechazada') {
        setApplications(applications.filter(app => app.id !== applicationId));
        setSelectedApplication(null);
      } else if (newStatus === 'Aceptada') {
        const acceptedApp = applications.find(app => app.id === applicationId);
        if (acceptedApp) {
          // Mover la aplicación a la lista de aceptados
          setAcceptedApplications([...acceptedApplications, { ...acceptedApp, status: 'Aceptada' }]);
          setApplications(applications.filter(app => app.id !== applicationId));
          
          // Configurar el chat
          setSelectedFreelancer({
            id: acceptedApp.freelancer_id,
            name: acceptedApp.freelancer_name,
            type: 'freelancer'
          });
          setShowChat(true);
          setActiveTab('employees');
        }
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En revisión': 'bg-blue-100 text-blue-800',
      'Aceptada': 'bg-green-100 text-green-800',
      'Rechazada': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors['Pendiente'];
  };

  const handleApplicationClick = async (application) => {
    if (selectedApplication && selectedApplication.id === application.id) {
      setSelectedApplication(null);
      setFreelancerProfile(null);
    } else {
      setSelectedApplication(application);
      try {
        const freelancerId = application.freelancer?.id || application.freelancer_id;
        if (freelancerId) {
          const response = await getPublicProfile('freelancer', freelancerId);
          setFreelancerProfile(response.data);
        } else {
          console.error('ID del freelancer no disponible');
          setFreelancerProfile(null);
        }
      } catch (error) {
        console.error('Error al obtener el perfil del freelancer:', error);
        setFreelancerProfile(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs de navegación centrados */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`${
              activeTab === 'candidates'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
          >
            Candidatos ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`${
              activeTab === 'employees'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
          >
            Empleados ({acceptedApplications.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {/* Cambiar el grid por un diseño centrado */}
          <div className="flex justify-center">
            {/* Lista de candidatos/empleados */}
            <div className="w-full max-w-2xl">
              {activeTab === 'candidates' ? (
                applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all duration-200 
                          ${selectedApplication?.id === application.id ? 'ring-2 ring-green-500' : 'hover:shadow-md'}`}
                        onClick={() => handleApplicationClick(application)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                src={application.freelancer_avatar || '/default-avatar.png'}
                                alt={application.freelancer_name}
                                className="h-12 w-12 rounded-full"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {application.freelancer_name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Aplicó el {new Date(application.created_at).toLocaleDateString()}
                              </p>
                              <Link
                                to={`/profile/freelancer/${application.freelancer_id}`}
                                className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FaUser className="mr-1" /> Ver perfil completo
                              </Link>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
                    <FaUserCircle className="text-gray-400 text-6xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay candidatos pendientes</h3>
                    <p className="text-gray-500 text-center">
                      Cuando los candidatos apliquen a este trabajo, aparecerán aquí.
                    </p>
                  </div>
                )
              ) : (
                // Lista de empleados
                acceptedApplications.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedApplications.map((employee) => (
                      <div
                        key={employee.id}
                        className="bg-white rounded-lg shadow p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <img
                                src={employee.freelancer_avatar || '/default-avatar.png'}
                                alt={employee.freelancer_name}
                                className="h-12 w-12 rounded-full"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {employee.freelancer_name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Contratado el {new Date(employee.updated_at).toLocaleDateString()}
                              </p>
                              <Link
                                to={`/profile/freelancer/${employee.freelancer_id}`}
                                className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-flex items-center"
                              >
                                <FaUser className="mr-1" /> Ver perfil completo
                              </Link>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedFreelancer({
                                id: employee.freelancer_id,
                                name: employee.freelancer_name,
                                type: 'freelancer'
                              });
                              setShowChat(true);
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                          >
                            <FaComments className="mr-2" /> Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow">
                    <FaBriefcase className="text-gray-400 text-6xl mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleados contratados</h3>
                    <p className="text-gray-500 text-center">
                      Los candidatos que aceptes aparecerán en esta lista.
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Panel de detalles (solo para candidatos) */}
            {activeTab === 'candidates' && selectedApplication && (
              <div className="ml-4 w-96 bg-white rounded-lg shadow p-6">
                <div className="space-y-3">
                  <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedApplication.freelancer_name}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'Aceptada')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <FaCheck className="mr-2" /> Aceptar
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedApplication.id, 'Rechazada')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <FaTimes className="mr-2" /> Rechazar
                      </button>
                    </div>
                  </div>

                  {/* Información del perfil */}


                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-0">Carta de presentación</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-line">
                        {selectedApplication.cover_letter}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chat flotante */}
      {showChat && selectedFreelancer && (
        <div className="fixed bottom-16 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl z-50">
          <ChatComponent 
            otherUser={selectedFreelancer} 
            onClose={() => setShowChat(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
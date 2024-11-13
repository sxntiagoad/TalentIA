import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaUsers, FaEdit, FaEye, FaToggleOn, FaToggleOff, FaChartLine } from 'react-icons/fa';
import PendingRequests from './PendingRequests';
import ChatComponent from '../Chat/ChatComponent';
import servicesApi from '../../api/Services.api';

const MyServicesList = ({ services }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' o 'requests'
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceStats, setServiceStats] = useState({});

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchServiceRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    // Cargar estadísticas para cada servicio
    const loadServiceStats = async () => {
      const stats = {};
      for (const service of services) {
        try {
          const response = await servicesApi.getServiceStats(service.id);
          stats[service.id] = response.data;
        } catch (error) {
          console.error(`Error al cargar estadísticas para servicio ${service.id}:`, error);
          stats[service.id] = { requests: 0, completed: 0 };
        }
      }
      setServiceStats(stats);
    };

    if (services.length > 0) {
      loadServiceStats();
    }
  }, [services]);

  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      console.log('Obteniendo solicitudes de servicios...');
      const response = await servicesApi.getReceivedServiceRequests();
      console.log('Respuesta de solicitudes:', response.data);
      const activeRequests = response.data.filter(
        request => !['Completada', 'Rechazada'].includes(request.status)
      );
      setRequests(activeRequests);
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, newStatus) => {
    try {
      await servicesApi.updateServiceRequestStatus(requestId, newStatus);
      // Actualizar la lista de solicitudes
      fetchServiceRequests();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  };

  const handleStartChat = (clientInfo) => {
    setSelectedClient({
      id: clientInfo.id,
      name: clientInfo.name,
      type: 'user',
      profile_id: clientInfo.id
    });
    setShowChat(true);
  };

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <FaStore className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servicios publicados</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza publicando tu primer servicio para recibir solicitudes.
        </p>
        <div className="mt-6">
          <Link
            to="/post-service"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            Publicar servicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-center space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`${
              activeTab === 'active'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
          >
            Servicios Activos ({services.filter(s => s.availability).length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`${
              activeTab === 'requests'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm relative`}
          >
            Solicitudes Pendientes
            {requests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {requests.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'active' ? (
        // Lista de servicios activos
        <div className="grid grid-cols-1 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Imagen del servicio */}
                  <div className="flex-shrink-0">
                    <img
                      src={service.service_image || '/default-service.png'}
                      alt={service.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Información del servicio */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {service.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {service.description.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      </div>
                    </div>

                    {/* Estadísticas y acciones */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <FaUsers className="mr-1" />
                          {serviceStats[service.id]?.requests || 0} solicitudes
                        </span>
                        <span className="flex items-center">
                          <FaChartLine className="mr-1" />
                          {serviceStats[service.id]?.completed || 0} completados
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/services/${service.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FaEye className="mr-2" />
                          Ver
                        </Link>
                        <Link
                          to={`/edit-service/${service.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FaEdit className="mr-2" />
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Lista de solicitudes pendientes
        loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <PendingRequests
            requests={requests}
            onUpdateStatus={handleUpdateRequestStatus}
            onStartChat={handleStartChat}
          />
        )
      )}

      {/* Chat flotante */}
      {showChat && selectedClient && (
        <div className="fixed bottom-16 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl z-50">
          <ChatComponent 
            otherUser={selectedClient}
            onClose={() => {
              setShowChat(false);
              setSelectedClient(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MyServicesList;
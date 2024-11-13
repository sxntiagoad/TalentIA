import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaComments } from 'react-icons/fa';

const PendingRequests = ({ requests, onUpdateStatus, onStartChat }) => {
  const getStatusBadge = (status) => {
    const badges = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Aceptada': 'bg-blue-100 text-blue-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Completada': 'bg-green-100 text-green-800',
      'Rechazada': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStartChat = (request) => {
    const clientInfo = {
      id: request.client,  // ID del cliente
      name: request.client_name,
      type: 'user',
      profile_id: request.client  // Asegurarnos de incluir el profile_id
    };
    onStartChat(clientInfo);
  };

  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-12">
        <FaSpinner className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes pendientes</h3>
        <p className="mt-1 text-sm text-gray-500">
          Las solicitudes de tus servicios aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{request.service_title}</h3>
              <p className="text-sm text-gray-500">Cliente: {request.client_name}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              {request.status === 'Pendiente' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(request.id, 'Aceptada')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaCheckCircle className="mr-2" />
                    Aceptar
                  </button>
                  <button
                    onClick={() => onUpdateStatus(request.id, 'Rechazada')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <FaTimesCircle className="mr-2" />
                    Rechazar
                  </button>
                </>
              )}
              {(request.status === 'Aceptada' || request.status === 'En Proceso') && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStartChat(request)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaComments className="mr-2" />
                    Chat con el cliente
                  </button>
                  {request.status === 'Aceptada' && (
                    <button
                      onClick={() => onUpdateStatus(request.id, 'En Proceso')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaCheckCircle className="mr-2" />
                      Iniciar Proceso
                    </button>
                  )}
                  {request.status === 'En Proceso' && (
                    <button
                      onClick={() => onUpdateStatus(request.id, 'Completada')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <FaCheckCircle className="mr-2" />
                      Marcar como completado
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900">Detalles del pedido:</h4>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Plan:</span>
                <span className="ml-2 font-medium">{request.plan_type}</span>
              </div>
              <div>
                <span className="text-gray-500">Monto:</span>
                <span className="ml-2 font-medium">${request.order_amount}</span>
              </div>
            </div>
            {request.requirements && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Requisitos:</h4>
                <p className="mt-1 text-sm text-gray-600">{request.requirements}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingRequests; 
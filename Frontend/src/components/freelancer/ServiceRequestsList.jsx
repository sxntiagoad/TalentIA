import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaComments } from 'react-icons/fa';
import ChatComponent from '../Chat/ChatComponent';

const ServiceRequestsList = ({ requests, onUpdateStatus, onStartChat }) => {
  const getStatusBadge = (status) => {
    const badges = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'En Proceso': 'bg-blue-100 text-blue-800',
      'Completada': 'bg-green-100 text-green-800',
      'Cancelada': 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

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
                    onClick={() => onUpdateStatus(request.id, 'En Proceso')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaCheckCircle className="mr-2" />
                    Aceptar
                  </button>
                  <button
                    onClick={() => onUpdateStatus(request.id, 'Cancelada')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <FaTimesCircle className="mr-2" />
                    Rechazar
                  </button>
                </>
              )}
              {request.status === 'En Proceso' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(request.id, 'Completada')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    <FaCheckCircle className="mr-2" />
                    Marcar como completado
                  </button>
                  <button
                    onClick={() => onStartChat(request.client)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FaComments className="mr-2" />
                    Chat
                  </button>
                </>
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

export default ServiceRequestsList; 
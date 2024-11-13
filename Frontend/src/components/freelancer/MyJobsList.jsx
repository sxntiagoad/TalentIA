import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const MyJobsList = ({ applications }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aceptada':
        return <FaCheckCircle className="text-green-500" />;
      case 'Pendiente':
        return <FaSpinner className="text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Aceptada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay aplicaciones</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aún no has aplicado a ningún trabajo o todas tus aplicaciones han sido procesadas.
        </p>
        <div className="mt-6">
          <Link
            to="/home"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
          >
            Buscar trabajos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <div
          key={application.id}
          className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {application.job_title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                    <span className="mr-1">{getStatusIcon(application.status)}</span>
                    {application.status}
                  </span>
                </div>
                
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaBuilding className="mr-2" />
                    {application.company_name}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-2" />
                    {application.job_location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="mr-2" />
                    Aplicado el {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Tu carta de presentación:</h4>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">
                    {application.cover_letter}
                  </p>
                </div>

                {application.status === 'Aceptada' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-3">
                      ¡Felicitaciones! Has sido seleccionado para este puesto.
                    </p>
                    <Link
                      to={`/workspace/${application.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FaBriefcase className="mr-2" />
                      Ir al espacio de trabajo
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyJobsList; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserTie, FaComments, FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import applicationsApi from '../../api/Applications.api';
import ChatComponent from '../Chat/ChatComponent';
import { Navbar } from '../general/Navbar';
import { getAllJobs } from '../../api/Services.api';
import { useAuth } from '../../context/AuthContext';

const EmployeesList = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterByJob, setFilterByJob] = useState('all');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchEmployeesFromAllJobs = async () => {
      try {
        // 1. Obtener todos los trabajos de la empresa
        const jobsResponse = await getAllJobs();
        const companyJobs = jobsResponse.data.filter(job => job.company?.id === user.id);
        
        // 2. Obtener las aplicaciones para cada trabajo
        let allAcceptedApplications = [];
        let uniqueJobs = {};

        await Promise.all(companyJobs.map(async (job) => {
          try {
            const applicationsResponse = await applicationsApi.getJobApplications(job.id);
            const acceptedApplications = applicationsResponse.data.filter(app => app.status === 'Aceptada');
            
            // Agregar información del trabajo a cada aplicación
            const applicationsWithJob = acceptedApplications.map(app => ({
              ...app,
              job: {
                id: job.id,
                title: job.title
              }
            }));

            if (acceptedApplications.length > 0) {
              uniqueJobs[job.id] = job.title;
            }

            allAcceptedApplications = [...allAcceptedApplications, ...applicationsWithJob];
          } catch (error) {
            console.error(`Error al obtener aplicaciones para el trabajo ${job.id}:`, error);
          }
        }));

        setJobs(Object.entries(uniqueJobs).map(([id, title]) => ({ id, title })));
        setEmployees(allAcceptedApplications);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEmployeesFromAllJobs();
    }
  }, [user]);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.freelancer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = filterByJob === 'all' || employee.job?.id.toString() === filterByJob.toString();
    return matchesSearch && matchesJob;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} isCompanyMode={true} />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <Link to="/company-home" className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-200 mb-4">
                <FaArrowLeft className="mr-2" />
                <span>Volver al inicio</span>
              </Link>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Mis Empleados</h1>
                <div className="flex items-center space-x-2">
                  <FaUserTie className="text-green-600 text-2xl" />
                  <span className="text-gray-600">Total: {employees.length}</span>
                </div>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar empleado..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              {jobs.length > 0 && (
                <div className="sm:w-64">
                  <div className="relative">
                    <select
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      value={filterByJob}
                      onChange={(e) => setFilterByJob(e.target.value)}
                    >
                      <option value="all">Todos los trabajos</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title}</option>
                      ))}
                    </select>
                    <FaFilter className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                {/* Lista de empleados */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={employee.freelancer_avatar || '/default-avatar.png'}
                            alt={employee.freelancer_name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {employee.freelancer_name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {employee.job?.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              Contratado el {new Date(employee.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <Link
                            to={`/profile/freelancer/${employee.freelancer_id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Ver perfil
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedEmployee({
                                id: employee.freelancer_id,
                                name: employee.freelancer_name,
                                type: 'freelancer'
                              });
                              setShowChat(true);
                            }}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 hover:text-green-700"
                          >
                            <FaComments className="mr-2" /> Chat
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                      <FaUserTie className="text-gray-400 text-6xl mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay empleados contratados</h3>
                      <p className="text-gray-500 text-center">
                        Los candidatos que aceptes aparecerán en esta lista.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat flotante */}
      {showChat && selectedEmployee && (
        <div className="fixed bottom-16 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl z-50">
          <ChatComponent 
            otherUser={selectedEmployee} 
            onClose={() => setShowChat(false)} 
          />
        </div>
      )}
    </div>
  );
};

export default EmployeesList; 
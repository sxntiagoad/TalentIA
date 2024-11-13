import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/general/Navbar';
import CandidatesList from '../components/company/CandidatesList';
import { getAllJobs } from '../api/Services.api';
import applicationsApi from '../api/Applications.api';
import { useAuth } from '../context/AuthContext';
import { FaBriefcase, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ManageCandidatesPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const jobsResponse = await getAllJobs();
        const companyJobs = jobsResponse.data.filter(job => job.company?.id === user.id);
        
        // Obtener las aplicaciones para cada trabajo y contar solo las pendientes
        const jobsWithApplications = await Promise.all(companyJobs.map(async (job) => {
          const applicationsResponse = await applicationsApi.getJobApplications(job.id);
          const pendingApplications = applicationsResponse.data.filter(
            app => app.status === 'Pendiente'
          );
          return { 
            ...job, 
            applicationCount: pendingApplications.length,
            totalApplications: applicationsResponse.data.length,
            acceptedCount: applicationsResponse.data.filter(app => app.status === 'Aceptada').length
          };
        }));

        // Ordenar los trabajos por número de aplicaciones pendientes (descendente)
        const sortedJobs = jobsWithApplications.sort((a, b) => b.applicationCount - a.applicationCount);
        
        setJobs(sortedJobs);
        if (sortedJobs.length > 0) {
          setSelectedJob(sortedJobs[0].id);
        }
      } catch (error) {
        console.error('Error al obtener trabajos y aplicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchJobsAndApplications();
    }
  }, [user]);

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
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Candidatos</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-yellow-600 text-2xl" />
                    <span className="text-gray-600">Pendientes: {jobs.reduce((acc, job) => acc + job.applicationCount, 0)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-green-600 text-2xl" />
                    <span className="text-gray-600">Contratados: {jobs.reduce((acc, job) => acc + job.acceptedCount, 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <label htmlFor="jobSelect" className="block text-sm font-medium text-gray-700">
                      Seleccionar trabajo
                    </label>
                    <select
                      id="jobSelect"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                      value={selectedJob || ''}
                      onChange={(e) => setSelectedJob(e.target.value)}
                    >
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} ({job.applicationCount} pendientes | {job.acceptedCount} contratados)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedJob && <CandidatesList jobId={selectedJob} />}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBriefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay trabajos publicados</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza publicando un trabajo para recibir candidatos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCandidatesPage; 
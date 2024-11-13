import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResultsGrid from '../components/general/ResultsGrid';
import { getServicesBySubcategory, getJobsBySubcategory } from '../api/Services.api';
import { Navbar } from "../components/general/Navbar";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';

function SubcategoryPage() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesResponse, jobsResponse] = await Promise.all([
          getServicesBySubcategory(id),
          getJobsBySubcategory(id)
        ]);
        setServices(servicesResponse.data);
        setJobs(jobsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setError('Hubo un problema al cargar los datos. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar isAuthenticated={true} />
      <div className="pt-24"> {/* Aumentado el padding-top para bajar un poco la página */}
        <div className="flex justify-between mb-4">
          <Link to="/home" className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
            <FaArrowLeft className="mr-2" />
            Volver al inicio
          </Link>
        </div>
        <ResultsGrid items={services} isService={true} title="Servicios disponibles" />
        <ResultsGrid items={jobs} isService={false} title="Trabajos disponibles" />
      </div>
    </div>
  );
}

export default SubcategoryPage;

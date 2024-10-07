import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResultsGrid from '../components/general/ResultsGrid';
import { getServicesBySubcategory, getJobsBySubcategory } from '../api/Services.api';
import { Navbar } from "../components/general/Navbar";

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

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar isAuthenticated={true} />
      <div className="pt-16">
        <h1>Servicios y trabajos en esta subcategoría</h1>
        <ResultsGrid items={services} isService={true} title="Servicios disponibles" />
        <ResultsGrid items={jobs} isService={false} title="Trabajos disponibles" />
      </div>
    </div>
  );
}

export default SubcategoryPage;

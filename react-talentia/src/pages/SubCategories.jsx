import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ResultsGrid from '../components/general/ResultsGrid';
import { getServicesBySubcategory } from '../api/Services.api';

function SubcategoryPage() {
  const { id } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const response = await getServicesBySubcategory(id);
        console.log(response)
        setServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
        setError('Hubo un problema al cargar los servicios. Por favor, intenta de nuevo más tarde.');
        setLoading(false);
      }
    };

    loadServices();
  }, [id]);

  if (loading) return <div>Cargando servicios...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Servicios en esta subcategoría</h1>
      <ResultsGrid items={services} isService={true} title="Servicios disponibles" />
    </div>
  );
}

export default SubcategoryPage;

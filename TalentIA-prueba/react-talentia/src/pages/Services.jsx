import React, { useState, useEffect } from 'react';
import ResultsGrid from '../components/general/ResultsGrid'; // Importa tu componente para mostrar los resultados en forma de cuadrícula
import { getAllServices } from '../api/Services.api'; // Importa la función de los endpoints
import { Navbar } from '../components/general/Navbar'; // Cambiamos la importación

function Services() {
  const [services, setServices] = useState([]); // Estado para almacenar los servicios
  const [loading, setLoading] = useState(true); // Estado para la carga de datos

  // Función para obtener los servicios
  const fetchServices = async () => {
    try {
      const response = await getAllServices(); // Llama a la API
      setServices(response.data); // Actualiza el estado con los datos obtenidos
      setLoading(false); // Actualiza el estado de carga
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      setLoading(false); // Asegura que se actualice el estado de carga
    }
  };

  // useEffect para hacer la llamada a la API cuando el componente se monta
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <>
      <Navbar isAuthenticated={true} /> {/* Actualizamos la Navbar */}
      <div className="pt-24"> {/* Ajustamos el padding top */}
        <div className="services-page">
          {loading ? (
            <p className="text-center">Cargando servicios...</p>
          ) : (
            <ResultsGrid items={services} isService={true} title="Servicios" />
          )}
        </div>
      </div>
    </>
  );
}

export default Services;

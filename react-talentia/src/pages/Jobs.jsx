import React, { useState, useEffect } from 'react';
import ResultsGrid from '../components/general/ResultsGrid'; // Importa tu componente para mostrar los resultados en forma de cuadrícula
import { getAllJobs } from '../api/Services.api'; // Importa la función de los endpoints
import { Navbar } from '../components/general/Navbar'; // Cambiamos la importación

function Jobs() {
  const [jobs, setJobs] = useState([]); // Estado para almacenar los trabajos
  const [loading, setLoading] = useState(true); // Estado para la carga de datos

  // Función para obtener los trabajos
  const fetchJobs = async () => {
    try {
      const response = await getAllJobs(); // Llama a la API
      setJobs(response.data); // Actualiza el estado con los datos obtenidos
      setLoading(false); // Actualiza el estado de carga
    } catch (error) {
      console.error('Error al obtener los trabajos:', error);
      setLoading(false); // Asegura que se actualice el estado de carga
    }
  };

  // useEffect para hacer la llamada a la API cuando el componente se monta
  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar isAuthenticated={true} /> {/* Actualizamos la Navbar */}
      <div className="pt-24"> {/* Ajustamos el padding top */}
        <div className="jobs-page">
          {loading ? (
            <p className="text-center">Cargando trabajos...</p>
          ) : (
            <ResultsGrid items={jobs} isService={false} title="Trabajos" />
          )}
        </div>
      </div>
    </>
  );
}

export default Jobs;
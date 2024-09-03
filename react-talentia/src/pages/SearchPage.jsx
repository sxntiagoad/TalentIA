import React from 'react';
import { useLocation } from 'react-router-dom';
import { ResultsGrid } from '../components/general/ResultsGrid';

const SearchPage = () => {
  const location = useLocation();
  const { results } = location.state || { results: { services: [], jobs: [] } };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resultados de la búsqueda</h1>
      {results.services.length > 0 || results.jobs.length > 0 ? (
        <>
          {results.services.length > 0 && (
            <ResultsGrid items={results.services} isService={true} title="Servicios" />
          )}
          {results.jobs.length > 0 && (
            <ResultsGrid items={results.jobs} isService={false} title="Trabajos" />
          )}
        </>
      ) : (
        <p className="text-xl">No se encontraron resultados</p>
      )}
    </div>
  );
};

export default SearchPage;
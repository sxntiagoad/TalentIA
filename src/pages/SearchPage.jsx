import React from 'react';
import { useLocation } from 'react-router-dom';
import ResultsGrid from '../components/general/ResultsGrid';
import { Navbar } from "../components/general/Navbar";

const SearchPage = () => {
  const location = useLocation();
  const { results, originalQuery, suggestedQuery } = location.state || {};

  // Asegurarse de que results tenga una estructura válida
  const safeResults = results || { services: [], jobs: [] };

  const hasResults = (safeResults.services?.length > 0) || (safeResults.jobs?.length > 0);
  const hasSuggestedQuery = suggestedQuery && suggestedQuery !== originalQuery;

  return (
    <>
      <Navbar isAuthenticated={true}/>
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Resultados de la búsqueda</h1>
          
          {hasSuggestedQuery && (
            <p className="mb-4">
              No se encontraron resultados exactos para "{originalQuery}". 
              Tal vez quieres decir "{suggestedQuery}":
            </p>
          )}

          {hasResults ? (
            <>
              {safeResults.services?.length > 0 && (
                <ResultsGrid items={safeResults.services} isService={true} title="Servicios" />
              )}
              {safeResults.jobs?.length > 0 && (
                <ResultsGrid items={safeResults.jobs} isService={false} title="Trabajos" />
              )}
            </>
          ) : (
            <p className="text-xl">No se encontraron resultados</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
  const location = useLocation();
  const { results } = location.state || { results: { services: [], jobs: [] } };

  return (
    <div>
      <h1>Search Results</h1>
      {results.services.length > 0 || results.jobs.length > 0 ? (
        <div className="search-results">
          <h2>Services</h2>
          <ul>
            {results.services.map(service => (
              <li key={service.id}>{service.title}</li>
            ))}
          </ul>
          <h2>Jobs</h2>
          <ul>
            {results.jobs.map(job => (
              <li key={job.id}>{job.title}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchPage;
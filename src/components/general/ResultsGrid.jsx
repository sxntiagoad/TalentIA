import React from 'react';
import { Link } from 'react-router-dom';

const ResultsGrid = ({ items, isService, title }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p>{item.description}</p>
            <p>Publicado por: {item.publisher}</p>
            <p>Salario: {item.salary}</p>

            {/* Botón para ver/añadir review */}
            <Link to={`/reviews/${item.id}`} className="mt-2 inline-block bg-blue-500 text-white py-2 px-4 rounded">
              Ver/Agregar Reseña
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsGrid;
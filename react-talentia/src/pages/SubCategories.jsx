import React from 'react';
import { useParams } from 'react-router-dom';

export function SubcategoryPage() {
  const { name } = useParams();

  // Aquí puedes hacer una solicitud para obtener los datos de la subcategoría usando el nombre
  // y renderizar la información correspondiente.

  return (
    <div>
      <h1>Subcategoría: {name}</h1>
      {/* Renderiza la información de la subcategoría aquí */}
    </div>
  );
}

export default SubcategoryPage;
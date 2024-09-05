import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import backgroundImage from "../assets/FondoCategoria.png"; // Asegúrate de que la ruta de la imagen sea correcta
import '../index.css'; // Importa el archivo de estilos
import { Navbar } from "../components/general/Navbar"; // Importa el componente Navigation
import { getSubcategoriesByCategory, getCategoryById } from "../api/Categories.api";

export function MainCategoryPage() {
  const { id } = useParams(); // Obtiene el ID de la categoría desde la URL
  const [subcategories, setSubcategories] = useState([]); // Inicializa el estado de las subcategorías
  const [categoryName, setCategoryName] = useState(''); // Inicializa el estado del nombre de la categoría

  useEffect(() => {
    getSubcategoriesByCategory(id) // Obtiene las subcategorías por ID de categoría
      .then(response => setSubcategories(response.data || []))
      .catch(error => console.error('Error al obtener subcategorías:', error));

    getCategoryById(id) // Obtiene el nombre de la categoría por ID
      .then(response => setCategoryName(response.data.name))
      .catch(error => console.error('Error al obtener el nombre de la categoría:', error));
  }, [id]); // Ejecuta el efecto cuando cambia el ID de la categoría

  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className="main-category-page">
        {/* Banner con fondo de imagen, bordes redondeados y título blanco */}
        <div 
          className="rounded-lg h-56 bg-cover bg-center flex items-center justify-center mx-auto max-w-4xl"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <h1 className="text-white text-4xl font-bold">
            {categoryName || 'Cargando...'}
          </h1>
        </div>

        {/* Subcategorías con contenedores morados */}
        <div className="mt-8 mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold mb-4">Subcategorías</h2>
          {subcategories.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((subcategory) => (
                <div key={subcategory.id} className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-purple-500 rounded-lg mb-2"></div>
                  <span className="text-lg text-center">{subcategory.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron subcategorías.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MainCategoryPage;
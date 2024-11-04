import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import backgroundImage from "../assets/FondoCategoria.png";
import '../index.css';
import { Navbar } from "../components/general/Navbar";
import { getSubcategoriesByCategory, getCategoryById } from "../api/Categories.api";

export function MainCategoryPage() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    Promise.all([
      getSubcategoriesByCategory(id),
      getCategoryById(id)
    ]).then(([subcategoriesResponse, categoryResponse]) => {
      setSubcategories(subcategoriesResponse.data || []);
      setCategoryName(categoryResponse.data.name);
    }).catch(error => {
      console.error('Error al obtener datos:', error);
      setError('Hubo un problema al cargar los datos. Por favor, intenta de nuevo más tarde.');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className="pt-16">
        <div className="main-category-page">
          <div 
            className="rounded-lg h-56 bg-cover bg-center flex items-center justify-center mx-auto max-w-4xl"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <h1 className="text-white text-4xl font-bold">{categoryName}</h1>
          </div>

          <div className="mt-8 mx-auto max-w-6xl">
            <h2 className="text-2xl font-semibold mb-4">Subcategorías</h2>
            {subcategories.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subcategories.map((subcategory) => (
                  <Link to={`/subcategory/${subcategory.id}`} key={subcategory.id} className="flex flex-col items-center hover:opacity-80 transition-opacity">
                    <div className="w-32 h-32 bg-purple-500 rounded-lg mb-2 flex items-center justify-center">
                      <span className="text-white text-4xl">{subcategory.name.charAt(0)}</span>
                    </div>
                    <span className="text-lg text-center">{subcategory.name}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No se encontraron subcategorías para esta categoría.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainCategoryPage;
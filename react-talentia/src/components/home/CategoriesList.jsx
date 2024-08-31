import React, { useState, useEffect } from 'react';
import { getAllCategories, getCategoryById, getSubCategoryById } from '../../api/Categories.api';

export function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Asegúrate de tener esta línea
  const [showSubcategories, setShowSubcategories] = useState(false);

  // Obtener todas las categorías al cargar el componente
  useEffect(() => {
    getAllCategories()
      .then(response => setCategories(response.data || []))
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);

  // Manejar la selección de una categoría
  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setShowSubcategories(!showSubcategories);
    } else {
      setSelectedCategory(categoryId);
      setShowSubcategories(true);
      getCategoryById(categoryId)
        .then(response => setSubcategories(response.data.subcategories || []))
        .catch(error => console.error('Error al obtener subcategorías:', error));
    }
  };

  // Manejar la selección de una subcategoría
  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    getSubCategoryById(subcategoryId)
      .then(response => setNestedCategories(response.data.nestedcategories || []))
      .catch(error => console.error('Error al obtener categorías anidadas:', error));
  };

  return (
    <div className="py-8">
      {/* Contenedor Principal */}
      <div className="w-full mx-auto px-10">
        {/* Subcontenedor más ancho y centrado */}
        <h2 className="text-3xl font-semibold text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Categorías
        </h2>
        <div className="mt-8">
          <div className="flex flex-wrap mx-16 gap-4 justify-center">
            {categories.map(category => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="text-3xl font-semibold bg-purple-900 p-4 cursor-pointer rounded-lg shadow-md hover:bg-purple-900 w-full h-48 lg:w-64 flex items-center justify-center"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {category.name}
              </div>
            ))}
          </div>

          {/* Lista de subcategorías si hay una categoría seleccionada y si está visible */}
          {selectedCategory && showSubcategories && subcategories.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold">Subcategorías:</h3>
              <div className="flex flex-wrap gap-4 mt-2 justify-center">
                {subcategories.map(subcategory => (
                  <div
                    key={subcategory.id}
                    onClick={() => handleSubcategoryClick(subcategory.id)}
                    className="bg-purple-900 p-4 cursor-pointer rounded-lg shadow-md hover:bg-purple-900 w-full h-48 lg:w-64 flex items-center justify-center"
                  >
                    {subcategory.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de nestedcategorías si hay una subcategoría seleccionada */}
          {selectedSubcategory && nestedCategories.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold">Categorías Anidadas:</h4>
              <div className="flex flex-wrap gap-4 mt-2 justify-center">
                {nestedCategories.map(nestedCategory => (
                  <div
                    key={nestedCategory.id}
                    className="bg-purple-900 p-4 cursor-pointer rounded-lg shadow-md hover:bg-purple-900 w-full h-48 lg:w-64 flex items-center justify-center"
                  >
                    {nestedCategory.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;
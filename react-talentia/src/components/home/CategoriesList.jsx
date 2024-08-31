import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import { getAllCategories, getAllSubCategories, getSubCategoryById } from '../../api/Categories.api';

export function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    getAllCategories()
      .then(response => setCategories(response.data || []))
      .catch(error => console.error('Error al obtener categorías:', error));

    getAllSubCategories()
      .then(response => setSubcategories(response.data || []))
      .catch(error => console.error('Error al obtener subcategorías:', error));
  }, []);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setShowSubcategories(!showSubcategories);
    } else {
      setSelectedCategory(categoryId);
      setShowSubcategories(true);
    }
  };

  const handleSubcategoryClick = (subcategoryId) => {
    getSubCategoryById(subcategoryId)
      .then(response => {
        setNestedCategories(prevState => ({
          ...prevState,
          [subcategoryId]: response.data.nestedcategories || []
        }));
      })
      .catch(error => console.error('Error al obtener categorías anidadas:', error));
  };

  const filteredSubcategories = subcategories.filter(subcategory => subcategory.category === selectedCategory);

  return (
    <div className="py-8">
      <div className="w-full mx-auto px-10">
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

          {/* Mostrar subcategorías con sus nested categories */}
          {selectedCategory && showSubcategories && filteredSubcategories.length > 0 && (
            <div className="mt-6">
              {filteredSubcategories.map(subcategory => (
                <div key={subcategory.id} className="mb-4">
                  <Link to={`/subcategory/${subcategory.name}`}>
                    <h3 
                      onClick={() => handleSubcategoryClick(subcategory.id)}
                      className="text-lg font-bold cursor-pointer"
                    >
                      {subcategory.name}
                    </h3>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;
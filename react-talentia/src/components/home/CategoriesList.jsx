import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import { getAllCategories, getAllSubCategories, getSubCategoryById } from '../../api/Categories.api';
import { motion, AnimatePresence } from 'framer-motion'; // Importar componentes de framer-motion

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
          {/* Contenedor de Flex para Categorías y Subcategorías */}
          <div className="flex flex-col mx-16 gap-4 justify-center items-center">
            {/* Contenedor de Categorías */}
            <div className="flex flex-wrap gap-4">
              {categories.map(category => (
                <motion.div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="text-3xl font-semibold bg-purple-900 p-4 cursor-pointer rounded-lg shadow-md hover:bg-purple-900 w-full h-48 lg:w-64 flex items-center justify-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.div>
              ))}
            </div>

            {/* Contenedor de Subcategorías */}
            <AnimatePresence>
              {selectedCategory && showSubcategories && filteredSubcategories.length > 0 && (
                <motion.div
                  className="flex flex-col gap-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ marginLeft: '0px' }} // Ajuste de alineación para subcategorías
                >
                  {filteredSubcategories.map(subcategory => (
                    <div key={subcategory.id}>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;
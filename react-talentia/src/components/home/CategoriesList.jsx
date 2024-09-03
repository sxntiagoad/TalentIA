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

  return (
    <div className="py-8">
      <div className="w-full mx-auto px-10">
        <h2 className="text-3xl font-semibold text-center mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Categorías
        </h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {categories.map(category => (
              <div key={category.id} className="flex flex-col items-center">
                <motion.div
                  onClick={() => handleCategoryClick(category.id)}
                  className="text-2xl font-semibold bg-purple-900 p-3 cursor-pointer rounded-lg shadow-md hover:bg-purple-900 w-full h-40 flex items-center justify-center text-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.div>
                
                <AnimatePresence>
                  {selectedCategory === category.id && showSubcategories && (
                    <motion.div
                      className="mt-2 flex flex-col items-center gap-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {subcategories
                        .filter(subcategory => subcategory.category === category.id)
                        .map(subcategory => (
                          <Link key={subcategory.id} to={`/subcategory/${subcategory.name}`} className="text-center">
                            <motion.div
                              onClick={() => handleSubcategoryClick(subcategory.id)}
                              className="text-base font-semibold cursor-pointer text-black hover:text-purple-900"
                              whileHover={{ scale: 1.03 }}
                            >
                              {subcategory.name}
                            </motion.div>
                          </Link>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;
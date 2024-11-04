import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../api/Categories.api';
import { motion } from 'framer-motion';

export function CategoriesList( ) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories()
      .then(response => setCategories(response.data || []))
      .catch(error => console.error('Error al obtener categorías:', error));
  }, []);

  return (
    <div className="py-8">
      <div className="w-full mx-auto px-10">
        <h2 className="text-3xl font-semibold text-center mb-6 text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Categorías
        </h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map(category => (
              <Link key={category.id} to={`/category/${category.id}`} className="flex flex-col items-center">
                <motion.div
                  className="text-xl font-medium bg-purple-600 text-white p-4 cursor-pointer rounded-lg shadow-lg hover:bg-purple-700 w-full h-40 flex items-center justify-center text-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;
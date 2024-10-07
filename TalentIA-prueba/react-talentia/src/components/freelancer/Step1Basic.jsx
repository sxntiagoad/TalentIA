import React, { useState, useEffect } from 'react';
import { getAllCategories, getSubcategoriesByCategory, getAllNestedCategories } from '../../api/Categories.api';

const Step1Basic = ({ nextStep, handleChange, values }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [nestedCategories, setNestedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (values.category) {
        try {
          const response = await getSubcategoriesByCategory(values.category);
          setSubcategories(response.data);
        } catch (error) {
          console.error('Error al obtener las subcategorías:', error);
        }
      }
    };

    fetchSubcategories();
  }, [values.category]);

  useEffect(() => {
    const fetchNestedCategories = async () => {
      try {
        const response = await getAllNestedCategories();
        setNestedCategories(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías anidadas:', error);
      }
    };

    fetchNestedCategories();
  }, []);

  const continuar = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Paso 1: Información Básica del Servicio</h2>
      <form onSubmit={continuar}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Título del servicio</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="title"
            value={values.title}
            onChange={handleChange('title')}
            placeholder="Ej: Diseño de logotipos profesionales"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="category"
            value={values.category}
            onChange={handleChange('category')}
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-2">Subcategoría</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="subcategory"
            value={values.subcategory}
            onChange={handleChange('subcategory')}
          >
            <option value="">Seleccione una subcategoría</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="nestedcategory" className="block text-sm font-medium text-gray-700 mb-2">Categoría anidada</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="nestedcategory"
            value={values.nestedcategory}
            onChange={handleChange('nestedcategory')}
          >
            <option value="">Seleccione una categoría anidada</option>
            {nestedCategories.map((nestedCategory) => (
              <option key={nestedCategory.id} value={nestedCategory.id}>{nestedCategory.name}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          Siguiente
        </button>
      </form>
    </div>
  );
};

export default Step1Basic;

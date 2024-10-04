import React, { useState, useEffect } from 'react';
import { getCategoryById, getSubCategoryById, getNestedCategoryById } from '../../api/Categories.api';
import { createService } from '../../api/Services.api';

const Step4Final = ({ prevStep, handleChange, handleFileChange, values }) => {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [nestedcategoryName, setNestedcategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        if (values.category) {
          const categoryResponse = await getCategoryById(values.category);
          setCategoryName(categoryResponse.data.name);
        }
        if (values.subcategory) {
          const subcategoryResponse = await getSubCategoryById(values.subcategory);
          setSubcategoryName(subcategoryResponse.data.name);
        }
        if (values.nestedcategory) {
          const nestedcategoryResponse = await getNestedCategoryById(values.nestedcategory);
          setNestedcategoryName(nestedcategoryResponse.data.name);
        }
      } catch (error) {
        console.error('Error al obtener los nombres de las categorías:', error);
      }
    };

    fetchCategoryNames();
  }, [values.category, values.subcategory, values.nestedcategory]);

  useEffect(() => {
    if (values.image) {
      const reader = new FileReader();
      
    }
  }, [values.image]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Paso 4: Revisión Final</h2>
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Información Básica</h3>
        <p><strong>Título:</strong> {values.title}</p>
        <p><strong>Categoría:</strong> {categoryName}</p>
        <p><strong>Subcategoría:</strong> {subcategoryName}</p>
        <p><strong>Categoría Anidada:</strong> {nestedcategoryName}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Detalles del Servicio</h3>
        <p><strong>Descripción:</strong> {values.description}</p>
        <p><strong>Ubicación:</strong> {values.location}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Precio del Servicio</h3>
        <p><strong>Precio:</strong> {values.price}</p>
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Imagen del Servicio</h3>
        {imagePreview && <img src={imagePreview} alt="Vista previa" className="mb-4" />}
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="flex justify-between mt-6">
        <button 
          type="button" 
          className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
          onClick={prevStep}
        >
          Anterior
        </button>
        <button 
          type="button" 
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          onClick={() => {
            // Lógica para crear el servicio
          }}
        >
          Publicar Servicio
        </button>
      </div>
    </div>
  );
};

export default Step4Final;

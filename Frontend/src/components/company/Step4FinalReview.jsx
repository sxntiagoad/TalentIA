import React, { useState, useEffect } from 'react';
import { getCategoryById, getSubCategoryById, getNestedCategoryById } from '../../api/Categories.api';
import { createJob } from '../../api/Services.api';
import { useNavigate } from 'react-router-dom';

const Step4FinalReview = ({ prevStep, handleChange, handleFileChange, values }) => {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [nestedcategoryName, setNestedcategoryName] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(values.image);
    }
  }, [values.image]);

  const regresar = (e) => {
    e.preventDefault();
    prevStep();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'company') {  // Excluye explícitamente 'company'
          if (key === 'image') {
            if (values[key]) formData.append(key, values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const response = await createJob(formData);
      console.log('Trabajo creado:', response.data);
      navigate('/job-posted');
    } catch (error) {
      console.error('Error al crear el trabajo:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Hubo un error al publicar el trabajo. Por favor, inténtalo de nuevo.');
      } else {
        setError('Hubo un error al publicar el trabajo. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6">Paso 4: Revisión Final del Trabajo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Imagen del trabajo</label>
          <input
            type="file"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="image"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600"
            id="availability"
            checked={values.availability}
            onChange={handleChange('availability')}
          />
          <label className="ml-2 block text-sm text-gray-900" htmlFor="availability">Disponible</label>
        </div>
        <h3 className="text-xl font-semibold text-green-600 mb-4">Vista previa de la publicación</h3>
        <div className="bg-gray-100 p-6 rounded-md mb-6 shadow-inner">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            {imagePreview && (
              <img src={imagePreview} alt="Vista previa del trabajo" className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <h4 className="text-2xl font-bold text-gray-800 mb-2">{values.title}</h4>
            <p className="text-gray-600 mb-2">{categoryName} &gt; {subcategoryName} &gt; {nestedcategoryName}</p>
            <p className="text-gray-700 mb-4">{values.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-green-600 font-semibold">Salario: ${values.salary}</span>
              <span className="text-blue-600">{values.location}</span>
            </div>
            <h5 className="font-semibold text-gray-800 mb-2">Requisitos:</h5>
            <p className="text-gray-700">{values.requirements}</p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button 
            type="button" 
            className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            onClick={regresar}
            disabled={isSubmitting}
          >
            Anterior
          </button>
          <button 
            type="submit" 
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar trabajo'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Step4FinalReview;

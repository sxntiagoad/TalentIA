import React, { useState, useEffect } from 'react';
import { getCategoryById, getSubCategoryById, getNestedCategoryById } from '../../api/Categories.api';
import { createService } from '../../api/Services.api';
import { useNavigate } from 'react-router-dom';

const Step4Final = ({ prevStep, handleChange, handleFileChange, values }) => {
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
        if (key === 'image') {
          if (values[key]) formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await createService(formData);
      console.log('Servicio creado:', response.data);
      navigate('/service-posted-success'); // Asegúrate de tener esta ruta definida
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      setError('Hubo un error al publicar el servicio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Paso 4: Revisión Final del Servicio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Imagen del servicio</label>
          <input
            type="file"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="image"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-purple-600"
            id="availability"
            checked={values.availability}
            onChange={handleChange('availability')}
          />
          <label className="ml-2 block text-sm text-gray-900" htmlFor="availability">Disponible</label>
        </div>
        <h3 className="text-xl font-semibold text-purple-600 mb-4">Vista previa de la publicación</h3>
        <div className="bg-gray-100 p-6 rounded-md mb-6 shadow-inner">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            {imagePreview && (
              <img src={imagePreview} alt="Vista previa del servicio" className="w-full h-48 object-cover rounded-md mb-4" />
            )}
            <h4 className="text-2xl font-bold text-gray-800 mb-2">{values.title}</h4>
            <p className="text-gray-600 mb-2">{categoryName} &gt; {subcategoryName} &gt; {nestedcategoryName}</p>
            <p className="text-gray-700 mb-4">{values.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-purple-600 font-semibold">Precio: ${values.price}</span>
              <span className="text-blue-600">{values.location}</span>
            </div>
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
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar servicio'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Step4Final;

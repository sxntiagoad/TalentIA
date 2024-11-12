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

  useEffect(() => {
    console.log('Valores actuales:', values);
  }, [values]);

  const regresar = (e) => {
    e.preventDefault();
    prevStep();
  };

  const validateForm = () => {
    // Validar que al menos un plan esté activo
    if (!values.basic_active && !values.standard_active && !values.premium_active) {
      setError('Debe activar al menos un plan');
      return false;
    }

    // Validar campos requeridos del plan básico
    if (values.basic_active) {
      if (!values.basic_price || !values.basic_description || 
          !values.basic_delivery_time || !values.basic_revisions) {
        setError('Complete todos los campos del plan básico');
        return false;
      }
    }

    // Validar campos requeridos del plan estándar
    if (values.standard_active) {
      if (!values.standard_price || !values.standard_description || 
          !values.standard_delivery_time || !values.standard_revisions) {
        setError('Complete todos los campos del plan estándar');
        return false;
      }
    }

    // Validar campos requeridos del plan premium
    if (values.premium_active) {
      if (!values.premium_price || !values.premium_description || 
          !values.premium_delivery_time || !values.premium_revisions) {
        setError('Complete todos los campos del plan premium');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await createService(values);
      console.log('Servicio creado:', response.data);
      navigate('/service-posted');
    } catch (error) {
      console.error('Error al crear el servicio:', error);
      setError(error.response?.data?.error || 'Hubo un error al publicar el servicio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Paso 4: Revisión Final del Servicio</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
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
                  <div className="w-full mb-4 flex justify-center items-center">
                    <img src={imagePreview} alt="Vista previa del servicio" className="max-w-full max-h-96 object-contain rounded-md" />
                  </div>
                )}
                <h4 className="text-2xl font-bold text-gray-800 mb-2">{values.title}</h4>
                <p className="text-gray-600 mb-2">{categoryName} &gt; {subcategoryName} &gt; {nestedcategoryName}</p>
                <p className="text-gray-700 mb-4">{values.description}</p>
                <div className="flex justify-between items-center mb-4">
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
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">Planes seleccionados</h3>
          
          {values.basic_active && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-purple-600">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">Plan Básico</h4>
                <span className="text-2xl font-bold text-purple-600">
                  ${typeof values.basic_price === 'number' ? values.basic_price.toFixed(2) : values.basic_price}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{values.basic_description}</p>
              <div className="flex justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  Entrega en {values.basic_delivery_time} días
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🔄</span>
                  {values.basic_revisions} revisiones
                </span>
              </div>
            </div>
          )}

          {values.standard_active && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-purple-600">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">Plan Estándar</h4>
                <span className="text-2xl font-bold text-purple-600">
                  ${typeof values.standard_price === 'number' ? values.standard_price.toFixed(2) : values.standard_price}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{values.standard_description}</p>
              <div className="flex justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  Entrega en {values.standard_delivery_time} días
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🔄</span>
                  {values.standard_revisions} revisiones
                </span>
              </div>
            </div>
          )}

          {values.premium_active && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-purple-600">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-lg">Plan Premium</h4>
                <span className="text-2xl font-bold text-purple-600">
                  ${typeof values.premium_price === 'number' ? values.premium_price.toFixed(2) : values.premium_price}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{values.premium_description}</p>
              <div className="flex justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  Entrega en {values.premium_delivery_time} días
                </span>
                <span className="flex items-center">
                  <span className="mr-1">🔄</span>
                  {values.premium_revisions} revisiones
                </span>
              </div>
            </div>
          )}

          {!values.basic_active && !values.standard_active && !values.premium_active && (
            <div className="text-center text-gray-500 py-4">
              No hay planes seleccionados
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Step4Final;

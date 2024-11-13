import React, { useState, useEffect } from 'react';
import { getCategoryById, getSubCategoryById, getNestedCategoryById } from '../../api/Categories.api';
import { createJob } from '../../api/Services.api';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaGraduationCap, FaMapMarkerAlt, FaMoneyBillWave, FaTools, FaUserTie } from 'react-icons/fa';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'company') {
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
      setError(error.response?.data?.error || 'Error al publicar el trabajo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Columna izquierda - Formulario con vista previa integrada */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Paso 4: Revisión Final</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del trabajo
            </label>
            <input
              type="file"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              id="image"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Vista previa" 
                  className="w-full h-64 object-contain bg-gray-50"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Vista Previa del Anuncio</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-xl font-bold text-gray-800">{values.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {categoryName} &gt; {subcategoryName} &gt; {nestedcategoryName}
              </p>
              <div className="flex items-center justify-between mt-2 text-sm">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-green-600 mr-1" />
                  <span>{values.location}</span>
                </div>
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-green-600 mr-1" />
                  <span>${values.salary}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-green-600"
              id="availability"
              checked={values.availability}
              onChange={handleChange('availability')}
            />
            <label className="ml-2 block text-sm text-gray-900" htmlFor="availability">
              Disponible
            </label>
          </div>

          <div className="flex justify-between mt-6">
            <button 
              type="button" 
              onClick={prevStep}
              className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
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
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Columna derecha - Detalles completos */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Vista Detallada</h2>
        <div className="space-y-6">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-700">{values.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaUserTie className="mr-2 text-green-600" />
                Posición
              </h4>
              <p className="text-gray-700">{values.position}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaGraduationCap className="mr-2 text-green-600" />
                Educación
              </h4>
              <p className="text-gray-700">{values.education_level}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Responsabilidades</h4>
              <p className="text-gray-700 whitespace-pre-line">{values.responsibilities}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Requisitos</h4>
              <p className="text-gray-700 whitespace-pre-line">{values.requirements}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <FaTools className="mr-2 text-green-600" />
                Habilidades Técnicas
              </h4>
              <p className="text-gray-700">{values.technical_skills}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Habilidades Blandas</h4>
              <p className="text-gray-700">{values.soft_skills}</p>
            </div>
          </div>

          <button className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center">
            <span className="text-lg font-semibold">Aplicar al trabajo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4FinalReview;

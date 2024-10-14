import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/AuthContext';
import { updateCompanyProfile } from '../../api/Auth.api';
import { FaPhone, FaMapMarkerAlt, FaLanguage, FaInfoCircle, FaImage, FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TOTAL_STEPS = 2;

const CompleteCompanyProfile = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'company_avatar' && data[key][0]) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      console.log('Datos del formulario:', formData); // Para depuración
      const updatedUser = await updateCompanyProfile(formData);
      updateUser(updatedUser);
      navigate('/home');
    } catch (err) {
      setError('Hubo un problema al guardar la información de la empresa. Por favor, inténtalo de nuevo.');
      console.error('Error al actualizar el perfil de la empresa:', err.response?.data);
    }
  };

  const nextStep = () => {
    const currentStepFields = Object.keys(watch()).filter(key => renderStep()[currentStep - 1].props.children.some(child => child.props.name === key));
    const isCurrentStepValid = currentStepFields.every(field => watch(field) !== '');
    
    if (!isCurrentStepValid) {
      setError('Por favor, completa todos los campos obligatorios antes de continuar.');
      return;
    }
    setCurrentStep((prevStep) => Math.min(prevStep + 1, TOTAL_STEPS));
    setError(null);
  };

  const prevStep = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));

  const renderInput = (name, label, icon, type = "text", options = null, required = true, placeholder = "") => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        {type === "select" ? (
          <select
            {...register(name, { required: required })}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Seleccione una opción</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            {...register(name, { required: required })}
            rows={4}
            placeholder={placeholder}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
          />
        ) : type === "file" ? (
          <input
            type={type}
            {...register(name, { required: required })}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
          />
        ) : (
          <input
            type={type}
            {...register(name, { required: required })}
            placeholder={placeholder}
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
          />
        )}
      </div>
      {errors[name] && <p className="mt-1 text-sm text-red-600">Este campo es obligatorio</p>}
    </motion.div>
  );

  const renderStep = () => [
    // Paso 1: Información de contacto y ubicación
    <>
      {renderInput("phone", "Teléfono", <FaPhone className="text-gray-500" />, "tel", null, true, "Ej. +34 123 456 789")}
      {renderInput("company_location", "Ubicación", <FaMapMarkerAlt className="text-gray-500" />, "text", null, true, "Ej. Madrid, España")}
      {renderInput("company_language", "Idioma principal", <FaLanguage className="text-gray-500" />, "select", [
        { value: "es", label: "Español" },
        { value: "en", label: "Inglés" },
        { value: "fr", label: "Francés" },
        { value: "de", label: "Alemán" },
      ])}
    </>,
    // Paso 2: Información adicional
    <>
      {renderInput("information", "Información de la Empresa", <FaInfoCircle className="text-gray-500" />, "textarea", null, true, "Breve descripción de la empresa y sus actividades")}
      {renderInput("interests", "Intereses", <FaInfoCircle className="text-gray-500" />, "textarea", null, true, "Ej. Desarrollo de software, Inteligencia Artificial, Ciberseguridad")}
      {renderInput("company_avatar", "Logo de la Empresa", <FaImage className="text-gray-500" />, "file", null, false)}
    </>
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-teal-700 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Completa el perfil de {user?.name}
        </h1>
        <p className="mt-2 text-center text-xl text-green-200">
          Paso {currentStep} de {TOTAL_STEPS}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {renderStep()[currentStep - 1]}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaChevronLeft className="mr-2" /> Anterior
                </motion.button>
              )}
              {currentStep < TOTAL_STEPS ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Siguiente <FaChevronRight className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Completar Perfil <FaCheck className="ml-2" />
                </motion.button>
              )}
            </div>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-md"
            >
              {error}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompleteCompanyProfile;

import React from 'react';

const Step2JobDetails = ({ nextStep, prevStep, handleChange, values }) => {
  const continuar = (e) => {
    e.preventDefault();
    nextStep();
  };

  const regresar = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-6">Paso 2: Detalles del Trabajo</h2>
      <form onSubmit={continuar}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Puesto
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="description"
            value={values.description}
            onChange={handleChange('description')}
            rows="4"
            placeholder="Describe las responsabilidades y expectativas del puesto"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
            Cargo/Posición
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="position"
            value={values.position}
            onChange={handleChange('position')}
            placeholder="Ej: Desarrollador Senior"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de Educación Requerido
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="education_level"
            value={values.education_level}
            onChange={handleChange('education_level')}
            placeholder="Ej: Grado en Informática"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
            Salario Anual (€)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="salary"
            value={values.salary}
            onChange={handleChange('salary')}
            placeholder="Ej: 35000"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="location"
            value={values.location}
            onChange={handleChange('location')}
            placeholder="Ej: Madrid, España"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button 
            type="button" 
            className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            onClick={regresar}
          >
            Anterior
          </button>
          <button 
            type="submit" 
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2JobDetails;

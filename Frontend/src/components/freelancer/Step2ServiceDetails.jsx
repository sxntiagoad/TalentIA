import React from 'react';

const ServiceStep2ServiceDetails = ({ nextStep, prevStep, handleChange, values }) => {
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
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Paso 2: Detalles del Servicio</h2>
      <form onSubmit={continuar}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="description"
            value={values.description}
            onChange={handleChange('description')}
            rows="4"
            placeholder="Describe detalladamente el servicio que ofreces"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            id="location"
            value={values.location}
            onChange={handleChange('location')}
            placeholder="Ej: Ciudad, País"
          />
        </div>
        <div className="flex justify-between">
          <button 
            type="button" 
            className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
            onClick={regresar}
          >
            Anterior
          </button>
          <button 
            type="submit" 
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceStep2ServiceDetails;

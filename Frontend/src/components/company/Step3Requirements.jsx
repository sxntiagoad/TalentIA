import React from 'react';

const Step3Requirements = ({ nextStep, prevStep, handleChange, values }) => {
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
      <h2 className="text-2xl font-bold text-green-600 mb-6">Paso 3: Requisitos del Trabajo</h2>
      <form onSubmit={continuar}>
        <div className="mb-4">
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="requirements"
            value={values.requirements}
            onChange={handleChange('requirements')}
            rows="6"
            placeholder="Describe los requisitos necesarios para el puesto"
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
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3Requirements;

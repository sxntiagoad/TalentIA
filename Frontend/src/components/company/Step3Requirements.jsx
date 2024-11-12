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
      <h2 className="text-2xl font-bold text-green-600 mb-6">Paso 3: Requisitos y Responsabilidades</h2>
      <form onSubmit={continuar}>
        <div className="mb-4">
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Requisitos del Puesto
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="requirements"
            value={values.requirements}
            onChange={handleChange('requirements')}
            rows="4"
            placeholder="Lista los requisitos necesarios para el puesto"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
            Responsabilidades
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="responsibilities"
            value={values.responsibilities}
            onChange={handleChange('responsibilities')}
            rows="4"
            placeholder="Describe las responsabilidades principales del puesto"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="technical_skills" className="block text-sm font-medium text-gray-700 mb-2">
            Habilidades Técnicas
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="technical_skills"
            value={values.technical_skills}
            onChange={handleChange('technical_skills')}
            rows="3"
            placeholder="Lista las habilidades técnicas requeridas"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="soft_skills" className="block text-sm font-medium text-gray-700 mb-2">
            Habilidades Blandas
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            id="soft_skills"
            value={values.soft_skills}
            onChange={handleChange('soft_skills')}
            rows="3"
            placeholder="Lista las habilidades blandas deseadas"
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

export default Step3Requirements;

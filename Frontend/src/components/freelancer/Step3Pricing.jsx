import React from 'react';

const ServiceStep3Pricing = ({ nextStep, prevStep, handleChange, values }) => {
  const continuar = (e) => {
    e.preventDefault();
    if (!values.basic_active && !values.standard_active && !values.premium_active) {
      alert('Debes activar al menos un plan');
      return;
    }
    nextStep();
  };

  const regresar = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">Paso 3: Planes y Precios</h2>
      <form onSubmit={continuar}>
        {/* Plan Básico */}
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="basic_active"
              checked={values.basic_active}
              onChange={(e) => handleChange('basic_active')(e)}
              className="mr-2"
            />
            <label className="text-lg font-semibold">Plan Básico</label>
          </div>
          {values.basic_active && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={values.basic_price || ''}
                  onChange={handleChange('basic_price')}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  value={values.basic_description || ''}
                  onChange={handleChange('basic_description')}
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de entrega (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={values.basic_delivery_time || ''}
                    onChange={handleChange('basic_delivery_time')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Revisiones</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={values.basic_revisions || ''}
                    onChange={handleChange('basic_revisions')}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Plan Estándar */}
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="standard_active"
              checked={values.standard_active}
              onChange={(e) => handleChange('standard_active')(e)}
              className="mr-2"
            />
            <label className="text-lg font-semibold">Plan Estándar</label>
          </div>
          {values.standard_active && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={values.standard_price || ''}
                  onChange={handleChange('standard_price')}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  value={values.standard_description || ''}
                  onChange={handleChange('standard_description')}
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de entrega (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={values.standard_delivery_time || ''}
                    onChange={handleChange('standard_delivery_time')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Revisiones</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={values.standard_revisions || ''}
                    onChange={handleChange('standard_revisions')}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Plan Premium */}
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="premium_active"
              checked={values.premium_active}
              onChange={(e) => handleChange('premium_active')(e)}
              className="mr-2"
            />
            <label className="text-lg font-semibold">Plan Premium</label>
          </div>
          {values.premium_active && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={values.premium_price || ''}
                  onChange={handleChange('premium_price')}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md"
                  value={values.premium_description || ''}
                  onChange={handleChange('premium_description')}
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de entrega (días)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={values.premium_delivery_time || ''}
                    onChange={handleChange('premium_delivery_time')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Revisiones</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={values.premium_revisions || ''}
                    onChange={handleChange('premium_revisions')}
                  />
                </div>
              </div>
            </>
          )}
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
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceStep3Pricing;

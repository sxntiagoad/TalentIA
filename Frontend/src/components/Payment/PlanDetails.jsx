import React from 'react';

const PlanDetails = ({ planDetails, onContinue, freelancer }) => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">Precio</span>
        <span className="text-xl font-bold">USD {planDetails.price}</span>
      </div>

      <div className="text-gray-700 mb-6">
        <p>{planDetails.description}</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            Entrega en {planDetails.delivery_time} día{planDetails.delivery_time !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {planDetails.revisions} revisión{planDetails.revisions !== 1 ? 'es' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          className="w-full bg-black text-white py-3 px-4 rounded flex items-center justify-center gap-2"
          onClick={onContinue}
        >
          Continuar con la compra
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
};

export default PlanDetails; 
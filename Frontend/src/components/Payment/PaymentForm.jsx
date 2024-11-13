import React, { useState } from 'react';
import servicesApi from '../../api/Services.api';

const PaymentForm = ({ plan, planDetails, service, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (orderDetails.trim().length < 10) {
      setError('Por favor, proporciona más detalles sobre tu pedido (mínimo 10 caracteres)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Creando orden...', {
        service_id: service.id,
        plan_type: plan,
        amount: planDetails.price,
        requirements: orderDetails
      });

      // Crear la orden
      const orderResponse = await servicesApi.createServiceOrder(service.id, {
        plan_type: plan,
        requirements: orderDetails
      });

      console.log('Orden creada:', orderResponse.data);

      // Procesar el pago
      const paymentResponse = await servicesApi.processPayment(
        orderResponse.data.id,
        { 
          payment_method: paymentMethod,
          amount: planDetails.price
        }
      );

      console.log('Pago procesado:', paymentResponse.data);

      // Mostrar mensaje de éxito y esperar aceptación del freelancer
      window.location.reload();
      
    } catch (error) {
      console.error('Error en el proceso:', error);
      setError(
        error.response?.data?.error || 
        'Error al procesar el pago. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Detalles del pago</h3>
      
      <div className="mb-4">
        <p className="text-gray-600">Total a pagar:</p>
        <p className="text-2xl font-bold">USD {planDetails.price}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Detalles del pedido */}
        <div>
          <label className="block text-gray-700 mb-2">
            Detalles del pedido *
            <span className="text-sm text-gray-500 ml-1">(mínimo 10 caracteres)</span>
          </label>
          <textarea
            className="w-full border rounded-md p-2 min-h-[100px]"
            placeholder="Describe los detalles específicos de tu pedido, requisitos o cualquier información importante que el freelancer deba saber..."
            value={orderDetails}
            onChange={(e) => setOrderDetails(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Método de pago */}
        <div>
          <label className="block text-gray-700 mb-2">Método de pago</label>
          <select
            className="w-full border rounded py-2 px-3"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            disabled={loading}
          >
            <option value="card">Tarjeta de crédito/débito</option>
            <option value="paypal">PayPal</option>
            <option value="transfer">Transferencia bancaria</option>
          </select>
        </div>

        {/* Resumen del pedido */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Resumen del pedido</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Plan seleccionado:</span>
              <span className="font-medium">{plan}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiempo de entrega:</span>
              <span className="font-medium">{planDetails.delivery_time} días</span>
            </div>
            <div className="flex justify-between">
              <span>Revisiones incluidas:</span>
              <span className="font-medium">{planDetails.revisions}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Pagar ahora'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 
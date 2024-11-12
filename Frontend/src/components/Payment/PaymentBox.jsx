import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PlanDetails from './PlanDetails';
import PaymentForm from './PaymentForm';
import ChatComponent from '../Chat/ChatComponent';
import { FaComments, FaCheckCircle, FaSpinner, FaTimesCircle, FaStar, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import servicesApi from '../../api/Services.api';

const PaymentBox = ({ item }) => {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [freelancerInfo, setFreelancerInfo] = useState(null);
  const [showCompletedMessage, setShowCompletedMessage] = useState(true);
  const { user } = useAuth();

  const getAvailablePlans = () => {
    const plans = {};
    
    if (item.basic_active === true) {
      plans.basic = {
        price: parseFloat(item.basic_price) || 0,
        description: item.basic_description || '',
        delivery_time: parseInt(item.basic_delivery_time) || 0,
        revisions: parseInt(item.basic_revisions) || 0
      };
    }
    
    if (item.standard_active === true) {
      plans.standard = {
        price: parseFloat(item.standard_price) || 0,
        description: item.standard_description || '',
        delivery_time: parseInt(item.standard_delivery_time) || 0,
        revisions: parseInt(item.standard_revisions) || 0
      };
    }
    
    if (item.premium_active === true) {
      plans.premium = {
        price: parseFloat(item.premium_price) || 0,
        description: item.premium_description || '',
        delivery_time: parseInt(item.premium_delivery_time) || 0,
        revisions: parseInt(item.premium_revisions) || 0
      };
    }

    return plans;
  };

  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(false);
  };

  useEffect(() => {
    const checkExistingOrder = async () => {
      try {
        const response = await servicesApi.checkServiceOrder(item.id);
        if (response.data.exists) {
          setOrderStatus(response.data.status);
          setFreelancerInfo(response.data.freelancer);
          if (response.data.status !== 'Completado') {
            setShowCompletedMessage(true);
          }
        }
      } catch (error) {
        console.error('Error al verificar orden:', error);
      }
    };

    if (user && item?.id) {
      checkExistingOrder();
      const intervalId = setInterval(checkExistingOrder, 10000);
      return () => clearInterval(intervalId);
    }
  }, [user, item?.id]);

  // Si no hay item o el usuario es el dueño, no mostrar nada
  if (!item || (user && user.id === item.freelancer?.id)) {
    return null;
  }

  // Si ya existe una orden y está completada pero el mensaje está oculto, mostrar el formulario normal
  if (orderStatus === 'Completado' && !showCompletedMessage) {
    const plans = getAvailablePlans();
    return (
      <div className="max-w-[400px] w-full min-h-[600px] border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className="flex border-b">
          {Object.entries(plans).map(([planType, planData]) => (
            <button 
              key={planType}
              className={`flex-1 py-4 px-4 text-sm sm:text-base ${
                selectedPlan === planType 
                  ? 'font-medium border-b-2 border-black bg-gray-50' 
                  : 'text-gray-500 hover:bg-gray-50'
              } transition-colors duration-200`}
              onClick={() => handlePlanChange(planType)}
            >
              {planType === 'basic' ? 'Básico' : 
               planType === 'standard' ? 'Estándar' : 
               'Premium'}
            </button>
          ))}
        </div>

        <div className="flex-grow h-full">
          {showPaymentForm ? (
            <PaymentForm 
              plan={selectedPlan}
              planDetails={plans[selectedPlan]}
              service={item}
              onCancel={() => setShowPaymentForm(false)}
            />
          ) : (
            <PlanDetails
              planDetails={plans[selectedPlan]}
              onContinue={() => setShowPaymentForm(true)}
              freelancer={item.freelancer}
            />
          )}
        </div>
      </div>
    );
  }

  // Si ya existe una orden, mostrar el estado correspondiente
  if (orderStatus) {
    let message;
    let icon;
    let showChatButton = false;
    let statusColor;
    let showReviewButton = false;

    switch (orderStatus) {
      case 'Pendiente':
        message = 'Tu solicitud está pendiente de aprobación por el freelancer.';
        icon = <FaSpinner className="text-yellow-500 text-4xl mx-auto animate-spin" />;
        statusColor = 'bg-yellow-50';
        break;
      case 'En Proceso':
        message = 'El freelancer ha aceptado tu solicitud. Puedes comenzar a chatear.';
        icon = <FaCheckCircle className="text-green-500 text-4xl mx-auto" />;
        showChatButton = true;
        statusColor = 'bg-green-50';
        break;
      case 'Completado':
        message = '¡El servicio ha sido completado! ¿Qué te pareció? Tu opinión es muy importante para la comunidad.';
        icon = <FaCheckCircle className="text-green-500 text-4xl mx-auto" />;
        showChatButton = true;
        showReviewButton = true;
        statusColor = 'bg-green-50';
        break;
      case 'Rechazado':
        message = 'Lo sentimos, el freelancer ha rechazado la solicitud.';
        icon = <FaTimesCircle className="text-red-500 text-4xl mx-auto" />;
        statusColor = 'bg-red-50';
        break;
      default:
        message = 'Estado del servicio desconocido.';
        statusColor = 'bg-gray-50';
    }

    return (
      <div className="max-w-[400px] w-full min-h-[200px] border rounded-lg overflow-hidden bg-white shadow-lg">
        <div className={`p-6 ${statusColor} relative`}>
          {orderStatus === 'Completado' && (
            <button
              onClick={() => setShowCompletedMessage(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          )}
          <div className="text-center space-y-4">
            {icon}
            <h3 className="text-xl font-bold text-gray-900">Estado del Servicio</h3>
            <p className="text-gray-600">{message}</p>
            
            <div className="space-y-3">
              {showChatButton && (
                <button
                  onClick={() => setShowChat(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <FaComments className="mr-2" />
                  Chatear con el freelancer
                </button>
              )}
              
              {showReviewButton && (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <FaStar className="text-yellow-500 text-2xl mr-2" />
                    <span className="text-gray-700 font-medium">¿Qué te pareció el servicio?</span>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    Tu opinión es muy importante para la comunidad
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showChat && freelancerInfo && (
          <div className="fixed bottom-16 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl z-50">
            <ChatComponent
              otherUser={freelancerInfo}
              onClose={() => setShowChat(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[400px] w-full min-h-[600px] border rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="flex border-b">
        {Object.entries(getAvailablePlans()).map(([planType, planData]) => (
          <button 
            key={planType}
            className={`flex-1 py-4 px-4 text-sm sm:text-base ${
              selectedPlan === planType 
                ? 'font-medium border-b-2 border-black bg-gray-50' 
                : 'text-gray-500 hover:bg-gray-50'
            } transition-colors duration-200`}
            onClick={() => handlePlanChange(planType)}
          >
            {planType === 'basic' ? 'Básico' : 
             planType === 'standard' ? 'Estándar' : 
             'Premium'}
          </button>
        ))}
      </div>

      <div className="flex-grow h-full">
        {showPaymentForm ? (
          <PaymentForm 
            plan={selectedPlan}
            planDetails={getAvailablePlans()[selectedPlan]}
            service={item}
            onCancel={() => setShowPaymentForm(false)}
          />
        ) : (
          <PlanDetails
            planDetails={getAvailablePlans()[selectedPlan]}
            onContinue={() => setShowPaymentForm(true)}
            freelancer={item.freelancer}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentBox;

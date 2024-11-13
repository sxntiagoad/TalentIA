import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1Basic from './Step1Basic';
import Step2ServiceDetails from './Step2ServiceDetails';
import Step3Pricing from './Step3Pricing';
import Step4Final from './Step4Final';

const ServicePostingProcess = () => {
  const [step, setStep] = useState(1);
  const [serviceData, setServiceData] = useState({
    title: '',
    category: '',
    subcategory: '',
    nestedcategory: '',
    description: '',
    location: '',
    availability: true,
    image: null,
    
    // Plan básico
    basic_active: true,
    basic_price: '',
    basic_description: '',
    basic_delivery_time: '',
    basic_revisions: '',
    
    // Plan estándar
    standard_active: false,
    standard_price: '',
    standard_description: '',
    standard_delivery_time: '',
    standard_revisions: '',
    
    // Plan premium
    premium_active: false,
    premium_price: '',
    premium_description: '',
    premium_delivery_time: '',
    premium_revisions: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post a service.');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (input) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setServiceData({ ...serviceData, [input]: value });
  };

  const handleFileChange = (e) => {
    setServiceData({ ...serviceData, image: e.target.files[0] });
  };

  const renderStep = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return <Step1Basic 
          nextStep={nextStep} 
          handleChange={handleChange} 
          values={serviceData} 
        />;
      case 2:
        return <Step2ServiceDetails 
          nextStep={nextStep} 
          prevStep={prevStep} 
          handleChange={handleChange} 
          values={serviceData} 
        />;
      case 3:
        return <Step3Pricing 
          nextStep={nextStep} 
          prevStep={prevStep} 
          handleChange={handleChange} 
          values={serviceData} 
        />;
      case 4:
        return <Step4Final 
          prevStep={prevStep} 
          handleChange={handleChange} 
          handleFileChange={handleFileChange}
          values={serviceData} 
        />;
      default:
        return <h2 className="text-green-600 text-2xl font-bold">Process completed</h2>;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">Service Posting</h1>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className={`w-1/4 text-center ${step === stepNumber ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
              Step {stepNumber}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default ServicePostingProcess;
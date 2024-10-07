import React, { useState } from 'react';
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
    price: '',
    location: '',
    availability: true,
    image: null,
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (input) => (e) => {
    setServiceData({ ...serviceData, [input]: e.target.value });
  };

  const handleFileChange = (e) => {
    setServiceData({ ...serviceData, image: e.target.files[0] });
  };

  const renderStep = () => {
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
        return <h2 className="text-green-600 text-2xl font-bold">Proceso completado</h2>;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">Publicación de Servicio</h1>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className={`w-1/4 text-center ${step === stepNumber ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
              Paso {stepNumber}
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

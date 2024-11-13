import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1BasicInfo from './Step1BasicInfo';
import Step2JobDetails from './Step2JobDetails';
import Step3Requirements from './Step3Requirements';
import Step4FinalReview from './Step4FinalReview';

const JobPostingProcess = () => {
  const [step, setStep] = useState(1);
  const [jobData, setJobData] = useState({
    title: '',
    category: '',
    subcategory: '',
    nestedcategory: '',
    description: '',
    requirements: '',
    responsibilities: '',
    education_level: '',
    position: '',
    technical_skills: '',
    soft_skills: '',
    salary: '',
    location: '',
    image: null,
    availability: true,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para publicar un trabajo.');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (input) => (e) => {
    setJobData({ ...jobData, [input]: e.target.value });
  };

  const handleFileChange = (e) => {
    setJobData({ ...jobData, image: e.target.files[0] });
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
            Ir a Iniciar Sesión
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return <Step1BasicInfo 
          nextStep={nextStep} 
          handleChange={handleChange} 
          values={jobData} 
        />;
      case 2:
        return <Step2JobDetails 
          nextStep={nextStep} 
          prevStep={prevStep} 
          handleChange={handleChange} 
          values={jobData} 
        />;
      case 3:
        return <Step3Requirements 
          nextStep={nextStep} 
          prevStep={prevStep} 
          handleChange={handleChange} 
          values={jobData} 
        />;
      case 4:
        return <Step4FinalReview 
          prevStep={prevStep} 
          handleChange={handleChange} 
          handleFileChange={handleFileChange}
          values={jobData} 
        />;
      default:
        return <h2 className="text-green-600 text-2xl font-bold">Proceso completado</h2>;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Publicación de Trabajo</h1>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className={`w-1/4 text-center ${step === stepNumber ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
              Paso {stepNumber}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default JobPostingProcess;

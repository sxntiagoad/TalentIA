import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserTie, FaGraduationCap, FaTools, FaRegHandshake, FaCheckCircle, FaPaperPlane, FaTimesCircle } from 'react-icons/fa';
import applicationsApi from '../../api/Applications.api';

const JobApplyBox = ({ job }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const checkApplication = async () => {
      if (!user || !job.id) return;
      
      try {
        const response = await applicationsApi.checkJobApplication(job.id);
        if (response.data && response.data.exists) {
          setHasApplied(true);
          setApplicationStatus(response.data.status);
        }
      } catch (error) {
        console.error('Error al verificar aplicación:', error);
      }
    };

    checkApplication();
  }, [user, job.id]);

  const handleInitialApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowCoverLetter(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (coverLetter.trim().length < 50) {
      setError('La carta de presentación debe tener al menos 50 caracteres');
      return;
    }

    setIsApplying(true);
    setError('');

    try {
      const applicationData = {
        cover_letter: coverLetter
      };

      await applicationsApi.applyToJob(job.id, applicationData);
      
      setIsSuccess(true);
      setHasApplied(true);
      setApplicationStatus('Pendiente');
      
      setShowCoverLetter(false);
      setCoverLetter('');
      
    } catch (error) {
      console.error('Error al aplicar:', error);
      if (error.response) {
        const errorMessage = error.response.data.detail || 
                           error.response.data.message || 
                           'Error al enviar la aplicación. Por favor verifica los datos.';
        setError(errorMessage);
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Por favor intenta de nuevo.');
      } else {
        setError('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const renderApplicationStatus = () => {
    switch (applicationStatus) {
      case 'Pendiente':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="text-center py-8 space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Aplicación en proceso</h3>
              <p className="text-gray-600">
                Tu aplicación está siendo revisada por la empresa. Te notificaremos cuando haya una actualización.
              </p>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  Estado: Esperando respuesta de la empresa
                </p>
              </div>
            </div>
          </div>
        );
      case 'Aceptada':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="text-center py-8 space-y-4">
              <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
              <h3 className="text-xl font-bold text-gray-800">¡Felicitaciones! Has sido contratado</h3>
              <p className="text-gray-600">
                La empresa ha aceptado tu aplicación y te ha seleccionado para el puesto.
              </p>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Próximos pasos:</h4>
                <ul className="text-green-700 text-left list-disc list-inside space-y-2">
                  <li>La empresa se pondrá en contacto contigo pronto</li>
                  <li>Prepárate para comenzar tu nueva etapa laboral</li>
                </ul>
              </div>
              <div className="mt-6">
                <Link 
                  to="/my-jobs" 
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Ir a mi trabajo
                </Link>
              </div>
            </div>
          </div>
        );
      case 'Rechazada':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="text-center py-8 space-y-4">
              <FaTimesCircle className="text-red-500 text-6xl mx-auto" />
              <h3 className="text-xl font-bold text-gray-800">Aplicación no seleccionada</h3>
              <p className="text-gray-600">
                Gracias por tu interés. En esta ocasión la empresa ha decidido continuar con otros candidatos.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (hasApplied || applicationStatus) {
    return renderApplicationStatus();
  }

  if (isSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
        <div className="text-center py-8 space-y-4">
          <FaCheckCircle className="text-purple-500 text-6xl mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-gray-800">¡Aplicación enviada con éxito!</h3>
          <p className="text-gray-600">
            Tu aplicación ha sido recibida. La empresa revisará tu información pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
      <div className="border-b pb-4 mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Detalles del puesto</h3>
        <div className="flex items-center justify-between text-gray-600">
          <span className="font-medium">Salario:</span>
          <span className="text-purple-600 font-bold">${job.salary}/año</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <FaUserTie className="text-purple-600 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-700">Posición</h4>
            <p className="text-gray-600">{job.position}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <FaGraduationCap className="text-purple-600 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-700">Educación requerida</h4>
            <p className="text-gray-600">{job.education_level}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <FaTools className="text-purple-600 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-700">Habilidades técnicas</h4>
            <p className="text-gray-600">{job.technical_skills}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <FaRegHandshake className="text-purple-600 mt-1" />
          <div>
            <h4 className="font-semibold text-gray-700">Habilidades blandas</h4>
            <p className="text-gray-600">{job.soft_skills}</p>
          </div>
        </div>
      </div>

      {showCoverLetter ? (
        <form onSubmit={handleSubmitApplication} className="space-y-4">
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
              Carta de presentación
            </label>
            <textarea
              id="coverLetter"
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="Cuéntanos por qué eres el candidato ideal para este puesto..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={isApplying}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <p className="mt-2 text-sm text-gray-500">
              Caracteres: {coverLetter.length} (mínimo 50)
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isApplying}
              className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
            >
              {isApplying ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                <>
                  <FaPaperPlane className="mr-2" /> Enviar aplicación
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowCoverLetter(false)}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <button
            onClick={handleInitialApply}
            disabled={!job.availability}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 
              ${job.availability 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {job.availability ? 'Aplicar al trabajo' : 'No disponible'}
          </button>

          {!user && (
            <p className="text-sm text-gray-500 text-center mt-4">
              Necesitas iniciar sesión para aplicar a este trabajo
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default JobApplyBox;

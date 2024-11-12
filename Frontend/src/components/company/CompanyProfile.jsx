import React, { useState, useEffect } from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLanguage, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { updateCompanyProfile } from '../../api/Auth.api';
import { useAuth } from '../../context/AuthContext';

const CompanyProfile = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const { user, updateUser } = useAuth();
  const [error, setError] = useState(null);

  const isProfileOwner = user && user.id === profile.id;

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleSubmit = async () => {
    if (!isProfileOwner) {
      setError('No tienes permiso para editar este perfil.');
      return;
    }

    try {
      const formData = new FormData();
      
      const editableFields = [
        'name', 
        'phone', 
        'company_location', 
        'company_language', 
        'information', 
        'interests'
      ];

      editableFields.forEach(field => {
        if (editedProfile[field] !== undefined) {
          formData.append(field, editedProfile[field] || '');
        }
      });

      console.log('Enviando datos de compañía:', Object.fromEntries(formData));
      
      const updatedUser = await updateCompanyProfile(formData);
      console.log('Respuesta del servidor:', updatedUser);
      
      updateUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al actualizar el perfil: ' + (err.response?.data?.message || err.message));
    }
  };

  const renderEditableField = (name, label, icon, value) => (
    <div className="flex items-center mb-4 bg-white rounded-lg p-3 shadow-sm">
      {icon}
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full text-lg font-semibold text-gray-700 border-b border-green-200 focus:outline-none focus:border-green-500"
        />
      </div>
    </div>
  );

  const renderField = (icon, label, value) => (
    <div className="flex items-center mb-4 bg-white rounded-lg p-3 shadow-sm">
      {icon}
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-700">{value || 'No especificado'}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-green-800">Perfil de Empresa</h2>
        <div className="flex gap-2">
          {isProfileOwner && (
            <Link to="/company-home">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                Volver al Inicio
              </button>
            </Link>
          )}
          {isProfileOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Editar Perfil
            </button>
          )}
          {isProfileOwner && isEditing && (
            <>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedProfile(profile);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isEditing && isProfileOwner ? (
          <>
            {renderEditableField("name", "Nombre de la Empresa", <FaBuilding className="text-green-500 text-xl" />, editedProfile.name)}
            {renderEditableField("phone", "Teléfono", <FaPhone className="text-green-500 text-xl" />, editedProfile.phone)}
            {renderEditableField("company_location", "Ubicación", <FaMapMarkerAlt className="text-green-500 text-xl" />, editedProfile.company_location)}
            {renderEditableField("company_language", "Idioma", <FaLanguage className="text-green-500 text-xl" />, editedProfile.company_language)}
            {renderEditableField("information", "Información", <FaInfoCircle className="text-green-500 text-xl" />, editedProfile.information)}
            {renderEditableField("interests", "Intereses", <FaInfoCircle className="text-green-500 text-xl" />, editedProfile.interests)}
          </>
        ) : (
          <>
            {renderField(<FaBuilding className="text-green-500 text-xl" />, "Nombre de la Empresa", profile.name)}
            {renderField(<FaEnvelope className="text-green-500 text-xl" />, "Email", profile.email)}
            {renderField(<FaPhone className="text-green-500 text-xl" />, "Teléfono", profile.phone)}
            {renderField(<FaMapMarkerAlt className="text-green-500 text-xl" />, "Ubicación", profile.company_location)}
            {renderField(<FaLanguage className="text-green-500 text-xl" />, "Idioma", profile.company_language)}
            {renderField(<FaInfoCircle className="text-green-500 text-xl" />, "Información", profile.information)}
            {renderField(<FaInfoCircle className="text-green-500 text-xl" />, "Intereses", profile.interests)}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;

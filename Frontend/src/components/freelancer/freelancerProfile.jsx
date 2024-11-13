import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaLanguage, FaStar, FaLink, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { updateProfile } from '../../api/Auth.api';
import { useAuth } from '../../context/AuthContext';

const FreelancerProfile = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [avatarFile, setAvatarFile] = useState(null);
  const { updateUser, user } = useAuth(); // Añadido para acceder al usuario autenticado
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar si el perfil es del usuario autenticado
    if (profile.id !== user.id) {
      setIsEditing(false);
    }
  }, [profile.id, user.id]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setAvatarFile(files[0]);
      setEditedProfile(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      
      // Agregar todos los campos excepto el avatar
      Object.keys(editedProfile).forEach(key => {
        if (key !== 'freelancer_avatar' && key !== 'email') {
          formData.append(key, editedProfile[key]);
        }
      });

      // Agregar el avatar solo si hay un nuevo archivo
      if (avatarFile) {
        formData.append('freelancer_avatar', avatarFile);
      }

      const updatedUser = await updateProfile(formData);
      updateUser(updatedUser);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Error al actualizar el perfil: ' + (err.response?.data?.message || err.message));
      console.error(err);
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
          className="w-full text-lg font-semibold text-gray-700 border-b border-purple-200 focus:outline-none focus:border-purple-500"
        />
      </div>
    </div>
  );

  const renderField = (icon, label, value) => (
    <div className="flex items-center mb-4 bg-white rounded-lg p-3 shadow-sm">
      {icon}
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );

  const renderAvatarField = () => (
    <div className="flex items-center mb-4 bg-white rounded-lg p-3 shadow-sm">
      <FaUser className="text-purple-500 text-xl" />
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium text-gray-500">Foto de Perfil</p>
        <input
          type="file"
          name="freelancer_avatar"
          onChange={handleInputChange}
          accept="image/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-800">Perfil de Freelancer</h2>
        <div className="flex gap-2">
          <Link to="/home">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Volver al Inicio
            </button>
          </Link>
          {user.id === profile.id && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Editar Perfil
            </button>
          )}
          {isEditing && (
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
        {isEditing ? (
          <>
            {renderAvatarField()}
            {renderEditableField("name", "Nombre", <FaUser className="text-purple-500 text-xl" />, editedProfile.name)}
            {renderEditableField("lastname", "Apellido", <FaUser className="text-purple-500 text-xl" />, editedProfile.lastname)}
            {renderEditableField("phone", "Teléfono", <FaPhone className="text-purple-500 text-xl" />, editedProfile.phone)}
            {renderEditableField("location", "Ubicación", <FaMapMarkerAlt className="text-purple-500 text-xl" />, editedProfile.location)}
            {renderEditableField("language", "Idioma", <FaLanguage className="text-purple-500 text-xl" />, editedProfile.language)}
            {renderEditableField("skills", "Habilidades", <FaStar className="text-purple-500 text-xl" />, editedProfile.skills)}
            {renderEditableField("experience", "Experiencia", <FaBriefcase className="text-purple-500 text-xl" />, editedProfile.experience)}
            {renderEditableField("education", "Educación", <FaGraduationCap className="text-purple-500 text-xl" />, editedProfile.education)}
            {renderEditableField("portfolio_link", "Portafolio", <FaLink className="text-purple-500 text-xl" />, editedProfile.portfolio_link)}
            {renderEditableField("linkedin_profile", "LinkedIn", <FaLinkedin className="text-purple-500 text-xl" />, editedProfile.linkedin_profile)}
            {renderEditableField("github_profile", "GitHub", <FaGithub className="text-purple-500 text-xl" />, editedProfile.github_profile)}
          </>
        ) : (
          <>
            {renderField(<FaUser className="text-purple-500 text-xl" />, "Nombre", profile.name)}
            {renderField(<FaUser className="text-purple-500 text-xl" />, "Apellido", profile.lastname)}
            {renderField(<FaEnvelope className="text-purple-500 text-xl" />, "Email", profile.email)}
            {renderField(<FaPhone className="text-purple-500 text-xl" />, "Teléfono", profile.phone)}
            {renderField(<FaMapMarkerAlt className="text-purple-500 text-xl" />, "Ubicación", profile.location)}
            {renderField(<FaLanguage className="text-purple-500 text-xl" />, "Idioma", profile.language)}
            {renderField(<FaStar className="text-purple-500 text-xl" />, "Habilidades", profile.skills)}
            {renderField(<FaBriefcase className="text-purple-500 text-xl" />, "Experiencia", profile.experience)}
            {renderField(<FaGraduationCap className="text-purple-500 text-xl" />, "Educación", profile.education)}
            {renderField(<FaLink className="text-purple-500 text-xl" />, "Portafolio", profile.portfolio_link)}
            {renderField(<FaLinkedin className="text-purple-500 text-xl" />, "LinkedIn", profile.linkedin_profile)}
            {renderField(<FaGithub className="text-purple-500 text-xl" />, "GitHub", profile.github_profile)}
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;

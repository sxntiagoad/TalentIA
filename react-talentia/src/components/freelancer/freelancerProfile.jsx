import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaLanguage, FaStar, FaMoneyBillWave, FaCalendarAlt, FaLink, FaLinkedin, FaGithub } from 'react-icons/fa';

const FreelancerProfile = ({ profile }) => {
  const renderField = (icon, label, value) => (
    <div className="flex items-center mb-4 bg-white rounded-lg p-3 shadow-sm">
      {icon}
      <div className="ml-3 flex-grow">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">Perfil de Freelancer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField(<FaUser className="text-purple-500 text-xl" />, "Nombre", profile.name)}
        {renderField(<FaUser className="text-purple-500 text-xl" />, "Apellido", profile.lastname)}
        {renderField(<FaEnvelope className="text-purple-500 text-xl" />, "Email", profile.email)}
        {renderField(<FaPhone className="text-purple-500 text-xl" />, "Teléfono", profile.phone)}
        {renderField(<FaMapMarkerAlt className="text-purple-500 text-xl" />, "Ubicación", profile.location)}
        {renderField(<FaLanguage className="text-purple-500 text-xl" />, "Idioma", profile.language)}
        {renderField(<FaStar className="text-purple-500 text-xl" />, "Habilidades", profile.skills)}
        {renderField(<FaBriefcase className="text-purple-500 text-xl" />, "Experiencia", profile.experience)}
        {renderField(<FaGraduationCap className="text-purple-500 text-xl" />, "Educación", profile.education)}
        {renderField(<FaMoneyBillWave className="text-purple-500 text-xl" />, "Tarifa por hora", profile.hourly_rate)}
        {renderField(<FaCalendarAlt className="text-purple-500 text-xl" />, "Disponibilidad", profile.availability)}
        {renderField(<FaLink className="text-purple-500 text-xl" />, "Portafolio", profile.portfolio_link)}
        {renderField(<FaLinkedin className="text-purple-500 text-xl" />, "LinkedIn", profile.linkedin_profile)}
        {renderField(<FaGithub className="text-purple-500 text-xl" />, "GitHub", profile.github_profile)}
      </div>
    </div>
  );
};

export default FreelancerProfile;

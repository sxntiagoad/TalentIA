import React from 'react';
import { FaBuilding, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLanguage, FaInfoCircle, FaImage } from 'react-icons/fa';

const CompanyProfile = ({ profile }) => {
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Perfil de Empresa</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderField(<FaBuilding className="text-green-500 text-xl" />, "Nombre de la Empresa", profile.name)}
        {renderField(<FaEnvelope className="text-green-500 text-xl" />, "Email", profile.email)}
        {renderField(<FaPhone className="text-green-500 text-xl" />, "Teléfono", profile.phone)}
        {renderField(<FaMapMarkerAlt className="text-green-500 text-xl" />, "Ubicación", profile.company_location)}
        {renderField(<FaLanguage className="text-green-500 text-xl" />, "Idioma", profile.company_language)}
        {renderField(<FaInfoCircle className="text-green-500 text-xl" />, "Información", profile.information)}
        {renderField(<FaImage className="text-green-500 text-xl" />, "Avatar", profile.company_avatar ? "Cargado" : "No cargado")}
        {renderField(<FaInfoCircle className="text-green-500 text-xl" />, "Intereses", profile.interests)}
      </div>
    </div>
  );
};

export default CompanyProfile;

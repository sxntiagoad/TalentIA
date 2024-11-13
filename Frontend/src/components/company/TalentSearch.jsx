import React, { useState } from 'react';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBriefcase, FaUser, FaTools, FaGraduationCap, FaLanguage } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { searchFreelancers } from '../../api/Search.api';
import defaultAvatar from '../../assets/default-avatar.png';
import { useNavigate } from 'react-router-dom';

const TalentSearch = () => {
  const [searchFields, setSearchFields] = useState({
    name: { active: false, value: '' },
    skills: { active: false, value: '' },
    location: { active: false, value: '' },
    experience: { active: false, value: '' },
    education: { active: false, value: '' },
    language: { active: false, value: 'es' }
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const searchOptions = [
    { key: 'name', label: 'Nombre', icon: FaUser, placeholder: 'Ej: Juan Pérez' },
    { key: 'skills', label: 'Habilidades', icon: FaTools, placeholder: 'Ej: Python, React, Django' },
    { key: 'location', label: 'Ubicación', icon: FaMapMarkerAlt, placeholder: 'Ej: Madrid, España' },
    { key: 'experience', label: 'Experiencia', icon: FaBriefcase, placeholder: 'Ej: Desarrollo web, 3 años' },
    { key: 'education', label: 'Educación', icon: FaGraduationCap, placeholder: 'Ej: Ingeniería Informática' },
    { key: 'language', label: 'Idioma', icon: FaLanguage, placeholder: 'Ej: Español, English' }
  ];

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' }
  ];

  const handleToggleField = (field) => {
    setSearchFields(prev => ({
      ...prev,
      [field]: { ...prev[field], active: !prev[field].active }
    }));
  };

  const handleFieldChange = (field, value) => {
    setSearchFields(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchData = {};
      Object.entries(searchFields).forEach(([key, field]) => {
        if (field.active && field.value.trim()) {
          searchData[key] = field.value.trim();
        }
      });
      const response = await searchFreelancers(searchData);
      setResults(response.data.freelancers || []);
    } catch (error) {
      console.error('Error al buscar freelancers:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleViewProfile = (freelancerId) => {
    navigate(`/profile/freelancer/${freelancerId}`);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
    if (showFilters) {
      setResults(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Encuentra el Talento Perfecto
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Busca entre miles de profesionales calificados para tu próximo proyecto
        </p>
      </div>

      {/* Search Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleToggleFilters}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <FaFilter className="w-4 h-4" />
            <span>{showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 rounded-lg p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchOptions.map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key} className="space-y-3">
                  <label className="flex items-center space-x-3 text-gray-700 font-medium">
                    <input
                      type="checkbox"
                      checked={searchFields[key].active}
                      onChange={() => handleToggleField(key)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <Icon className="w-5 h-5 text-gray-500" />
                    <span>{label}</span>
                  </label>
                  
                  {searchFields[key].active && key !== 'language' && (
                    <input
                      type="text"
                      value={searchFields[key].value}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={placeholder}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                    />
                  )}
                  
                  {searchFields[key].active && key === 'language' && (
                    <select
                      value={searchFields.language.value}
                      onChange={(e) => handleFieldChange('language', e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {languages.map((language) => (
                        <option key={language.code} value={language.code}>
                          {language.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search Button */}
        {showFilters && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleSearch}
              disabled={!Object.values(searchFields).some(field => field.active && field.value.trim())}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <FaSearch className="w-5 h-5 mr-2" />
              Buscar Talento
            </button>
          </div>
        )}
      </div>

      {/* Results Section */}
      {showFilters && loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        showFilters && results && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            {results.map((freelancer) => (
              <motion.div
                key={freelancer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={freelancer.freelancer_avatar ? `http://35.224.34.63:8000/${freelancer.freelancer_avatar}` : defaultAvatar}
                      alt={`${freelancer.name} ${freelancer.lastname}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {`${freelancer.name} ${freelancer.lastname}`}
                      </h3>
                      <p className="text-gray-600 flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                        {freelancer.location}
                      </p>
                    </div>
                  </div>

                  {searchFields.skills.active && freelancer.skills && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Habilidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.split(',').map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchFields.experience.active && freelancer.experience && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Experiencia</h4>
                      <p className="text-gray-600 text-sm">{freelancer.experience}</p>
                    </div>
                  )}

                  {searchFields.education.active && freelancer.education && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Educación</h4>
                      <p className="text-gray-600 text-sm">{freelancer.education}</p>
                    </div>
                  )}

                  {searchFields.language.active && freelancer.language && (
                    <div className="mt-4">
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold text-gray-700">Idioma: </span>
                        {languages.find(lang => lang.code === freelancer.language)?.name || freelancer.language}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleViewProfile(freelancer.id)}
                      className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-lg text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      Ver perfil completo
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {results.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="text-gray-500 text-lg">
                  No se encontraron freelancers que coincidan con tu búsqueda
                </div>
                <p className="text-gray-400 mt-2">
                  Intenta ajustar tus filtros de búsqueda
                </p>
              </div>
            )}
          </motion.div>
        )
      )}
    </div>
  );
};

export default TalentSearch;
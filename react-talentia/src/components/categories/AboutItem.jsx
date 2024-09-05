import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCommentAlt, FaHome, FaChevronRight } from "react-icons/fa";

export function AboutItem({ item, isService }) {
  if (!item) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Ruta de navegación */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-purple-600 transition-colors duration-200">
          <FaHome className="inline-block mr-1" />
          <span className="hidden sm:inline">Inicio</span>
        </Link>
        {[
          isService ? item.service_category : item.job_category,
          isService ? item.service_subcategory : item.job_subcategory,
          isService ? item.service_nestedcategory : item.job_nestedcategory
        ].map((category, index) => (
          <React.Fragment key={index}>
            <FaChevronRight className="text-gray-400" />
            <Link to={`/${['category', 'subcategory', 'nestedcategory'][index]}/${category}`} className="hover:text-purple-600 transition-colors duration-200">
              {category}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Título y descripción */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {isService ? item.service_title : item.job_title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          {isService ? item.service_description : item.job_description}
        </p>
      </div>

      {/* Información del usuario o empresa */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
        <img
          src={isService ? item.user_avatar : item.company_avatar}
          alt={`Avatar de ${isService ? item.user_name : item.company_name}`}
          className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
        />
        <div>
          <Link to={`/user/${item.user_id}`} className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200">
            {isService ? item.user_name : item.company_name} {item.user_lastname && ` ${item.user_lastname}`}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mt-2 text-sm text-gray-600">
            <div className="flex items-center mt-2 sm:mt-0">
              <FaMapMarkerAlt className="mr-2 text-purple-500" />
              {isService ? item.user_location : item.company_location}
            </div>
            <div className="flex items-center mt-2 sm:mt-0">
              <FaCommentAlt className="mr-2 text-purple-500" />
              {isService ? item.user_language : item.company_language}
            </div>
          </div>
        </div>
      </div>

      {/* Imagen del servicio o trabajo */}
      {item.service_image && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={item.service_image}
            alt={`Imagen de ${isService ? item.service_title : item.job_title}`}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
    </div>
  );
}

export default AboutItem;
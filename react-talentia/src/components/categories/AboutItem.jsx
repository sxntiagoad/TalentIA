import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCommentAlt, FaHome } from "react-icons/fa"; // Importamos los iconos de react-icons

export function AboutItem({ item, isService }) {
  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Ruta de navegación: Categoría, Subcategoría, Categoría Anidada */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        {/* Inicio */}
        <Link to="/" className="hover:underline">
          <FaHome />
        </Link>
        {/* Categoría */}
        <Link to={`/category/${isService ? item.service_category : item.job_category}`} className="hover:underline">
          <span>{isService ? item.service_category : item.job_category}</span>
        </Link>
        <span>/</span>
        {/* Subcategoría */}
        <Link to={`/subcategory/${isService ? item.service_subcategory : item.job_subcategory}`} className="hover:underline">
          <span>{isService ? item.service_subcategory : item.job_subcategory}</span>
        </Link>
        <span>/</span>
        {/* Categoría Anidada */}
        <Link to={`/nestedcategory/${isService ? item.service_nestedcategory : item.job_nestedcategory}`} className="hover:underline">
          <span>{isService ? item.service_nestedcategory : item.job_nestedcategory}</span>
        </Link>
      </div>

      {/* Título del servicio o trabajo */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        {isService ? item.service_title : item.job_title}
      </h2>
      
      {/* Descripción */}
      <p className="text-gray-600 text-lg mb-4">
        {isService ? item.service_description : item.job_description}
      </p>

      {/* Información del usuario o empresa */}
      <div className="flex items-center space-x-6 mt-6">
        {/* Imagen de avatar */}
        <img
          src={isService ? item.user_avatar : item.company_avatar} // Mostrar avatar del usuario o de la empresa
          alt={`Avatar de ${isService ? item.user_name : item.company_name}`} // Texto alternativo condicional
          className="w-24 h-24 object-cover rounded-full border border-gray-300"
        />
        <div>
          {/* Nombre del usuario o empresa */}
          <Link to={`/user/${item.user_id}`} className="text-lg font-bold text-gray-800 hover:underline">
            {isService ? item.user_name : item.company_name} {item.user_lastname && ` ${item.user_lastname}`}
          </Link>
          {/* Ubicación y lenguaje */}
          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {isService ? item.user_location : item.company_location}
            </div>
            <div className="flex items-center">
              <FaCommentAlt className="mr-1" />
              {isService ? item.user_language : item.company_language}
            </div>
          </div>
        </div>
      </div>

      {/* Imagen del servicio o trabajo */}
      {item.service_image && (
        <img
          src={item.service_image} // Imagen del servicio
          alt={`Imagen de ${isService ? item.service_title : item.job_title}`}
          className="w-[400px] h-[500px]"
        />
      )}
    </div>
  );
}

export default AboutItem;
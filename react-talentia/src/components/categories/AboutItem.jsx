import React from "react";
import { FaMapMarkerAlt, FaCommentAlt, FaHome } from "react-icons/fa"; // Importamos los iconos de react-icons

export function AboutItem({ item, isService }) {
  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Categoria, subcategoria, dentro de subcategoria*/}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <a href="/" className="hover:underline">
          <FaHome />
        </a>
        <a href="/category" className="hover:underline">
          <span>{isService ? item.service_category : item.job_category}</span>
        </a>
        <span>/</span>
        <a href="/subcategory" className="hover:underline">
          <span>{isService ? item.service_subcategory : item.job_subcategory}</span>
        </a>
        <span>/</span>
        <a href="/nestedcategory" className="hover:underline">
          <span>{isService ? item.service_nestedcategory : item.job_nestedcategory}</span>
        </a>
      </div>

      {/* Título y descripción */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        {isService ? item.service_title : item.job_title}
      </h2>
      <p className="text-gray-600 text-lg mb-4">
        {isService ? item.service_description : item.job_description}
      </p>

      {/* Información del usuario/empresa */}
      <div className="flex items-center space-x-6 mt-6">
        <img
          src={isService ? item.user_avatar : item.company_avatar} // Avatar condicional
          alt={`Avatar de ${isService ? item.user_name : item.company_name}`} // Alt condicional
          className="w-24 h-24 object-cover rounded-full border border-gray-300"
        />
        <div>
          {/* Nombre y enlace del usuario/empresa */}
          <a href={`/user/${item.user_id}`} className="text-lg font-bold text-gray-800 hover:underline">
            {isService ? item.user_name : item.company_name} {item.user_lastname && ` ${item.user_lastname}`}
          </a>
          <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
            {/* Ubicación y lenguaje */}
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

      {/* Imágenes */}
      {item.service_image && (
      <img
        src={item.image}
        className="w-[270x] h-[350px] "
      />
    )}
    </div>
  );
}

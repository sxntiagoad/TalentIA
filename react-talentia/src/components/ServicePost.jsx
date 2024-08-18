import React from "react";
import { useNavigate } from "react-router-dom";

export function ServicePost({ service }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-5 mx-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
      onClick={() => navigate(`/services/${service.id}`)}
    >
      {/* Header Image */}
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      )}

      {/* Content */}
      <div className="p-2">
        <h2 className="text-sm font-bold text-gray-800 mb-1">{service.title}</h2>
        <div className="flex items-center space-x-1 mb-1">
          <span className="text-gray-600 text-xs">Anuncio de {service.user_name}</span>
        </div>
        <p className="text-gray-500 text-xs mb-1 truncate">{service.description}</p>

        <div className="text-sm font-bold text-gray-800 mt-1">
          A partir de COP {service.price}
        </div>
      </div>
    </div>
  );
}

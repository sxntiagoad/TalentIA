import React from "react";
import { useNavigate } from "react-router-dom";


export function ServicePost({ service }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg max-w-sm mt-5 mx-auto hover:bg-gray-20 transition-colors duration-300 cursor-pointer"
      onClick={() => navigate(`/services/${service.id}`)}
    >
      {/* Header Image */}
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-1">{service.title}</h2>
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-gray-600 text-sm">Anuncio de {service.user_name}</span>
        </div>
        <p className="text-gray-500 mb-4">{service.description}</p>

        <div className="text-lg font-bold text-gray-800 mt-4">
          A partir de COP {service.price}
        </div>
      </div>
    </div>
  );
}

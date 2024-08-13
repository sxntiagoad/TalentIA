import React from "react";

export function ServicePost({ service }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto">
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
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-gray-600 text-sm">Anuncio de {service.user}</span>
        </div>
        <p className="text-gray-500 mb-4">{service.description}</p>

        <div className="text-lg font-bold text-gray-800 mt-4">
          A partir de COP {service.price}
        </div>
      </div>
    </div>
  );
}
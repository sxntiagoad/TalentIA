import React from "react";
import { useNavigate } from "react-router-dom";
export function PostItem({ item, isService }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-lg max-w-xs mt-5 mx-2 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
      onClick={() => navigate(`/${isService ? 'services' : 'jobs'}/${item.id}`)}
    >
      {/* Header Image */}
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
      )}

      {/* Content */}
      <div className="p-2">
        <h2 className="text-sm font-bold text-gray-800 mb-1">{item.title}</h2>
        <div className="flex items-center space-x-1 mb-1">
          <span className="text-gray-600 text-xs">
            {isService ? `Anuncio de ${item.user_name}` : `Publicado por ${item.company_name}`}
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-1 truncate">{item.description}</p>

        <div className="text-sm font-bold text-gray-800 mt-1">
          {isService ? `A partir de COP ${item.price}` : `Salario: COP ${item.salary}`}
        </div>
      </div>
    </div>
  );
}
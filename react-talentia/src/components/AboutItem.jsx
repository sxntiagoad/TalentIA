import React from "react";


export function AboutItem({ item, isService }) {
  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      {/* Description */}
      <h2 className="text-2xl font-bold text-gray-700 mb-2">
        {isService ? item.service_title : item.job_title}
      </h2>
      <p className="text-gray-700 mb-4">
        {isService ? item.service_description : item.job_description}
      </p>

      {/* About User */}
      <div className="flex items-center space-x-4 mt-6">
        <img
          src={item.user_avatar}
          alt={`Avatar de ${item.user_name}`}
          className="w-16 h-16 object-cover rounded-full"
        />
        <div>
          {/* User's Full Name as a link */}
          <a href={`/user/${item.user_id}`} className="flex items-center space-x-1">
            <p className="text-gray-900 font-bold text-lg">{item.user_name}</p>
            <p className="text-gray-900 font-bold text-lg">{item.user_lastname}</p>
          </a>
          <p className="text-gray-500 text-sm">{item.user_role}</p>
          <p className="text-gray-400 text-xs">{item.user_location}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6">
        <p className="text-gray-700 mb-2">
          <strong>Categoría:</strong> {item.category}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Subcategoría:</strong> {item.subcategory}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Ubicación:</strong> {item.service_location}
        </p>
      </div>
    </div>
  );
}

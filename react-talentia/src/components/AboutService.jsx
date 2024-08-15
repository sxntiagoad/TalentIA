import React from "react";

export function AboutService({ service }) {
  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-8">
      {/* Service Image */}
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* Service Details */}
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {service.title}
      </h2>
      <p className="text-gray-600 text-sm mb-4">Posted by {service.user_name}</p>
      <p className="text-gray-700 text-base mb-4">{service.description}</p>
      <p className="text-xl font-bold text-gray-800">
        Price: COP {service.price}
      </p>

      {/* Other details */}
      <div className="mt-6">
        {/* Add more details as required */}
        <p className="text-gray-700 mb-2">
          <strong>Category:</strong> {service.category}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Location:</strong> {service.location}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Contact:</strong> {service.contact}
        </p>
      </div>
    </div>
  );
}

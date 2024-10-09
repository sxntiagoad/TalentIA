import React from "react";
import ServicePostingProcess from "../../components/freelancer/ServicePostingProcess";

const ServiceForm = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">Publicar un Nuevo Servicio</h1>
      <ServicePostingProcess />
    </div>
  );
};

export default ServiceForm;

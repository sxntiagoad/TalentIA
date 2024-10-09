import React from "react";
import JobPostingProcess from "../../components/company/JobPostingProcess";

const JobForm = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">Publicar un Nuevo Trabajo</h1>
      <JobPostingProcess />
    </div>
  );
};

export default JobForm;

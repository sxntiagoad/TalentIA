import React from 'react';
import { useForm } from "react-hook-form";
import logo from "../../assets/logo.png";

export function UserForm({ onSubmit, userType }) {
const { register, handleSubmit, formState: { errors } } = useForm();

const handleFormSubmit = (data) => {
onSubmit({ ...data, userType });
};

const isCompany = userType === "company";
const primaryColor = isCompany ? 'green' : 'purple';
const textColor = isCompany ? 'text-green-100' : 'text-purple-100';
const buttonColor = isCompany ? 'bg-green-700 hover:bg-green-600' : 'bg-purple-700 hover:bg-purple-600';
const linkColor = isCompany ? 'text-green-300' : 'text-purple-300';

return (
<div>
    <div className="flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-20 h-20" />
    </div>
    
    <h4 className={`text-2xl font-semibold ${textColor} mb-4 text-center`}>
      Registrarse como {isCompany ? "Compañía" : "Freelancer"}
    </h4>
    <p className={`text-base ${textColor} mb-3`}>
    Bienvenido al registro de {isCompany ? "Compañía" : "Freelancer"} de TalentIA!
    </p>
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
    {isCompany ? (
      <div>
        <div className="relative h-11 w-full">
          <input
            type="text"
            placeholder="Nombre empresa"
            {...register("name", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.name ? 'border-red-500' : `border-${primaryColor}-300`} bg-transparent px-3 py-3 ${textColor} outline-none transition-all focus:border-1 focus:border-${primaryColor}-500`}
          />
          <div className="h-5">
            {errors.name && <span className="text-red-500 text-sm">Obligatorio</span>}
          </div>
        </div>
      </div>
    ) : (
      <>
        <div>
          <div className="relative h-11 w-full">
            <input
              type="text"
              placeholder="Nombre"
              {...register("name", { required: true })}
              className={`peer h-full w-full rounded-md border ${errors.name ? 'border-red-500' : `border-${primaryColor}-300`} bg-transparent px-3 py-3 ${textColor} outline-none transition-all focus:border-1 focus:border-${primaryColor}-500`}
            />
            <div className="h-5">
              {errors.name && <span className="text-red-500 text-sm">Obligatorio</span>}
            </div>
          </div>
        </div>
        <div>
          <div className="relative h-11 w-full">
            <input
              type="text"
              placeholder="Apellido"
              {...register("lastname", { required: true })}
              className={`peer h-full w-full rounded-md border ${errors.lastname ? 'border-red-500' : `border-${primaryColor}-300`} bg-transparent px-3 py-3 ${textColor} outline-none transition-all focus:border-1 focus:border-${primaryColor}-500`}
            />
            <div className="h-5">
              {errors.lastname && <span className="text-red-500 text-sm">Obligatorio</span>}
            </div>
          </div>
        </div>
      </>
    )}

    <div>
        <div className="relative h-11 w-full">
        <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.email ? 'border-red-500' : `border-${primaryColor}-300`} bg-transparent px-3 py-3 ${textColor} outline-none transition-all focus:border-1 focus:border-${primaryColor}-500`}
        />
        <div className="h-5">
        {errors.email && <span className="text-red-500 text-sm">Ingrese una dirección de correo electrónico válida</span>}
            </div>
        </div>
    </div>

    <div>
        <div className="relative h-11 w-full">
        <input
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.password ? 'border-red-500' : `border-${primaryColor}-300`} bg-transparent px-3 py-3 ${textColor} outline-none transition-all focus:border-1 focus:border-${primaryColor}-500`}
        />
        <div className="h-5">
        {errors.password && <span className="text-red-500 text-sm">Introduzca una contraseña</span>}
            </div>
        </div>
    </div>

    <button
        type="submit"
        className={`block w-full ${buttonColor} ${textColor} font-bold py-3 rounded-lg transition-all`}
    >
        Únete a TalentIA
    </button>
    </form>
    <p className={`text-sm text-center ${textColor} mt-4`}>
    ¿Ya tienes una cuenta? <a href="/login" className={linkColor}>Inicia sesión</a>
    </p>
</div>
);
}

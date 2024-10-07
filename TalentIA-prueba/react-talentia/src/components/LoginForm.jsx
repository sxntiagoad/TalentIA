import React from 'react';
import { useForm } from "react-hook-form";
import logo from "../assets/logo.png";

export function LoginForm({ onSubmit, error, userType }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const isCompany = userType === 'company';
  const primaryColor = isCompany ? 'green' : 'purple';
  const textColor = isCompany ? 'text-green-100' : 'text-purple-100';
  const buttonColor = isCompany ? 'bg-green-700 hover:bg-green-600' : 'bg-purple-700 hover:bg-purple-600';
  const linkColor = isCompany ? 'text-green-300' : 'text-purple-300';
  const complementaryColor = isCompany ? 'text-red-700' : 'text-yellow-300';

  const title = isCompany ? 'Iniciar sesión como Compañía' : 'Iniciar sesión como Freelancer';
  const welcomeMessage = isCompany 
    ? '¡Bienvenido de vuelta a TalentIA, empresa!' 
    : '¡Bienvenido de vuelta a TalentIA, freelancer!';

  return (
    <div>
      <div className="flex items-center justify-center mb-6">
        <img src={logo} alt="Logo" className="w-20 h-20" />
      </div>
      
      <h4 className={`text-2xl font-semibold ${textColor} mb-4 text-center`}>
        {title}
      </h4>
      <p className={`text-base ${textColor} mb-6 text-center`}>
        {welcomeMessage}
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <div className="relative h-11 w-full">
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", { required: true })}
              className={`peer h-full w-full rounded-md border ${errors.email ? 'border-red-500' : `border-${primaryColor}-300`} bg-transparent px-3 py-3 ${textColor} outline-none transition-all focus:border-1 focus:border-${primaryColor}-500`}
            />
            <div className="h-5">
              {errors.email && <span className="text-red-500 text-sm">Correo electrónico es requerido</span>}
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
              {errors.password && <span className="text-red-500 text-sm">Contraseña es requerida</span>}
            </div>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className={`block w-full ${buttonColor} ${textColor} font-bold py-3 rounded-lg transition-all`}
        >
          Iniciar sesión
        </button>
      </form>
      <p className={`text-sm text-center ${textColor} mt-4`}>
        ¿No tienes una cuenta? <a href={`/register?type=${userType}`} className={linkColor}>Regístrate</a>
      </p>
    </div>
  );
}
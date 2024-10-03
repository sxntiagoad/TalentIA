import React from 'react';
import { useForm } from "react-hook-form";
import logo from "../assets/logo.png";

export function UserForm({ onSubmit, userType }) {
const { register, handleSubmit, formState: { errors } } = useForm();

const handleFormSubmit = (data) => {
onSubmit({ ...data, userType });
};

return (
<div>

    <div className="flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-20 h-20" />
    </div>
    
    <h4 className="text-2xl font-semibold text-blue-gray-900 mb-4 text-center">
      Registrarse como {userType === "company" ? "Compañía" : "Freelancer"}
    </h4>
    <p className="text-base text-white mb-3">
    Bienvenido al registro de usuario de TalentIA!
    </p>
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
    <div>
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="Username"
            {...register("username", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.username ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        <div className="h-5">
        {errors.username && <span className="text-red-500 text-sm">Obligatorio</span>}
            </div>
        </div>
    </div>

    <div>
        <div className="relative h-11 w-full">
        <input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        <div className="h-5">
        {errors.email && <span className="text-red-500 text-sm">Ingrese una dirección de correo electrónico</span>}
            </div>
        </div>
    </div>

    <div>
        <div className="relative h-11 w-full">
        <input
            type="password"
            placeholder="Contraseña"
            {...register("password", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        <div className="h-5">
        {errors.password && <span className="text-red-500 text-sm">Introduzca una contraseña</span>}
            </div>
        </div>
    </div>

    <button
        type="submit"
        className="block w-full bg-purple-900 text-white font-bold py-3 rounded-lg transition-all hover:bg-purple-700"
    >
        Únete a TalentIA
    </button>
    </form>
    <p className="text-sm text-center text-blue-gray-500 mt-4">
    ¿Ya tienes una cuenta? <a href="/login" className="text-white">Inicia sesión</a>
    </p>
</div>
);
}
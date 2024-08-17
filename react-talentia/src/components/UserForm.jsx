import { useForm } from "react-hook-form";
import logo from "../assets/logo.png";
export function UserForm({ onSubmit }) {
const { register, handleSubmit, formState: { errors } } = useForm();

return (
<div>

    <div className="flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-20 h-20" />
    </div>
    
    <h4 className="text-2xl font-semibold text-blue-gray-900 mb-4 text-center">Registrarse</h4>
    <p className="text-base text-gray-700 mb-6">
    Bienvenido al registro de usuario de TalentIA!
    </p>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Name Field */}
    <div>
        {/*<h6 className="font-semibold text-blue-gray-900 mb-1">Nombre</h6>*/}
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="Nombre"
            {...register("name", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        <div className="h-5">
        {errors.name && <span className="text-red-500 text-sm">Obligatorio</span>}
            </div>
        </div>
    </div>

    {/* Last Name Field */}
    <div>
        {/*<h6 className="font-semibold text-blue-gray-900 mb-1">Your Last Name</h6>*/}
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="Apellido"
            {...register("lastname", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.lastname ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        <div className="h-5">
        {errors.lastname && <span className="text-red-500 text-sm">Obligatorio</span>}
            </div>
        </div>
    </div>

    {/* Email Field */}
    <div>
        {/*<h6 className="font-semibold text-blue-gray-900 mb-1">Your Email</h6> */}
        <div className="relative h-11 w-full">
        <input
            type="email"
            placeholder="Email@mail.com"
            {...register("email", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        <div className="h-5">
        {errors.email && <span className="text-red-500 text-sm">Ingrese una direccion de correo electronico</span
        >}
            </div>
        </div>
    </div>

    {/* Password Field */}
    <div>
        {/*<h6 className="font-semibold text-blue-gray-900 mb-1">Password</h6>*/}
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
    
    {/* Role Field */}
   {/* <div>  
        <h6 className="font-semibold text-blue-gray-900 mb-1">Role</h6>
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="User role"
            {...register("role", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900`}
        />
        {errors.role && <span className="text-red-500 text-sm">The role field is required</span>}
        </div>
    </div>
    */}

    {/* Submit Button */}
    <button
        type="submit"
        className="block w-full bg-purple-900 text-white font-bold py-3 rounded-lg transition-all hover:bg-purple-700"
    >
        Unete a TalentIA
    </button>
    </form>
    <p className="text-sm text-center text-blue-gray-500 mt-4">
    ¿Ya tienes una cuenta? <a href="/login" className="text-purple-900">Inicia sesión</a>
    </p>
</div>
);
}

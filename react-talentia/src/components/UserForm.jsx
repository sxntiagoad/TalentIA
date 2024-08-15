import { useForm } from "react-hook-form";

export function UserForm({ onSubmit }) {
const { register, handleSubmit, formState: { errors } } = useForm();

return (
<div className="p-8 bg-white rounded-lg shadow-lg max-w-sm w-full">
    <h4 className="text-2xl font-semibold text-blue-gray-900 mb-4">User Form</h4>
    <p className="text-base text-gray-700 mb-6">
    Nice to meet you! Enter your details to register.
    </p>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Name Field */}
    <div>
        <h6 className="font-semibold text-blue-gray-900 mb-1">Your Name</h6>
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="Name"
            {...register("name", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900`}
        />
        {errors.name && <span className="text-red-500 text-sm">The name field is required</span>}
        </div>
    </div>

    {/* Last Name Field */}
    <div>
        <h6 className="font-semibold text-blue-gray-900 mb-1">Your Last Name</h6>
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="Last name"
            {...register("lastname", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.lastname ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900`}
        />
        {errors.lastname && <span className="text-red-500 text-sm">The last name field is required</span>}
        </div>
    </div>

    {/* Email Field */}
    <div>
        <h6 className="font-semibold text-blue-gray-900 mb-1">Your Email</h6>
        <div className="relative h-11 w-full">
        <input
            type="email"
            placeholder="Email@mail.com"
            {...register("email", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900`}
        />
        {errors.email && <span className="text-red-500 text-sm">The email field is required</span
        >}
        </div>
    </div>

    {/* Password Field */}
    <div>
        <h6 className="font-semibold text-blue-gray-900 mb-1">Password</h6>
        <div className="relative h-11 w-full">
        <input
            type="password"
            placeholder="********"
            {...register("password", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900`}
        />
        {errors.password && <span className="text-red-500 text-sm">The password field is required</span>}
        </div>
    </div>

    {/* Role Field */}
    <div>
        <h6 className="font-semibold text-blue-gray-900 mb-1">Role</h6>
        <div className="relative h-11 w-full">
        <input
            type="text"
            placeholder="User role"
            {...register("role", { required: true })}
            className={`peer h-full w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-blue-gray-200'} bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-2 focus:border-gray-900`}
        />
        {errors.role && <span className="text-red-500 text-sm">The role field is required</span>}
        </div>
    </div>

    {/* Submit Button */}
    <button
        type="submit"
        className="block w-full bg-gray-900 text-white font-bold py-3 rounded-lg transition-all hover:bg-gray-800"
    >
        Register
    </button>
    </form>
</div>
);
}

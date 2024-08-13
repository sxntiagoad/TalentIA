import { useForm } from "react-hook-form";
import { CreateUser } from "../api/User.api";
import { useNavigate} from "react-router-dom"

export function UserFormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await CreateUser(data);
      console.log(response);
    } catch (error) {
      console.error("Error creating user:", error);
    }
    navigate("/")
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input 
          type="text" 
          placeholder="Name"
          {...register("name", { required: true })} 
        />
        {errors.name && <span>El campo name no puede estar vacio</span>}

        <input 
          type="text" 
          placeholder="Last Name"
          {...register("lastname", { required: true })} 
        />
        {errors.lastname && <span>El campo last name no puede estar vacio</span>}

        <input 
          type="text" 
          placeholder="Email"
          {...register("email", { required: true })} 
        />
        {errors.email && <span>El campo email no puede estar vacio</span>}

        <input 
          type="password" 
          placeholder="Password"
          {...register("password", { required: true })} 
        />
        {errors.password && <span>El campo password no puede estar vacio</span>}

        <input 
          type="text" 
          placeholder="Role"
          {...register("role", { required: true })} 
        />
        {errors.role && <span>El campo role no puede estar vacio</span>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
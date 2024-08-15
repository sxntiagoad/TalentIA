import { UserForm } from "../components/UserForm";
import { CreateUser } from "../api/User.api";
import { useNavigate } from "react-router-dom";

export function UserFormPage() {
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await CreateUser(data);
      console.log(response);
    } catch (error) {
      console.error("Error creating user:", error);
    }
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <UserForm onSubmit={onSubmit} />
    </div>
  );
}

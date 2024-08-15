import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById } from "../api/Services.api";
import { AboutService } from "../components/AboutService"; // Asegúrate que esto es correcto

export function ServiceDetailsPage() {
  const { id } = useParams(); // Asegúrate de que el ID está siendo capturado
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true); // Añadido para controlar el estado de carga

  useEffect(() => {
    async function loadService() {
      try {
        const response = await getServiceById(id);
        setService(response.data);
      } catch (error) {
        console.error("Error loading service:", error);
      } finally {
        setLoading(false); // Detenemos el estado de carga independientemente del resultado
      }
    }
    loadService();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  if (!service) {
    return <div>No service data available</div>; // Mensaje si no hay datos
  }

  return <AboutService service={service} />; // Renderiza el componente AboutService
}

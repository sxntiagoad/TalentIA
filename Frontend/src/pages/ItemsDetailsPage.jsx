import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById, getJobById } from "../api/Services.api";
import { AboutItem } from "../components/Modules/AboutItem";
import { Navbar } from "../components/general/Navbar"; // Importamos el componente Navbar

export function ItemDetailsPage({ isService = true }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const response = isService ? await getServiceById(id) : await getJobById(id);
        setItem(response.data);
      } catch (error) {
        console.error("Error cargando el elemento:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id, isService]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!item) {
    return <div>No hay datos disponibles para este elemento</div>;
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <div className="pt-16">
        <AboutItem item={item} isService={isService} />
      </div>
    </>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getServiceById, getJobById} from "../api/Services.api";
import { AboutItem } from "../components/AboutItem"; // Asegúrate que esto es correcto

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
        console.error("Error loading item:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id, isService]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!item) {
    return <div>No item data available</div>;
  }

  return <AboutItem item={item} isService={isService} />;
}
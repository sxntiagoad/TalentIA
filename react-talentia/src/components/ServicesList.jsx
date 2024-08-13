import { useEffect, useState } from "react";
import { getAllServices } from "../api/Services.api";
import { ServicePost } from "./ServicePost";
export function ServicesList() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadServices() {
      const services = await getAllServices();
      setServices(services.data);
    }
    loadServices();
  }, []);

  return (
    <div className ="grid grid-cols-3 gap-3 ">
      {services.map(service => (
        <ServicePost key={service.id} service={service}/>
        
      ))}
    </div>
  );
}
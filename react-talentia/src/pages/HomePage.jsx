import { ItemsList } from "../components/home/ItemsList";
import { Banner } from "../components/home/Banner"; // Importa el Banner

export function HomePage() {
  return (
    <div>
      <Banner />  {/* Añade el Banner aquí */}
      <ItemsList isService={true} title={'Servicios'} />
      <ItemsList isService={false} title={"Trabajos"} />
    </div>
  );
}

import { ItemsList } from "../components/ItemsList";
import { Banner } from "../components/Banner"; // Importa el Banner

export function HomePage() {
  return (
    <div>
      <Banner />  {/* Añade el Banner aquí */}
      <ItemsList isService={true} title={'Servicios'} />
      <ItemsList isService={false} title={"Trabajos"} />
    </div>
  );
}

import { ItemsList } from "../components/home/ItemsList";
import { Banner } from "../components/home/Banner"; // Importa el Banner
import { CategoriesList } from "../components/home/CategoriesList"; // Importa el componente CategoriesList
import { Navigation } from "../components/general/Navigation"; // Importa el componente Navigation


export function HomePage() {
  return (
    <div>
      <Navigation/>
      <Banner />  {/* Añade el Banner aquí */}
      <ItemsList isService={true} title={'Servicios'} />
      <ItemsList isService={false} title={"Trabajos"} />
      <CategoriesList />  
    </div>
  );
}

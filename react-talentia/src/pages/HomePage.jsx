import { ItemsList } from "../components/home/ItemsList";
import { Banner } from "../components/home/Banner"; // Importa el Banner
import { CategoriesList } from "../components/home/CategoriesList"; // Importa el componente CategoriesList
import { Navbar } from "../components/general/Navbar"; // Importa el componente Navigation


export function HomePage() {
  return (
    <div>
      <Navbar isAuthenticated={true}/>
      <Banner />  {/* Añade el Banner aquí */}
      <CategoriesList />  
      <ItemsList isService={true} title={'Servicios'} />
      <ItemsList isService={false} title={"Trabajos"} />
    </div>
  );
}
import { Navbar } from "../components/general/Navbar";
import { Banner } from "../components/home/Banner";
import { CategoriesList } from "../components/home/CategoriesList";
import { ItemsList } from "../components/home/ItemsList";
import { Footer } from "../components/general/footer";

export function HomePage() {
  return (
    <div>
      <Navbar isAuthenticated={true} />
      <div className="pt-24">
        <Banner />
        <CategoriesList />
        <ItemsList isService={true} title={'Servicios'} />
        <ItemsList isService={false} title={"Trabajos"} />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
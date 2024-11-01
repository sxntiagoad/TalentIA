import { Navbar } from "../components/general/Navbar";
import { Banner } from "../components/home/Banner";
import { CategoriesList } from "../components/home/CategoriesList";
import { ItemsList } from "../components/home/ItemsList";
import { Footer } from "../components/general/footer";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();


  return (
    <div>
      <Navbar isAuthenticated={true} />
      <div className="pt-24">
        <Banner />
        <CategoriesList />
        <div className="flex justify-between items-center px-4 mb-4">
        </div>
        <ItemsList isService={true} title={'Servicios'} />
        <ItemsList isService={false} title={"Trabajos"} />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;

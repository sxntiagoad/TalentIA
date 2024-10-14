import { Navbar } from "../components/general/Navbar";
import { Banner } from "../components/home/Banner";
import { CategoriesList } from "../components/home/CategoriesList";
import { ItemsList } from "../components/home/ItemsList";
import { Footer } from "../components/general/footer";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  const handlePostService = () => {
    navigate("/post-service");
  };

  return (
    <div>
      <Navbar isAuthenticated={true} />
      <div className="pt-24">
        <Banner />
        <CategoriesList />
        <div className="flex justify-between items-center px-4 mb-4">
          <h2 className="text-2xl font-bold">Servicios</h2>
          <button
            onClick={handlePostService}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Publicar Servicio
          </button>
        </div>
        <ItemsList isService={true} title={'Servicios'} />
        <ItemsList isService={false} title={"Trabajos"} />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
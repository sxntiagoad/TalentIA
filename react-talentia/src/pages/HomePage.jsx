import React from 'react';
import { Navbar } from "../components/general/Navbar";
import { Banner } from "../components/home/Banner";
import { CategoriesList } from "../components/home/CategoriesList";
import { ItemsList } from "../components/home/ItemsList";
import { Footer } from "../components/general/footer"; // Asegúrate de usar la ruta correcta

export function HomePage() {
  return (
    <div>
      <Navbar isAuthenticated={true} />
      <Banner />
      <CategoriesList />
      <ItemsList isService={true} title={'Servicios'} />
      <ItemsList isService={false} title={"Trabajos"} />
      <Footer />
    </div>
  );
}

export default HomePage;

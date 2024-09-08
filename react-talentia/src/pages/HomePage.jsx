import React from 'react';
import { Navbar } from "../components/general/Navbar";
import { Banner } from "../components/home/Banner";
import { CategoriesList } from "../components/home/CategoriesList";
import { ItemsList } from "../components/home/ItemsList";
import { Footer } from "../components/general/footer";
import ChatBot from '../pages/ChatBot'; // Importamos el componente ChatBot

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
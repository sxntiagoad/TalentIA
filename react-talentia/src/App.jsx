import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from "./pages/HomePage";
import { ItemDetailsPage } from "./pages/ItemsDetailsPage";
import { UserFormPage } from "./pages/UserFormPage";
import SubcategoryPage from "./pages/SubCategories";
import SearchPage from "./pages/SearchPage";
import { MainCategoryPage } from "./pages/MainCategoryPage";
import InitPage from "./pages/InitPage";
import Services from "./pages/Services";
import Jobs from "./pages/Jobs";
import CompanyInitPage from './pages/CompanyInitPage';
//import ChatBot from "./pages/ChatBot"; // Importamos el componente ChatBot

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<InitPage />} />
        <Route path="/company" element={<CompanyInitPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/services/:id" element={<ItemDetailsPage isService={true} />} />
        <Route path="/jobs" element={<Jobs/>} />
        <Route path="/jobs/:id" element={<ItemDetailsPage isService={false} />} />
        <Route path="/user-form" element={<UserFormPage />} />
        <Route path="/subcategory/:id" element={<SubcategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:id" element={<MainCategoryPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
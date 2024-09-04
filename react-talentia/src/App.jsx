import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ItemDetailsPage } from "./pages/ItemsDetailsPage";
import { UserFormPage } from "./pages/UserFormPage";
import SubcategoryPage from "./pages/SubCategories"; // Cambiado a importación por defecto
import SearchPage from "./pages/SearchPage"; // Importa el componente de resultados de búsqueda
import ChatBot from "./pages/ChatBot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:id" element={<ItemDetailsPage isService={true} />} />
        <Route path="/jobs/:id" element={<ItemDetailsPage isService={false} />} />
        <Route path="/user-form" element={<UserFormPage />} />
        <Route path="/subcategory/:id" element={<SubcategoryPage />} />
        <Route path="/search" element={<SearchPage />} /> {/* Ruta para resultados de búsqueda */}
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ItemDetailsPage } from "./pages/ItemsDetailsPage";
import { UserFormPage } from "./pages/UserFormPage";
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:id" element={<ItemDetailsPage isService={true} />} />
        <Route path="/jobs/:id" element={<ItemDetailsPage isService={false} />} />
        <Route path="/user-form" element={<UserFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;

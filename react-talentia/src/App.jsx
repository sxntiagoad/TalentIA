import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ServicesPage } from "./pages/ServicesPage";
import { ServiceDetailsPage } from "./pages/ServiceDetailsPage";
import { UserFormPage } from "./pages/UserFormPage";
import { Navigation } from "./components/Navigation";
import { Banner } from "./components/Banner";

function App() {
  return (
    <Router>
      <Navigation />
      <Banner/>
      <Routes>
        <Route path="/" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/user-form" element={<UserFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;

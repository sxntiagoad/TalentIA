import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
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
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/user-form" element={<UserFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;

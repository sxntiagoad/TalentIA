import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoutes from './components/general/ProtectedRoutes';
import ServicePostedSuccess from './components/freelancer/ServicePostedSuccess';
import JobPostedSuccess from './components/company/JobPostedSuccess';
import { HomePage } from "./pages/FreelancerHomePage";
import { ItemDetailsPage } from "./pages/ItemsDetailsPage";
import SubcategoryPage from "./pages/SubCategories";
import SearchPage from "./pages/SearchPage";
import { MainCategoryPage } from "./pages/MainCategoryPage";
import InitPage from "./pages/InitPage";
import Services from "./pages/Services";
import Jobs from "./pages/Jobs";
import CompanyInitPage from './pages/CompanyInitPage';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ServiceForm from './pages/post/ServiceForm';
import JobForm from './pages/post/JobForm';
import ProfilePage from './components/profiles/ProfilePage';
import CompletarPerfil from './components/freelancer/CompletarPerfil';
import CompletarPerfilCompania from './components/company/CompletarPerfilCompania';
import CompanyHomePage from './pages/CompanyHomePage';
import { PublicProfile } from './components/profiles/PublicProfile';
import ManageCandidatesPage from './pages/ManageCandidatesPage';
import EmployeesList from './components/company/EmployeesList';
import MyJobsPage from './pages/MyJobsPage';
import WorkspacePage from './pages/WorkspacePage';
import MyServicesPage from './pages/MyServicesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<InitPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/company" element={<CompanyInitPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/post-service" element={<ServiceForm />} />
              <Route path="/post-job" element={<JobForm />} /> 
              <Route path="/job-posted" element={<JobPostedSuccess />} />
              <Route path="/service-posted" element={<ServicePostedSuccess />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/services/:id" element={<ItemDetailsPage isService={true} />} />
              <Route path="/jobs/:id" element={<ItemDetailsPage isService={false} />} />
              <Route path="/subcategory/:id" element={<SubcategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:id" element={<MainCategoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/completar-perfil" element={<CompletarPerfil />} />
              <Route path="/company-home" element={<CompanyHomePage />} />
              <Route path="/completar-perfil-compania" element={<CompletarPerfilCompania />} />
              <Route path="/profile/:userType/:id" element={<PublicProfile />} />
              <Route path="/gestionar-candidatos" element={<ManageCandidatesPage />} />
              <Route path="/empleados" element={<EmployeesList />} />
              <Route path="/my-jobs" element={<MyJobsPage />} />
              <Route path="/workspace/:applicationId" element={<WorkspacePage />} />
              <Route path="/my-services" element={<MyServicesPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getProfile } from '../../api/Auth.api';
import { getAllServices } from '../../api/Services.api';
import Navbar from '../general/Navbar';
import FreelancerProfile from '../freelancer/freelancerProfile';
import CompanyProfile from '../company/CompanyProfile';
import ResultsGrid from '../general/ResultsGrid';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFreelancer = 'lastname' in user;

  useEffect(() => {
    const fetchProfileAndItems = async () => {
      try {
        setLoading(true);
        const profileResponse = await getProfile();
        setProfile(profileResponse.data);
        
        if (isFreelancer) {
          const servicesResponse = await getAllServices();
          const filteredServices = servicesResponse.data.filter(service => 
            service.freelancer?.id === user.id
          );
          setItems(filteredServices);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileAndItems();
    }
  }, [user, isFreelancer]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAuthenticated={true} isCompanyMode={!isFreelancer} />
      <div className="container mx-auto mt-20 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {isFreelancer ? 'Perfil de Freelancer' : 'Perfil de Empresa'}
          </h1>
          {isFreelancer ? (
            <FreelancerProfile profile={profile} setProfile={setProfile} />
          ) : (
            <CompanyProfile profile={profile} setProfile={setProfile} />
          )}
        </div>

        {isFreelancer && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Mis Servicios Publicados</h2>
            {items.length > 0 ? (
              <ResultsGrid 
                items={items} 
                isService={true} 
                title="Servicios" 
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Aún no has publicado ningún servicio
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

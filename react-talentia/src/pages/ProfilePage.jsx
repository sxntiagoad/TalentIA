import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../api/Auth.api';
import Navbar from '../components/general/Navbar';
import FreelancerProfile from '../components/freelancer/freelancerProfile';
import CompanyProfile from '../components/company/CompanyProfile';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log(user);
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isFreelancer = 'lastname' in user;

  if (isFreelancer) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar isAuthenticated={true} isCompanyMode={false} />
        <div className="container mx-auto mt-20 p-8">
          <h1 className="text-3xl font-bold mb-6">Perfil de Freelancer</h1>
          <FreelancerProfile profile={profile} setProfile={setProfile} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar isAuthenticated={true} isCompanyMode={true} />
        <div className="container mx-auto mt-20 p-8">
          <h1 className="text-3xl font-bold mb-6">Perfil de Empresa</h1>
          <CompanyProfile profile={profile} setProfile={setProfile} />
        </div>
      </div>
    );
  }
};

export default ProfilePage;

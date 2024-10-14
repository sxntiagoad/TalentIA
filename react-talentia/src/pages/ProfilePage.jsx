import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProfile } from '../api/Auth.api';
import Navbar from '../components/general/Navbar';
import FreelancerProfile from '../components/freelancer/freelancerProfile';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
    }
  };

  if (!profile) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAuthenticated={true} />
      <div className="container mx-auto mt-20 p-8">
        <h1 className="text-3xl font-bold mb-6">Perfil de Usuario</h1>
        <FreelancerProfile profile={profile} setProfile={setProfile} />
      </div>
    </div>
  );
};

export default ProfilePage;

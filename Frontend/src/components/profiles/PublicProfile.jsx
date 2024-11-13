import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicProfile } from '../../api/Profile.api';
import FreelancerProfile from '../../components/freelancer/freelancerProfile';
import CompanyProfile from '../../components/company/CompanyProfile';
import ChatButton from '../Chat/ChatButton';
import { useAuth } from '../../context/AuthContext';

export function PublicProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userType, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log('Fetching profile for:', userType, id); // Debug
        const response = await getPublicProfile(userType, id);
        console.log('Profile response:', response.data); // Debug
        setProfile(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err); // Debug
        setError('Error al cargar el perfil');
        setLoading(false);
      }
    };

    if (userType && id) {
      fetchProfile();
    }
  }, [userType, id]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:text-purple-800"
          >
            ← Volver
          </button>
          
          {user && profile && user.id !== profile.id && (
            <ChatButton 
              otherUser={{
                id: profile.id,
                name: userType === 'freelancer' 
                  ? `${profile.name} ${profile.lastname}` 
                  : profile.name,
                type: userType,
                profile_id: profile.id
              }}
            />
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            <p className="mt-4 text-gray-600 animate-pulse">Cargando perfil...</p>
            <div className="mt-2 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="animate-progress w-full h-full bg-purple-600 rounded-full"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 text-purple-600 hover:text-purple-800"
            >
              Volver atrás
            </button>
          </div>
        )}

        {!loading && !error && profile && (
          userType === 'freelancer' ? (
            <FreelancerProfile profile={profile} />
          ) : (
            <CompanyProfile profile={profile} />
          )
        )}
      </div>
    </>
  );
} 
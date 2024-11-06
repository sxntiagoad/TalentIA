import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import ChatComponent from '../Chat/ChatComponent';
import { getUserInfo } from '../../api/Chat.api';
import { useStreamChat } from '../../hooks/useStreamChat';

const ChatButton = ({ otherUser }) => {
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { client, connecting, isConnected, reconnect } = useStreamChat();

  useEffect(() => {
    if (showChat && otherUser?.id && !userData) {
      loadUserData();
    }
  }, [showChat, otherUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('otherUser completo:', otherUser);
      
      let userId = otherUser.id;
      
      if (!userId) {
        if (otherUser.type === 'company') {
          userId = otherUser.company?.id;
        } else if (otherUser.type === 'freelancer') {
          userId = otherUser.freelancer?.id;
        }
      }

      if (!userId) {
        userId = otherUser.profile_id;
      }
      
      console.log('ID que se usará:', userId);
      
      if (!userId) {
        console.error('Datos del usuario:', otherUser);
        throw new Error('No se pudo determinar el ID del usuario');
      }

      const userInfo = await getUserInfo(userId);
      console.log('Información obtenida del usuario:', userInfo);
      
      const completeUserInfo = {
        ...userInfo,
        id: String(userInfo.id),
        profile_id: String(userInfo.profile_id || userInfo.id),
        type: userInfo.type || otherUser.type,
        name: userInfo.name || otherUser.name
      };
      
      console.log('Información final del usuario:', completeUserInfo);
      setUserData(completeUserInfo);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setError('Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = async () => {
    try {
      setError(null);
      if (!isConnected) {
        console.log('Reconectando cliente de chat...');
        await reconnect();
      }

      if (!showChat) {
        console.log('Abriendo chat con usuario:', otherUser);
        setShowChat(true);
        if (!userData && otherUser?.id) {
          await loadUserData();
        }
      } else {
        setShowChat(false);
      }
    } catch (err) {
      console.error('Error al iniciar chat:', err);
      setError('Error al iniciar el chat');
    }
  };

  // Renderizar mensaje de carga
  if (loading) {
    return (
      <button className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-wait">
        <span>Cargando...</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleChatClick}
        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
        disabled={loading}
      >
        <FaComments />
        <span>{showChat ? 'Cerrar Chat' : 'Iniciar Chat'}</span>
      </button>

      {error && (
        <div className="absolute top-full mt-2 w-full bg-red-100 text-red-600 p-2 rounded text-sm">
          {error}
        </div>
      )}

      {showChat && userData && (
        <div className="fixed bottom-0 right-4 w-96 h-[600px] shadow-xl bg-white rounded-t-lg z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-medium">{userData.name}</span>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="h-[calc(600px-48px)]">
            <ChatComponent 
              otherUser={userData} 
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatButton;
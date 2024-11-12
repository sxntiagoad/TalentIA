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
  const { client, isConnected, reconnect } = useStreamChat();

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userId = otherUser.id || otherUser.profile_id;
      
      if (!userId) throw new Error('ID de usuario no encontrado');

      const userInfo = await getUserInfo(userId);
      setUserData({
        ...userInfo,
        id: String(userInfo.id),
        type: userInfo.type || otherUser.type,
      });
    } catch (error) {
      setError('Error al cargar datos del usuario');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showChat && !userData) {
      loadUserData();
    }
  }, [showChat]);

  const handleChatClick = async () => {
    try {
      if (!isConnected) await reconnect();
      setShowChat(!showChat);
    } catch (err) {
      setError('Error al iniciar el chat');
      console.error(err);
    }
  };

  if (loading) {
    return <button className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cargando...</button>;
  }

  return (
    <div className="relative">
      <button
        onClick={handleChatClick}
        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        disabled={loading}
      >
        <FaComments />
        <span>{showChat ? 'Cerrar Chat' : 'Iniciar Chat'}</span>
      </button>

      {error && (
        <div className="absolute top-full mt-2 w-full bg-red-100 text-red-600 p-2 rounded">
          {error}
        </div>
      )}

      {showChat && userData && (
        <div className="fixed bottom-16 right-4 w-96 h-[600px] bg-white rounded-t-lg shadow-xl z-50">
          <ChatComponent otherUser={userData} onClose={() => setShowChat(false)} />
        </div>
      )}
    </div>
  );
};

export default ChatButton;
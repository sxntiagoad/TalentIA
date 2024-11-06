import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import ChatComponent from '../Chat/ChatComponent';
import { getUserInfo } from '../../api/Chat.api';
import { useStreamChat } from '../../hooks/useStreamChat';

const ChatButton = ({ otherUser }) => {
  const [showChat, setShowChat] = useState(false);
  const [userData, setUserData] = useState(null);
  const { client, reconnect } = useStreamChat();

  useEffect(() => {
    if (showChat && otherUser?.id && !userData) {
      loadUserData();
    }
  }, [showChat, otherUser]);

  const loadUserData = async () => {
    try {
      const userInfo = await getUserInfo(otherUser.id);
      setUserData(userInfo);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  const handleChatClick = async () => {
    if (!client) {
      await reconnect();
    }

    if (showChat) {
      setShowChat(false);
    } else {
      setShowChat(true);
      if (!userData && otherUser?.id) {
        await loadUserData();
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleChatClick}
        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
      >
        <FaComments />
        <span>{showChat ? 'Cerrar Chat' : 'Iniciar Chat'}</span>
      </button>

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
import React, { useEffect, useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import '../index.css';

import config from '../chatbot/Config';
import MessageParser from '../chatbot/MessageParser';
import ActionProvider from '../chatbot/ActionProvider';

function ChatBot() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Intentar obtener los datos del usuario al montar el componente
    try {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log('User data loaded:', userData); // Debug
        setUserData(userData);
      }
    } catch (e) {
      console.error('Error loading user data:', e);
    }
  }, []);

  // Debug render
  useEffect(() => {
    console.log('Current user data:', userData);
  }, [userData]);

  return (
    <div className="chatbot-container">
      {userData ? (
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      ) : (
        <div>Cargando datos del usuario...</div>
      )}
    </div>
  );
}

export default ChatBot;
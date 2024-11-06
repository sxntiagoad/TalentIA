import { useState, useEffect, useCallback } from 'react';
import { StreamChat } from 'stream-chat';
import { initializeChat } from '../api/Chat.api';

// Creamos el cliente fuera del hook para mantener una única instancia
const chatClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_KEY);

export const useStreamChat = () => {
  const [client, setClient] = useState(null);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectUser = useCallback(async () => {
    try {
      setConnecting(true);
      setError(null);

      // Si ya hay una conexión activa, la reutilizamos
      if (chatClient.userID && chatClient.userToken) {
        setClient(chatClient);
        setIsConnected(true);
        setConnecting(false);
        return;
      }

      // Si hay una conexión previa, desconectamos primero
      if (chatClient.userID) {
        await chatClient.disconnectUser();
      }

      const { data } = await initializeChat();
      const { token, userData } = data;

      await chatClient.connectUser(
        {
          id: String(userData.id),
          name: userData.name,
          email: userData.email,
          image: userData.image,
          type: userData.type,
          profile_id: String(userData.profile_id)
        },
        token
      );

      // Configurar event listeners
      chatClient.on('connection.changed', event => {
        setIsConnected(event.online);
      });

      chatClient.on('connection.recovered', () => {
        setIsConnected(true);
        setError(null);
      });

      chatClient.on('connection.error', () => {
        setError('Error de conexión');
        setIsConnected(false);
      });

      setClient(chatClient);
      setIsConnected(true);
      setError(null);

    } catch (err) {
      console.error('Error al conectar chat:', err);
      setError(err.message || 'Error al conectar con el chat');
      setIsConnected(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      if (chatClient.userID) {
        await chatClient.disconnectUser();
        setIsConnected(false);
        setClient(null);
      }
    } catch (err) {
      console.error('Error al desconectar:', err);
    }
  }, []);

  useEffect(() => {
    connectUser();

    return () => {
      chatClient.off();
      disconnect();
    };
  }, [connectUser, disconnect]);

  const reconnect = useCallback(async () => {
    if (!isConnected) {
      await connectUser();
    }
  }, [isConnected, connectUser]);

  return {
    client,
    connecting,
    error,
    isConnected,
    reconnect,
    disconnect
  };
};

import { useState, useEffect, useCallback } from 'react';
import { StreamChat } from 'stream-chat';
import { initializeChat } from '../api/Chat.api';

const chatClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_KEY);

export const useStreamChat = () => {
  const [client, setClient] = useState(null);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState(null);

  // Función para desconectar usuario actual
  const disconnectUser = useCallback(async () => {
    if (chatClient.userID) {
      await chatClient.disconnectUser();
      setClient(null);
    }
  }, []);

  // Función para manejar eventos en tiempo real
  const setupEventListeners = useCallback(() => {
    // Evento cuando llega un nuevo mensaje
    chatClient.on('message.new', event => {
      console.log('Nuevo mensaje recibido:', event);
      // Forzar actualización del canal
      const channel = chatClient.channel('messaging', event.cid);
      channel.watch();
    });

    // Evento cuando un canal es actualizado
    chatClient.on('channel.updated', event => {
      console.log('Canal actualizado:', event);
      const channel = chatClient.channel('messaging', event.channel.id);
      channel.watch();
    });

    // Evento cuando cambia el estado de conexión de un usuario
    chatClient.on('connection.changed', event => {
      console.log('Estado de conexión cambiado:', event);
    });

    // Evento cuando hay cambios en la presencia de usuarios
    chatClient.on('presence.changed', event => {
      console.log('Presencia cambiada:', event);
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const connectUser = async () => {
      try {
        // Si hay un usuario conectado, desconectarlo primero
        await disconnectUser();

        console.log('Iniciando conexión del chat...');
        setConnecting(true);

        const response = await initializeChat();
        const { token, userData } = response.data;

        await chatClient.connectUser(
          {
            id: String(userData.id),
            name: userData.name,
            email: userData.email,
            image: userData.image
          },
          token
        );

        // Configurar listeners de eventos
        setupEventListeners();

        if (mounted) {
          setClient(chatClient);
          setError(null);
        }
      } catch (err) {
        console.error('Error en useStreamChat:', err);
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setConnecting(false);
        }
      }
    };

    connectUser();

    // Cleanup
    return () => {
      mounted = false;
      // Remover todos los event listeners al desmontar
      chatClient.off();
      disconnectUser();
    };
  }, []); // Se ejecuta solo al montar el componente

  // Exponer función para reconectar manualmente si es necesario
  const reconnect = useCallback(async () => {
    await disconnectUser();
    setConnecting(true);
    const response = await initializeChat();
    const { token, userData } = response.data;
    await chatClient.connectUser(
      {
        id: String(userData.id),
        name: userData.name,
        email: userData.email,
        image: userData.image
      },
      token
    );
    setupEventListeners();
    setClient(chatClient);
    setConnecting(false);
  }, [disconnectUser, setupEventListeners]);

  return { 
    client, 
    connecting, 
    error,
    reconnect // Exponemos la función de reconexión
  };
};

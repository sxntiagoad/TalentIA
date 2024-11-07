import React, { useEffect, useState, useCallback } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { createChannel } from '../../api/Chat.api';
import { useStreamChat } from '../../hooks/useStreamChat';
import { useAuth } from '../../context/AuthContext';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatComponent = ({ otherUser, onClose }) => {
  const { client, connecting, error: connectionError, reconnect } = useStreamChat();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const initChannel = useCallback(async () => {
    if (!client || !otherUser?.id) {
      setError('No se puede iniciar el chat en este momento');
      return;
    }

    try {
      setLoading(true);
      console.log('Iniciando chat con usuario:', otherUser);
      
      // Determinar el tipo de usuario actual y el otro usuario
      const currentUserType = user.hasOwnProperty('company_name') ? 'company' : 'freelancer';
      const otherUserType = otherUser.hasOwnProperty('company_name') ? 'company' : 'freelancer';
      
      const channelData = await createChannel(otherUser.id, {
        currentUserType,
        otherUserType
      });
      
      if (channelData && channelData.channel) {
        const newChannel = client.channel(
          'messaging', 
          channelData.channel.id,
          {
            members: [client.userID, String(otherUser.id)],
            userTypes: {
              [client.userID]: currentUserType,
              [otherUser.id]: otherUserType
            }
          }
        );

        await newChannel.watch();
        setChannel(newChannel);
        setError(null);
      }
    } catch (err) {
      console.error('Error al inicializar canal:', err);
      setError('Error al iniciar el chat');
    } finally {
      setLoading(false);
    }
  }, [client, otherUser, user]);

  useEffect(() => {
    if (!channel) {
      initChannel();
    }

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [channel, initChannel]);

  if (loading) return <div className="p-4 text-center">Iniciando chat...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!channel) return <div className="p-4 text-center">Cargando chat...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 p-2 flex justify-end">
        <button 
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 font-medium"
        >
          Cerrar chat ×
        </button>
      </div>
      <div className="chat-window flex-1">
        <Chat client={client} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatComponent;
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
import 'stream-chat-react/dist/css/v2/index.css';

const ChatComponent = ({ otherUser, onClose }) => {
  const { client, connecting, error: connectionError, reconnect } = useStreamChat();
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  const initChannel = useCallback(async () => {
    if (!client || !otherUser?.id) return;

    try {
      console.log('Iniciando chat con usuario:', otherUser);
      
      const channelData = await createChannel(otherUser.id);
      
      if (channelData && channelData.channel) {
        const newChannel = client.channel(
          'messaging', 
          channelData.channel.id,
          {
            members: [client.userID, String(otherUser.id)]
          }
        );

        await newChannel.watch();
        setChannel(newChannel);
        setError(null);
      }
    } catch (err) {
      console.error('Error al inicializar canal:', err);
      setError(err.message);
    }
  }, [client, otherUser]);

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

  // Reconectar si hay error
  useEffect(() => {
    if (connectionError) {
      const attemptReconnect = async () => {
        await reconnect();
        initChannel();
      };
      attemptReconnect();
    }
  }, [connectionError, reconnect, initChannel]);

  if (!otherUser?.id) return null;
  if (connecting) return <div className="p-4">Conectando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!channel) return <div className="p-4">Cargando chat...</div>;

  return (
    <div className="chat-window h-full">
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
  );
};

export default ChatComponent; 
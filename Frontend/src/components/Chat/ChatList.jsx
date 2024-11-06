import React, { useState, useEffect } from 'react';
import { Chat, Channel, Window, MessageList, MessageInput } from 'stream-chat-react';
import { useStreamChat } from '../../hooks/useStreamChat';
import 'stream-chat-react/dist/css/v2/index.css';

// Componente para mostrar la vista previa de un canal
const CustomChannelPreview = ({ channel, client, setActiveChannel, active }) => {
  if (!channel || !client) return null;

  const otherUser = Object.values(channel.state?.members || {})
    .find(member => member.user?.id !== client.userID)?.user;

  if (!otherUser) return null;

  const lastMessage = channel.state.messages?.[channel.state.messages.length - 1];
  const unreadCount = channel.countUnread();
  const initials = otherUser.name ? otherUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : '?';

  return (
    <div 
      className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${active ? 'bg-gray-100' : ''}`}
      onClick={() => setActiveChannel(channel)}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-lg font-semibold text-purple-600">{initials}</span>
          </div>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm truncate">{otherUser.name || 'Usuario desconocido'}</h3>
            <span className="text-xs text-gray-500">
              {lastMessage?.created_at && new Date(lastMessage.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{lastMessage?.text || 'No hay mensajes'}</p>
        </div>
      </div>
    </div>
  );
};

const ChatList = ({ isFloating = false }) => {
  const { client, connecting, error } = useStreamChat();
  const [activeChannel, setActiveChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar canales
  useEffect(() => {
    const loadChannels = async () => {
      if (!client) return;
      
      try {
        setLoading(true);
        const response = await client.queryChannels(
          { members: { $in: [client.userID] }, type: 'messaging' },
          [{ last_message_at: -1 }],
          { watch: true, state: true, presence: true }
        );

        // Agrupar por usuario y mantener solo el canal más reciente
        const uniqueChannels = Object.values(
          response.reduce((acc, channel) => {
            const otherUser = Object.values(channel.state?.members || {})
              .find(m => m.user?.id !== client.userID)?.user;
            
            if (otherUser && (!acc[otherUser.id] || 
                new Date(channel.state.last_message_at || 0) > 
                new Date(acc[otherUser.id].state.last_message_at || 0))) {
              acc[otherUser.id] = channel;
            }
            return acc;
          }, {})
        ).sort((a, b) => new Date(b.state.last_message_at || 0) - new Date(a.state.last_message_at || 0));

        setChannels(uniqueChannels);
      } catch (err) {
        console.error('Error cargando canales:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChannels();
    return () => channels.forEach(c => c.stopWatching());
  }, [client]);

  // Activar canal
  const handleSetActiveChannel = async (channel) => {
    try {
      await channel.watch();
      setActiveChannel(channel);
    } catch (err) {
      console.error('Error activando canal:', err);
    }
  };

  // Renderizar lista de canales
  const renderChannelList = () => (
    <div className="flex-1 overflow-y-auto">
      {channels.length ? 
        channels.map(channel => (
          <CustomChannelPreview
            key={channel.cid}
            channel={channel}
            client={client}
            setActiveChannel={handleSetActiveChannel}
            active={activeChannel?.cid === channel.cid}
          />
        )) : 
        <div className="p-4 text-center text-gray-500">No hay conversaciones activas</div>
      }
    </div>
  );

  // Estados de carga y error
  if (!client) return <div className="flex items-center justify-center h-full"><div className="text-sm text-gray-500">Inicializando chat...</div></div>;
  if (connecting || loading) return <div className="flex items-center justify-center h-full"><div className="text-sm text-gray-500">Cargando chats...</div></div>;
  if (error) return <div className="flex items-center justify-center h-full"><div className="text-sm text-red-500">Error al cargar los chats: {error.message}</div></div>;

  // Vista flotante
  if (isFloating) {
    return (
      <div className="h-full flex flex-col bg-white rounded-t-lg">
        <div className="p-4 border-b flex items-center justify-between">
          {!activeChannel ? (
            <>
              <h2 className="text-lg font-semibold">Chats</h2>
              <button onClick={() => setActiveChannel(null)} className="text-gray-500 hover:text-gray-700">×</button>
            </>
          ) : (
            <>
              <div className="flex items-center flex-1">
                <button onClick={() => setActiveChannel(null)} className="mr-2 text-gray-500 hover:text-gray-700">←</button>
                <div className="font-medium truncate">
                  {Object.values(activeChannel.state.members).find(m => m.user?.id !== client.userID)?.user?.name || 'Chat'}
                </div>
              </div>
              <button onClick={() => setActiveChannel(null)} className="text-gray-500 hover:text-gray-700 ml-2">×</button>
            </>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <Chat client={client}>
            {!activeChannel ? (
              <div className="h-full overflow-y-auto">{renderChannelList()}</div>
            ) : (
              <Channel channel={activeChannel}>
                <Window>
                  <MessageList />
                  <MessageInput />
                </Window>
              </Channel>
            )}
          </Chat>
        </div>
      </div>
    );
  }

  // Vista normal
  return (
    <div className="h-full flex">
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Mensajes</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <Chat client={client}>
            <div className="h-full overflow-y-auto">{renderChannelList()}</div>
          </Chat>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <>
            <div className="p-4 border-b flex items-center">
              <button onClick={() => setActiveChannel(null)} className="mr-2 text-gray-500 hover:text-gray-700">←</button>
              <div className="font-medium truncate">
                {Object.values(activeChannel.state.members).find(m => m.user?.id !== client.userID)?.user?.name || 'Chat'}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat client={client}>
                <Channel channel={activeChannel}>
                  <Window>
                    <MessageList />
                    <MessageInput />
                  </Window>
                </Channel>
              </Chat>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Selecciona una conversación para comenzar
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
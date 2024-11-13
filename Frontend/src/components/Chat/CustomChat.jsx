import React, { useState } from 'react';
import {
  Chat,
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  Window,
} from 'stream-chat-react';

const CustomChat = ({ client }) => {
  const [activeChannel, setActiveChannel] = useState(null);

  const filters = { type: 'messaging', members: { $in: [client.user.id] } };
  const sort = { last_message_at: -1 };

  const customMessageInput = (props) => {
    return (
      <MessageInput
        {...props}
        focus
        grow
        Input={CustomInputUI}
        attachButton={false}
      />
    );
  };

  return (
    <Chat client={client} theme="messaging light">
      <div className="chat-container">
        <div className="channel-list">
          <ChannelList
            filters={filters}
            sort={sort}
            onSelect={(channel) => setActiveChannel(channel)}
          />
        </div>
        <div className="channel-window">
          {activeChannel ? (
            <Channel channel={activeChannel}>
              <Window>
                <MessageList />
                {customMessageInput}
              </Window>
            </Channel>
          ) : (
            <div className="empty-channel">
              <p>Selecciona un chat para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </Chat>
  );
};

export default CustomChat; 
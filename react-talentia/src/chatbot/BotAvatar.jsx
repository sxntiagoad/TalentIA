import React from 'react';
import botAvatar from '../assets/bot-avatar.jpg'; // Asegúrate de tener esta imagen

const BotAvatar = () => {
  return (
    <div className="bot-avatar">
      <img src={botAvatar} alt="Bot Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
    </div>
  );
};

export default BotAvatar;
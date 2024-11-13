const CustomMessageUI = ({ message }) => {
  return (
    <div className="custom-message">
      <div className="message-header">
        <img 
          src={message.user?.image} 
          alt={message.user?.name} 
          className="avatar"
        />
        <span className="username">{message.user?.name}</span>
        <span className="timestamp">
          {new Date(message.created_at).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">
        {message.text}
      </div>
      {message.attachments?.length > 0 && (
        <div className="attachments">
          {message.attachments.map((attachment, i) => (
            <AttachmentRenderer 
              key={i} 
              attachment={attachment} 
            />
          ))}
        </div>
      )}
    </div>
  );
}; 
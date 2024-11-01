// src/chatbot/MessageParser.js
class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      // Enviar el mensaje del usuario al backend para procesarlo
      this.actionProvider.handleUserMessage(message);
    }
  }
  
  export default MessageParser;
  
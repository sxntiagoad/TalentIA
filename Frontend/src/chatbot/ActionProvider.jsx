// src/chatbot/ActionProvider.js

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    async handleUserMessage(message) {
      try {
        const response = await fetch('http://localhost:8000/api/chatbot/chat/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        const botMessage = this.createChatBotMessage(data.response);
        this.updateChatbotState(botMessage);
      } catch (error) {
        console.error('Error en handleUserMessage:', error);
        const errorMessage = this.createChatBotMessage(
          `Ocurrió un error: ${error.message}. Por favor, inténtalo de nuevo.`
        );
        this.updateChatbotState(errorMessage);
      }
    }
  
    updateChatbotState(message) {
      this.setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    }
}
  
export default ActionProvider;
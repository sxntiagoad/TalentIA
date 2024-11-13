// src/chatbot/ActionProvider.js

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    async handleUserMessage(message) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No hay sesión activa');
        }

        const response = await fetch('http://35.224.34.63:8000/api/chatbot/chat/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ 
              message: message
            }),
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (responseData.error) {
          throw new Error(responseData.error);
        }
        
        const botMessage = this.createChatBotMessage(responseData.response);
        this.updateChatbotState(botMessage);
      } catch (error) {
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
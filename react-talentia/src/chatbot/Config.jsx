import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "TalentIA Assistant",
  initialMessages: [
    createChatBotMessage("¡Hola! ¿En qué puedo ayudarte hoy?"),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#5A189A", // Cambia el color del cuadro de mensaje del bot
    },
    chatButton: {
      backgroundColor: "#9D4EDD", // Color del botón de enviar mensaje
    },
  },
  customComponents: {
    // Aquí puedes personalizar los componentes visuales del chatbot si es necesario
  },
};

export default config;

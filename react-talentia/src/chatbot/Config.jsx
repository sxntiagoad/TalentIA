import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "../chatbot/BotAvatar"; // Asegúrate de crear este componente

const config = {
  botName: "TalentIA Assistant",
  initialMessages: [
    createChatBotMessage("¡Hola! Bienvenido al chatbot de TalentIa! ¿en qué puedo ayudarte hoy?"),
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
    botAvatar: (props) => <BotAvatar {...props} />,
  },
};

export default config;

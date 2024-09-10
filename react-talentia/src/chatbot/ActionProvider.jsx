class ActionProvider {
constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
}
handaleHello = () => {
    const message = this.createChatBotMessage("Hola, ¿en qué puedo ayudarte hoy?");
    this.setChatbotMessage(message);
}

handleJobSearch = () => {
    const message = this.createChatBotMessage("Puedo ayudarte a buscar trabajos. ¿Qué tipo de trabajo estás buscando?");
    this.setChatbotMessage(message);
};

handleServiceSearch = () => {
    const message = this.createChatBotMessage("Te ayudaré a encontrar servicios. ¿Qué tipo de servicio necesitas?");
    this.setChatbotMessage(message);
};



handleUnknown = () => {
    const message = this.createChatBotMessage("Lo siento, no entendí eso. ¿Podrías intentar de nuevo?");
    this.setChatbotMessage(message);
};

setChatbotMessage = (message) => {
    this.setState((prev) => ({
    ...prev,
    messages: [...prev.messages, message],
    }));
};
}

export default ActionProvider;

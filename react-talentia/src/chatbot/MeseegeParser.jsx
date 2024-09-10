class MessageParser {
    constructor(actionProvider) {
        this.actionProvider = actionProvider;
    }

    parse(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes("trabajo")) {
            this.actionProvider.handleJobSearch();
        } else if (lowerCaseMessage.includes("servicio")) {
            this.actionProvider.handleServiceSearch();
        } else if (lowerCaseMessage.includes("hola")) {
            this.actionProvider.handaleHello();
        } else {
            this.actionProvider.handleUnknown();
        }
    }
}

export default MessageParser;

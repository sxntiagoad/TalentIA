import React from 'react'
import '../index.css';

export function ChatBot() {
    return (
      <div className="bg-black h-screen text-white flex flex-col justify-between">
        {/* Contenedor del Chat */}
        <div className="flex-grow overflow-y-auto p-4">
          {/* Mensajes del chat */}
          <div className="flex flex-col mx-auto max-w-3xl space-y-4">
            {/* Mensaje del chatbot */}
            <div className="bg-gray-800 p-3 rounded-lg self-start max-w-lg">
              Hola, soy un chatbot.
            </div>
            {/* Mensaje del usuario */}
            <div className="bg-blue-600 p-3 rounded-lg self-end max-w-lg">
              Hola, ¿cómo estás?
            </div>
          </div>
        </div>
        
        {/* Input para enviar mensajes */}
        <div className="p-4 bg-gray-900">
          <input 
            type="text" 
            className="w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Escribe un mensaje..."
          />
        </div>
      </div>
    );
  }
  
  export default ChatBot;
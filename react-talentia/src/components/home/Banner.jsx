import React, { useState, useEffect } from "react";
import backgroundImage from "../../assets/background.jpg";
import { motion } from "framer-motion";

export function Banner() {
  const [text, setText] = useState("");
  const [chatText, setChatText] = useState("");
  const fullText = "Descubre el poder de la inteligencia artificial en tu negocio";
  const chatFullText = "Hola, soy el asistente virtual de TalentIA. ¿En qué puedo ayudarte hoy?";

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(intervalId);
        startChatAnimation();
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const startChatAnimation = () => {
    let chatIndex = 0;
    const chatIntervalId = setInterval(() => {
      setChatText(chatFullText.slice(0, chatIndex));
      chatIndex++;
      if (chatIndex > chatFullText.length) {
        clearInterval(chatIntervalId);
      }
    }, 50);
  };

  return (
    <div 
      className="w-full bg-cover bg-center bg-fixed flex items-center justify-center relative" 
      style={{ backgroundImage: `url(${backgroundImage})`, height: '600px' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div 
        className="text-white z-10 p-8 rounded-lg w-4/5 h-4/5 flex"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: 'rgba(76, 29, 149, 0.7)', // Fondo morado oscuro
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)', // Sombra morada clara
          fontFamily: "'Space Mono', monospace",
          border: '1px solid rgba(167, 139, 250, 0.3)' // Borde morado claro
        }}
      >
        <div className="w-3/5 pr-8 flex flex-col justify-center">
          <h1 className="title-poppins-start mb-4 text-4xl">Bienvenido a TalentIA</h1>
          <p className="title-poppins-start text-purple-200 mb-10">TalentIA te permite mostrar tu talento y ofrecer tus servicios, 
            conectándote con oportunidades reales gracias a la inteligencia artificial. ¡Destaca y crece en el mercado laboral con TalentIA!</p>
          <motion.p 
            className="text-xl font-semibold text-purple-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {text}
          </motion.p>
        </div>

        <div className="w-2/5 pl-8 flex flex-col justify-evenly border-l border-purple-400 border-opacity-30">
          <div>
            <h2 className="text-2xl font-bold mb-3 text-purple-300">Asistente Virtual</h2>
            <motion.p 
              className="text-lg text-purple-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {chatText}
            </motion.p>
          </div>
          <div className="mt-4">
            <button 
              className="w-full p-2 rounded-lg text-purple-100 font-semibold transition-all duration-300 hover:text-white"
              style={{
                background: 'rgba(88, 28, 135, 0.6)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              Encontrar mi trabajo y servicio perfecto
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
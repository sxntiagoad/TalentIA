import React, { useState } from 'react';
import { Navbar } from "../components/general/Navbar";
import { Banner } from "../components/home/Banner";
import { CategoriesList } from "../components/home/CategoriesList";
import { ItemsList } from "../components/home/ItemsList";
import { Footer } from "../components/general/footer";
import ChatList from "../components/chat/ChatList";
import { FaComments } from 'react-icons/fa';

export const HomePage = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatError, setChatError] = useState(null);

  const handleChatError = (error) => {
    console.error('Error en el chat:', error);
    setChatError(error);
  };

  return (
    <div className="relative min-h-screen">
      <Navbar isAuthenticated={true} />
      
      {/* Chat flotante */}
      <div className="fixed right-4 bottom-4 z-50">
        {!showChat ? (
          <button
            onClick={() => setShowChat(true)}
            className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          >
            <FaComments size={24} />
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-lg w-96 h-[600px] overflow-hidden">
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mensajes</h2>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(600px-48px)]">
              {chatError ? (
                <div className="p-4 text-red-500 text-center">
                  Error al cargar el chat. Por favor, intenta de nuevo.
                </div>
              ) : (
                <ChatList 
                  isFloating={true} 
                  onError={handleChatError}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="pt-24">
        <Banner />
        <CategoriesList />
        <div className="flex justify-between items-center px-4 mb-4">
        </div>
        <ItemsList isService={true} title={'Servicios'} />
        <ItemsList isService={false} title={"Trabajos"} />
      </div>
      
      <Footer />
    </div>
  );
};


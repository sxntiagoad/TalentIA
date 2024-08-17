import React from "react";
import backgroundImage from "../assets/background.jpg"; 

export function Banner() {
  return (
    <div 
        className="w-full h-screen bg-cover bg-center bg-fixed flex items-center justify-center" 
        style={{ backgroundImage: `url(${backgroundImage})`, height: '500px' }} 
        >
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a TalentIA</h1>
        <p className="text-lg">Explora nuestros servicios especializados para impulsar tu negocio.</p>
      </div>
    </div>
  );
}
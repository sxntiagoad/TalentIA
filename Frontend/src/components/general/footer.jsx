import React from 'react';
import logo from "../../assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo del proyecto" className="h-8" />
            <h1 className="font-bold text-lg">TalentIA</h1>
          </div>
          <div className="text-xs">
            <span>Creadores: Nicolas Rico, Santigo Alvarez, Kenia Toscano</span>
          </div>
          <div className="text-xs">
            <a href="https://github.com/sxntiagoad/TalentIA" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300">GitHub</a>
            <span className="ml-2">&copy; TalentIA International Ltd. 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

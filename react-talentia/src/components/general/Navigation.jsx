import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import '../../index.css'
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logo from "../../assets/logo.png";

export function Navigation({ isAuthenticated = false }) {
  return (
    <div className="p-4 flex justify-between items-center bg-white">
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-3xl text-black">
          <Link to="/">TalentIA</Link>
        </h1>
      </div>

      {/* Desktop Menu or Search Bar */}
      {isAuthenticated ? (
        <div className="flex items-center justify-between w-full">
          {/* Centered Search Bar */}
          <div className="flex justify-center w-full">
            <input
              type="text"
              placeholder="Buscar..."
              className="border border-gray-300 rounded-md px-4 py-2 w-1/2" // Extended width for centering
            />
          </div>

          {/* Icons aligned to the far right */}
          <div className="flex space-x-4 items-center">
            <FaBell className="text-black w-6 h-6 cursor-pointer" />
            <FaEnvelope className="text-black w-6 h-6 cursor-pointer" />
            <FaUserCircle className="text-black w-6 h-6 cursor-pointer" />
          </div>
        </div>
      ) : (
        <nav className="flex space-x-6">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="hover:text-purple-500 transition-colors duration-300"
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/servicios"
                className="hover:text-purple-500 transition-colors duration-300"
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="hover:text-purple-500 transition-colors duration-300"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Desktop Buttons */}
      {!isAuthenticated && (
        <div className="flex space-x-4">
          <a
            href="/create-service"
            className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
          >
            Crear Servicio
          </a>
          <button className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white">
            Iniciar Sesión
          </button>
          <a
            href="/user-form"
            className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
          >
            Regístrate
          </a>
        </div>
      )}
    </div>
  );
}

export default Navigation;
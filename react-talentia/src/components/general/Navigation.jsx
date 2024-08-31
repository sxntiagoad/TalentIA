import { Link } from "react-router-dom";
import React, { useState } from "react";
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

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="p-4 flex justify-between items-center bg-white">
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-3xl text-black">
          <Link to="/">TalentIA</Link>
        </h1>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex space-x-6">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <IconButton onClick={toggleMobileMenu} className="text-black">
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </IconButton>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex space-x-4">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                to="/"
                className="hover:text-purple-500 transition-colors duration-300"
                onClick={toggleMobileMenu}
              >
                Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/servicios"
                className="hover:text-purple-500 transition-colors duration-300"
                onClick={toggleMobileMenu}
              >
                Servicios
              </Link>
            </li>
            <li>
              <Link
                to="/contacto"
                className="hover:text-purple-500 transition-colors duration-300"
                onClick={toggleMobileMenu}
              >
                Contacto
              </Link>
            </li>
          </ul>
          <div className="flex flex-col space-y-4">
            <a
              href="/create-service"
              className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
              onClick={toggleMobileMenu}
            >
              Crear Servicio
            </a>
            <button
              className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
              onClick={toggleMobileMenu}
            >
              Iniciar Sesión
            </button>
            <a
              href="/user-form"
              className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white"
              onClick={toggleMobileMenu}
            >
              Regístrate
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
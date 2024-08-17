import { Link } from "react-router-dom";
import React from "react";
import '../index.css'
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";
import logo from "../assets/logo.png"; 

export function Navigation() {
  return (
    <div className="flex justify-between items-center p-4 glass">
      <div className="flex items-center space-x-2">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-12 h-12" />
        <h1 className="font-bold text-3xl text-black">
          <Link to="/">TalentIA</Link>
        </h1>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/inicio"
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
      <div className="flex space-x-4">
        <button className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white">
          Iniciar Sesión
        </button>
        <a  href="/user-form" className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white">
          Regístrate
        </a>
      </div>
    </div>
  );
}
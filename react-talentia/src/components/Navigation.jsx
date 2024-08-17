import { Link } from "react-router-dom";
import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Card,
} from "@material-tailwind/react";

export function Navigation() {
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      <h1 className="font-bold text-3xl text-black">
        <Link to="/">TalentIA</Link>
      </h1>
      <nav>
        <ul className="flex space-x-6"> {/* Ajusta el espaciado entre los links */}
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
          {/* Agrega más enlaces según sea necesario */}
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
        <button className="border-purple-500 border-2 text-purple-500 font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-purple-500 hover:text-white">
          Regístrate
        </button>
      </div>
    </div>
  );
}

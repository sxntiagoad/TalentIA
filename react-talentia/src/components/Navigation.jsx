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
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <h1 className="font-bold text-3xl text-white">
        <Link to="/">🚀 TalentIA</Link>
      </h1>
      <Link to="/user-form">
        <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          User Form
        </button>
      </Link>
    </div>
  );
}

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/init.jpg';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';
import Navbar from '../../components/general/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { login as loginApi } from '../../api/Auth.api';

export function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginApi(username, password);
      localStorage.setItem('token', response.data.token);
      login(response.data.user);
      navigate('/home');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError('Credenciales inválidas. Por favor, intente de nuevo.');
    }
  };

  return (
    <>
      <Navbar isAuthenticated={false} />
      <div className="min-h-screen flex items-center justify-center" 
           style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <motion.div 
          className="w-full max-w-md p-8 rounded-lg glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Logo" className="w-20 h-20" />
          </div>
          
          <h4 className="text-2xl font-semibold text-blue-gray-900 mb-4 text-center">
            Iniciar sesión
          </h4>
          <p className="text-base text-white mb-6 text-center">
            Bienvenido de vuelta a TalentIA!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative h-11 w-full">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900"
                  required
                />
              </div>
            </div>
            <div>
              <div className="relative h-11 w-full">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="peer h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 text-sm text-blue-gray-700 outline-none transition-all focus:border-1 focus:border-gray-900"
                  required
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="block w-full bg-purple-900 text-white font-bold py-3 rounded-lg transition-all hover:bg-purple-700"
            >
              Iniciar sesión
            </button>
          </form>
          <p className="text-sm text-center text-blue-gray-500 mt-4">
            ¿No tienes una cuenta? <a href="/register" className="text-white">Regístrate</a>
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Login;

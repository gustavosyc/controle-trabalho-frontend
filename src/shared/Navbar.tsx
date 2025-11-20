import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function Navbar() {
  const [userName, setUserName] = useState('Usuário');
  
  useEffect(() => {
    // Tentar buscar informações do usuário
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Decodificar o token para pegar o nome (se disponível)
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserName(payload.nome || payload.login || 'Usuário');
        }
      } catch (err) {
        console.error('Erro ao buscar usuário');
      }
    };
    fetchUser();
  }, []);
  
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Bem-vindo de volta! 👋
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logout}
            className="ml-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

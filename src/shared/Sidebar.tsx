import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/jornada', label: 'Jornada', icon: '⏰' },
    { path: '/producao', label: 'Produção', icon: '📈' },
    { path: '/ferias', label: 'Férias', icon: '🏖️' },
    { path: '/folha', label: 'Folha', icon: '💰' },
    { path: '/admin', label: 'Admin', icon: '⚙️' },
  ];
  
  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white shadow-2xl">
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-2xl shadow-lg">
            💼
          </div>
          <div>
            <h1 className="font-bold text-lg">Controle</h1>
            <p className="text-xs text-indigo-300">de Trabalho</p>
          </div>
        </div>
      </div>
      <nav className="p-4 flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-indigo-700 shadow-lg scale-105'
                : 'hover:bg-indigo-800 hover:translate-x-1'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-700">
        <div className="text-xs text-indigo-300 text-center">
          v1.0.0 © 2025
        </div>
      </div>
    </aside>
  );
}

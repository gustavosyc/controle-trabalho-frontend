import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ login: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      nav('/');
    } catch (err) {
      alert('Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl">💼</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Controle de Trabalho
            </h1>
            <p className="text-gray-500 text-sm">
              Faça login para acessar sua conta
            </p>
          </div>
          
          {/* Formulário */}
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Digite seu login"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={(e) => setForm({ ...form, senha: e.target.value })}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          {/* Rodapé */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Sistema de Controle de Trabalho v1.0.0
            </p>
          </div>
        </div>
        
        {/* Decoração */}
        <div className="mt-8 text-center text-white text-sm">
          <p className="opacity-80">
            © 2025 Controle de Trabalho. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

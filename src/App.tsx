import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jornada from './pages/Jornada';
import Producao from './pages/Producao';
import Ferias from './pages/Ferias';
import Folha from './pages/Folha';
import Admin from './pages/Admin';
import Relatorios from './pages/Relatorios';
import Metas from './pages/Metas';
import Aprovacoes from './pages/Aprovacoes';
import BancoHoras from './pages/BancoHoras';
import Perfil from './pages/Perfil';

function Private({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to='/login' />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/jornada" element={<Private><Jornada /></Private>} />
      <Route path="/producao" element={<Private><Producao /></Private>} />
      <Route path="/ferias" element={<Private><Ferias /></Private>} />
      <Route path="/folha" element={<Private><Folha /></Private>} />
      <Route path="/admin" element={<Private><Admin /></Private>} />
      <Route path="/relatorios" element={<Private><Relatorios /></Private>} />
      <Route path="/metas" element={<Private><Metas /></Private>} />
      <Route path="/aprovacoes" element={<Private><Aprovacoes /></Private>} />
      <Route path="/banco-horas" element={<Private><BancoHoras /></Private>} />
      <Route path="/perfil" element={<Private><Perfil /></Private>} />
    </Routes>
  );
}

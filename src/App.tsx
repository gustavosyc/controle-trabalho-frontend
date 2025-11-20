import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Jornada from './pages/Jornada';
import Producao from './pages/Producao';
import Ferias from './pages/Ferias';
import Folha from './pages/Folha';
import Admin from './pages/Admin';

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
    </Routes>
  );
}

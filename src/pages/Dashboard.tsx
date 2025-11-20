import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();

  const irParaRelatorio = (tipo: 'horas' | 'producao' | 'consolidado') => {
    navigate('/relatorios', { state: { tipo } });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Título da Página */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo de volta! 👋
            </h2>
            <p className="text-gray-600">Visão geral do seu desempenho e atividades</p>
          </div>
          
          {/* Cards de Estatísticas - CLICÁVEIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1 - Horas Trabalhadas */}
            <div
              onClick={() => irParaRelatorio('horas')}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                  ⏰
                </div>
                <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Este mês
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2">Horas Trabalhadas</h3>
              <p className="text-3xl font-bold mb-1">160h</p>
              <p className="text-sm opacity-80">+12% em relação ao mês anterior</p>
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <p className="text-sm font-medium">📊 Clique para ver relatório detalhado</p>
              </div>
            </div>
            
            {/* Card 2 - Produção */}
            <div
              onClick={() => irParaRelatorio('producao')}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                  📈
                </div>
                <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Este mês
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2">Produção</h3>
              <p className="text-3xl font-bold mb-1">245</p>
              <p className="text-sm opacity-80">+8% em relação ao mês anterior</p>
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <p className="text-sm font-medium">📊 Clique para ver relatório detalhado</p>
              </div>
            </div>
            
            {/* Card 3 - Férias */}
            <div
              onClick={() => irParaRelatorio('consolidado')}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-2xl">
                  🏖️
                </div>
                <span className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  Disponível
                </span>
              </div>
              <h3 className="text-lg font-medium mb-2">Dias de Férias</h3>
              <p className="text-3xl font-bold mb-1">15 dias</p>
              <p className="text-sm opacity-80">Restantes para este ano</p>
              <div className="mt-4 pt-4 border-white border-opacity-20">
                <p className="text-sm font-medium">📊 Clique para ver relatório consolidado</p>
              </div>
            </div>
          </div>
          
          {/* Seção de Atividades Recentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Atividades Recentes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span>
                Atividades Recentes
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    ⏰
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Jornada registrada</p>
                    <p className="text-sm text-gray-500">Hoje às 08:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                    📈
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Produção atualizada</p>
                    <p className="text-sm text-gray-500">Ontem às 17:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    💰
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Folha processada</p>
                    <p className="text-sm text-gray-500">2 dias atrás</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Próximos Eventos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📅</span>
                Próximos Eventos
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                    15
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Reunião de equipe</p>
                    <p className="text-sm text-gray-500">15 de Nov, 14:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                    20
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Fechamento mensal</p>
                    <p className="text-sm text-gray-500">20 de Nov, 10:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                    25
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Avaliação de desempenho</p>
                    <p className="text-sm text-gray-500">25 de Nov, 16:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import axios from '../api/axios';

export default function Jornada() {
  const [jornadas, setJornadas] = useState<any[]>([]);
  const [form, setForm] = useState({ data: '', entrada: '', saida: '' });
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const carregar = async () => {
    const res = await axios.get('/jornada', authHeader);
    setJornadas(res.data);
  };

  useEffect(() => { carregar() }, []);

  const enviar = async (e: any) => {
    e.preventDefault();
    await axios.post('/jornada', form, authHeader);
    setForm({ data: '', entrada: '', saida: '' });
    carregar();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Título da Página */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span>⏰</span>
              Jornada de Trabalho
            </h2>
            <p className="text-gray-600">Registre e acompanhe suas horas trabalhadas</p>
          </div>

          {/* Formulário de Nova Jornada */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Nova Jornada</h3>
            <form onSubmit={enviar} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Entrada</label>
                <input
                  type="datetime-local"
                  value={form.entrada}
                  onChange={(e) => setForm({ ...form, entrada: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Saída</label>
                <input
                  type="datetime-local"
                  value={form.saida}
                  onChange={(e) => setForm({ ...form, saida: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>

          {/* Tabela de Jornadas */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Histórico de Jornadas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saída
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas Totais
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jornadas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        Nenhuma jornada registrada ainda
                      </td>
                    </tr>
                  ) : (
                    jornadas.map((j) => (
                      <tr key={j.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(j.data).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(j.entrada).toLocaleTimeString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(j.saida).toLocaleTimeString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {j.horasTotais.toFixed(2)}h
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

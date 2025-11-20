import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface Meta {
  id: number;
  tipo: string;
  descricao: string;
  valor: number;
  valorAtual: number;
  mes: string;
  status: string;
  usuario: {
    nome: string;
  };
}

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    buscarMetas();
  }, []);

  const buscarMetas = async () => {
    try {
      const response = await axios.get(`${API_URL}/metas`);
      setMetas(response.data);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularProgresso = (meta: Meta) => {
    return Math.min((meta.valorAtual / meta.valor) * 100, 100);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          🎯 Metas
        </h1>
        <p className="text-gray-600 mt-1">
          Acompanhe e gerencie metas individuais e de equipe
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : metas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhuma meta cadastrada
          </h3>
          <p className="text-gray-500 mb-6">
            Crie metas para acompanhar o desempenho da equipe
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metas.map((meta) => {
            const progresso = calcularProgresso(meta);
            const concluida = meta.status === 'concluida';

            return (
              <div
                key={meta.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  concluida ? 'border-green-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{meta.descricao}</h3>
                    <p className="text-sm text-gray-500">{meta.usuario.nome}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      concluida
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {meta.tipo}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso</span>
                    <span className="font-semibold text-gray-800">
                      {meta.valorAtual} / {meta.valor}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        concluida ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-sm font-medium text-gray-700">
                      {progresso.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Mês: {meta.mes}</span>
                  {concluida && (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      ✓ Concluída
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

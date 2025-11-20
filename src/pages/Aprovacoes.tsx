import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface Jornada {
  id: number;
  data: string;
  entrada: string;
  saida: string;
  horasTotais: number;
  status: string;
  usuario: {
    nome: string;
    cargo?: string;
  };
}

export default function Aprovacoes() {
  const [pendentes, setPendentes] = useState<Jornada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarPendentes();
  }, []);

  const buscarPendentes = async () => {
    try {
      const response = await axios.get(`${API_URL}/aprovacoes/pendentes`);
      setPendentes(response.data);
    } catch (error) {
      console.error('Erro ao buscar pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const aprovar = async (id: number) => {
    try {
      await axios.put(`${API_URL}/aprovacoes/${id}/aprovar`, {
        aprovadoPor: 1, // ID do admin
      });
      alert('Jornada aprovada com sucesso!');
      buscarPendentes();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Erro ao aprovar jornada');
    }
  };

  const rejeitar = async (id: number) => {
    const observacao = prompt('Motivo da rejeição:');
    if (!observacao) return;

    try {
      await axios.put(`${API_URL}/aprovacoes/${id}/rejeitar`, {
        aprovadoPor: 1,
        observacao,
      });
      alert('Jornada rejeitada');
      buscarPendentes();
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      alert('Erro ao rejeitar jornada');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora: string) => {
    return new Date(hora).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          ✅ Aprovações
        </h1>
        <p className="text-gray-600 mt-1">
          Aprove ou rejeite jornadas de trabalho
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : pendentes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhuma jornada pendente
          </h3>
          <p className="text-gray-500">
            Todas as jornadas foram aprovadas ou rejeitadas
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Saída
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Horas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendentes.map((jornada) => (
                  <tr key={jornada.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {jornada.usuario.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {jornada.usuario.cargo || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatarData(jornada.data)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatarHora(jornada.entrada)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatarHora(jornada.saida)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-600 font-semibold">
                        {jornada.horasTotais.toFixed(1)}h
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => aprovar(jornada.id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          ✓ Aprovar
                        </button>
                        <button
                          onClick={() => rejeitar(jornada.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          ✗ Rejeitar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

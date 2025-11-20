import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface Registro {
  id: number;
  saldo: number;
  mes: string;
  entrada: number;
  saida: number;
  descricao?: string;
  createdAt: string;
}

export default function BancoHoras() {
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const usuarioId = 1; // ID do admin

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const response = await axios.get(`${API_URL}/banco-horas/${usuarioId}/saldo`);
      setSaldoTotal(response.data.saldoTotal);
      setRegistros(response.data.registros);
    } catch (error) {
      console.error('Erro ao buscar banco de horas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          ⏱️ Banco de Horas
        </h1>
        <p className="text-gray-600 mt-1">
          Acompanhe seu saldo de horas trabalhadas
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <>
          {/* Card de Saldo */}
          <div className={`rounded-lg shadow-lg p-8 mb-6 ${
            saldoTotal >= 0
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-red-500 to-red-600'
          } text-white`}>
            <div className="text-center">
              <div className="text-sm opacity-90 mb-2">Saldo Total</div>
              <div className="text-6xl font-bold mb-2">
                {saldoTotal >= 0 ? '+' : ''}{saldoTotal.toFixed(1)}h
              </div>
              <div className="text-sm opacity-90">
                {saldoTotal >= 0
                  ? 'Você tem horas positivas no banco'
                  : 'Você deve horas ao banco'}
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Histórico de Movimentações
              </h2>
            </div>

            {registros.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                📊 Nenhuma movimentação registrada
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Mês
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Entrada
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Saída
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Saldo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registros.map((registro) => (
                      <tr key={registro.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatarData(registro.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {registro.mes}
                        </td>
                        <td className="px-6 py-4">
                          {registro.entrada > 0 && (
                            <span className="text-green-600 font-semibold">
                              +{registro.entrada.toFixed(1)}h
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {registro.saida > 0 && (
                            <span className="text-red-600 font-semibold">
                              -{registro.saida.toFixed(1)}h
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-semibold ${
                            registro.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {registro.saldo >= 0 ? '+' : ''}{registro.saldo.toFixed(1)}h
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {registro.descricao || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

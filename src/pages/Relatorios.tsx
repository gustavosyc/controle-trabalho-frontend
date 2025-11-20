import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface Usuario {
  id: number;
  nome: string;
  cargo?: string;
  totalHoras?: number;
  diasTrabalhados?: number;
  mediaHorasDia?: number;
  totalProducao?: number;
  horas?: number;
  producao?: number;
  ferias?: number;
}

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState<'horas' | 'producao' | 'consolidado'>('horas');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalGeral, setTotalGeral] = useState<any>(null);

  // Definir datas padrão (mês atual)
  useEffect(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    setDataInicio(primeiroDia.toISOString().split('T')[0]);
    setDataFim(ultimoDia.toISOString().split('T')[0]);
  }, []);

  const buscarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      alert('Por favor, selecione as datas');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/relatorios/${tipoRelatorio}`, {
        params: { dataInicio, dataFim },
      });

      setUsuarios(response.data.usuarios || []);
      
      if (tipoRelatorio === 'horas') {
        setTotalGeral({ totalHoras: response.data.totalHoras });
      } else if (tipoRelatorio === 'producao') {
        setTotalGeral({ totalProducao: response.data.totalProducao });
      } else {
        setTotalGeral(null);
      }
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      alert('Erro ao buscar relatório');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dataInicio && dataFim) {
      buscarRelatorio();
    }
  }, [tipoRelatorio]);

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          📊 Relatórios
        </h1>
        <p className="text-gray-600 mt-1">
          Visualize e analise dados de horas, produção e atividades
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              onClick={buscarRelatorio}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50"
            >
              {loading ? '🔄 Carregando...' : '🔍 Buscar Relatório'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setTipoRelatorio('horas')}
            className={`flex-1 py-4 px-6 font-medium transition-all ${
              tipoRelatorio === 'horas'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            ⏰ Horas Trabalhadas
          </button>
          <button
            onClick={() => setTipoRelatorio('producao')}
            className={`flex-1 py-4 px-6 font-medium transition-all ${
              tipoRelatorio === 'producao'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            📈 Produção
          </button>
          <button
            onClick={() => setTipoRelatorio('consolidado')}
            className={`flex-1 py-4 px-6 font-medium transition-all ${
              tipoRelatorio === 'consolidado'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
            }`}
          >
            📋 Consolidado
          </button>
        </div>
      </div>

      {/* Totais */}
      {totalGeral && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {totalGeral.totalHoras !== undefined && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-1">Total de Horas</div>
              <div className="text-4xl font-bold">{Math.round(totalGeral.totalHoras)}h</div>
            </div>
          )}
          {totalGeral.totalProducao !== undefined && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
              <div className="text-sm opacity-90 mb-1">Total de Produção</div>
              <div className="text-4xl font-bold">{totalGeral.totalProducao}</div>
            </div>
          )}
        </div>
      )}

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Carregando relatório...
          </div>
        ) : usuarios.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            📊 Nenhum dado encontrado para o período selecionado
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cargo
                  </th>
                  {tipoRelatorio === 'horas' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Horas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dias Trabalhados
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Média/Dia
                      </th>
                    </>
                  )}
                  {tipoRelatorio === 'producao' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Produção
                    </th>
                  )}
                  {tipoRelatorio === 'consolidado' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dias Trabalhados
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produção
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Férias (dias)
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{usuario.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {usuario.cargo || '-'}
                    </td>
                    {tipoRelatorio === 'horas' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-600 font-semibold">
                            {Math.round(usuario.totalHoras || 0)}h
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.diasTrabalhados || 0} dias
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(usuario.mediaHorasDia || 0).toFixed(1)}h
                        </td>
                      </>
                    )}
                    {tipoRelatorio === 'producao' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-green-600 font-semibold">
                          {usuario.totalProducao || 0}
                        </span>
                      </td>
                    )}
                    {tipoRelatorio === 'consolidado' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-blue-600 font-medium">
                            {Math.round(usuario.horas || 0)}h
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {usuario.diasTrabalhados || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-green-600 font-medium">
                            {usuario.producao || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="text-purple-600 font-medium">
                            {usuario.ferias || 0}
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

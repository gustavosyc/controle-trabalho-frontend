import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../shared/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface Jornada {
  id: number;
  data: string;
  entrada: string;
  saida: string;
  horasTotais: number;
  observacao?: string;
}

interface Producao {
  id: number;
  data: string;
  quantidade: number;
  tipo: string;
  observacao?: string;
}

interface Usuario {
  id: number;
  nome: string;
  cargo?: string;
  totalHoras?: number;
  diasTrabalhados?: number;
  mediaHorasDia?: number;
  totalProducao?: number;
  jornadas?: Jornada[];
  producoes?: Producao[];
}

export default function Relatorios() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tipoRelatorio, setTipoRelatorio] = useState<'horas' | 'producao' | 'consolidado'>('horas');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | 'todos'>('todos');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [todosUsuarios, setTodosUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [usuarioExpandido, setUsuarioExpandido] = useState<number | null>(null);

  // Definir datas padrão (mês atual)
  useEffect(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    setDataInicio(primeiroDia.toISOString().split('T')[0]);
    setDataFim(ultimoDia.toISOString().split('T')[0]);
    
    buscarUsuarios();
  }, []);

  // Verificar se veio de um card do dashboard
  useEffect(() => {
    if (location.state?.tipo) {
      setTipoRelatorio(location.state.tipo);
      if (location.state.usuarioId) {
        setUsuarioSelecionado(location.state.usuarioId);
      }
      // Buscar automaticamente
      setTimeout(() => buscarRelatorio(), 500);
    }
  }, [location.state]);

  const buscarUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/usuarios`);
      setTodosUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const buscarRelatorio = async () => {
    if (!dataInicio || !dataFim) {
      alert('Por favor, selecione as datas');
      return;
    }

    setLoading(true);
    try {
      const params: any = { dataInicio, dataFim };
      if (usuarioSelecionado !== 'todos') {
        params.usuarioId = usuarioSelecionado;
      }

      const response = await axios.get(`${API_URL}/relatorios/${tipoRelatorio}`, { params });

      setUsuarios(response.data.usuarios || []);
    } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      alert('Erro ao buscar relatório');
    } finally {
      setLoading(false);
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

  const toggleExpandir = (usuarioId: number) => {
    setUsuarioExpandido(usuarioExpandido === usuarioId ? null : usuarioId);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Relatórios"
        description="Visualize relatórios detalhados de horas, produção e consolidado"
        icon="📊"
      />

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="horas">⏰ Horas Trabalhadas</option>
              <option value="producao">📈 Produção</option>
              <option value="consolidado">📋 Consolidado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <select
              value={usuarioSelecionado}
              onChange={(e) => setUsuarioSelecionado(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">👥 Todos os usuários</option>
              {todosUsuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={buscarRelatorio}
          disabled={loading}
          className="mt-4 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium disabled:opacity-50"
        >
          {loading ? '🔄 Buscando...' : '🔍 Buscar Relatório'}
        </button>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum dado encontrado
          </h3>
          <p className="text-gray-500">
            Selecione os filtros e clique em "Buscar Relatório"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Cabeçalho do usuário */}
              <div
                className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                onClick={() => toggleExpandir(usuario.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{usuario.nome}</h3>
                    <p className="text-sm text-gray-600">{usuario.cargo || 'Sem cargo'}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    {tipoRelatorio === 'horas' && (
                      <>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {usuario.totalHoras?.toFixed(1) || 0}h
                          </div>
                          <div className="text-xs text-gray-500">Total de Horas</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {usuario.diasTrabalhados || 0}
                          </div>
                          <div className="text-xs text-gray-500">Dias Trabalhados</div>
                        </div>
                      </>
                    )}
                    {tipoRelatorio === 'producao' && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {usuario.totalProducao || 0}
                        </div>
                        <div className="text-xs text-gray-500">Total de Produção</div>
                      </div>
                    )}
                    <button className="text-2xl">
                      {usuarioExpandido === usuario.id ? '▼' : '▶'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Detalhes expandidos */}
              {usuarioExpandido === usuario.id && (
                <div className="p-6 border-t border-gray-200">
                  {tipoRelatorio === 'horas' && usuario.jornadas && usuario.jornadas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">📅 Jornadas Detalhadas</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entrada</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saída</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horas</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observação</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {usuario.jornadas.map((jornada) => (
                              <tr key={jornada.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{formatarData(jornada.data)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatarHora(jornada.entrada)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatarHora(jornada.saida)}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                                  {jornada.horasTotais.toFixed(1)}h
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {jornada.observacao || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {tipoRelatorio === 'producao' && usuario.producoes && usuario.producoes.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-4">📈 Produções Detalhadas</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observação</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {usuario.producoes.map((producao) => (
                              <tr key={producao.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-900">{formatarData(producao.data)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{producao.tipo}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-green-600">
                                  {producao.quantidade}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                  {producao.observacao || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

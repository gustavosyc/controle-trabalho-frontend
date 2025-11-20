import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

interface Usuario {
  id: number;
  nome: string;
  login: string;
  cargo?: string;
  cpf?: string;
  rg?: string;
  telefone?: string;
  endereco?: string;
  departamento?: string;
  salario?: number;
}

interface Estatisticas {
  totalHoras: number;
  totalProducao: number;
  diasFerias: number;
  saldoBancoHoras: number;
  metasAtivas: number;
  diasTrabalhados: number;
}

export default function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const usuarioId = 1; // ID do admin

  useEffect(() => {
    buscarDados();
  }, []);

  const buscarDados = async () => {
    try {
      const [perfilRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/perfil/${usuarioId}`),
        axios.get(`${API_URL}/perfil/${usuarioId}/estatisticas`),
      ]);
      setUsuario(perfilRes.data);
      setEstatisticas(statsRes.data);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!usuario || !estatisticas) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">Erro ao carregar perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          👤 Meu Perfil
        </h1>
        <p className="text-gray-600 mt-1">
          Visualize suas informações e estatísticas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Pessoais */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Informações Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Nome Completo</label>
                <p className="font-medium text-gray-800">{usuario.nome}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Login</label>
                <p className="font-medium text-gray-800">{usuario.login}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Cargo</label>
                <p className="font-medium text-gray-800">{usuario.cargo || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Departamento</label>
                <p className="font-medium text-gray-800">{usuario.departamento || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">CPF</label>
                <p className="font-medium text-gray-800">{usuario.cpf || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">RG</label>
                <p className="font-medium text-gray-800">{usuario.rg || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Telefone</label>
                <p className="font-medium text-gray-800">{usuario.telefone || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Salário</label>
                <p className="font-medium text-gray-800">
                  {usuario.salario
                    ? `R$ ${usuario.salario.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}`
                    : '-'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500">Endereço</label>
                <p className="font-medium text-gray-800">{usuario.endereco || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold">{estatisticas.totalHoras}h</div>
            <div className="text-sm opacity-90">Horas Trabalhadas</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold">{estatisticas.totalProducao}</div>
            <div className="text-sm opacity-90">Produção Total</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">🏖️</div>
            <div className="text-2xl font-bold">{estatisticas.diasFerias} dias</div>
            <div className="text-sm opacity-90">Férias Utilizadas</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold">
              {estatisticas.saldoBancoHoras >= 0 ? '+' : ''}
              {estatisticas.saldoBancoHoras}h
            </div>
            <div className="text-sm opacity-90">Banco de Horas</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{estatisticas.metasAtivas}</div>
            <div className="text-sm opacity-90">Metas Ativas</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold">{estatisticas.diasTrabalhados}</div>
            <div className="text-sm opacity-90">Dias Trabalhados</div>
          </div>
        </div>
      </div>
    </div>
  );
}

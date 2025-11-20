import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import axios from '../api/axios';

export default function Admin() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  
  const [formData, setFormData] = useState({
    login: '',
    senha: '',
    nome: '',
    cargo: '',
    role: 'usuario'
  });

  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const carregar = async () => {
    try {
      const res = await axios.get('/admin/usuarios', authHeader);
      setUsuarios(res.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  useEffect(() => { carregar() }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ tipo: '', texto: '' });

    try {
      await axios.post('/admin/usuarios', formData, authHeader);
      setMensagem({ tipo: 'sucesso', texto: 'Usuário criado com sucesso!' });
      setFormData({ login: '', senha: '', nome: '', cargo: '', role: 'usuario' });
      setMostrarForm(false);
      carregar();
    } catch (error: any) {
      const erro = error.response?.data?.erro || 'Erro ao criar usuário';
      setMensagem({ tipo: 'erro', texto: erro });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-8">
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  ⚙️ Administração
                </h1>
                <p className="text-gray-600 mt-2">Gerencie usuários e permissões do sistema</p>
              </div>
              <button
                onClick={() => setMostrarForm(!mostrarForm)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center gap-2"
              >
                {mostrarForm ? '❌ Cancelar' : '➕ Novo Usuário'}
              </button>
            </div>
          </div>

          {/* Mensagens */}
          {mensagem.texto && (
            <div className={`mb-6 p-4 rounded-lg ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
              {mensagem.texto}
            </div>
          )}

          {/* Formulário de Cadastro */}
          {mostrarForm && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                👤 Cadastrar Novo Usuário
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      placeholder="Ex: João Silva"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Login */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Login *
                    </label>
                    <input
                      type="text"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      required
                      placeholder="Ex: joao.silva"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Senha */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Senha *
                    </label>
                    <input
                      type="password"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Cargo */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      placeholder="Ex: Desenvolvedor"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Tipo de Usuário */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Usuário *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="usuario">👤 Usuário</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Salvando...' : '💾 Salvar Usuário'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarForm(false);
                      setFormData({ login: '', senha: '', nome: '', cargo: '', role: 'usuario' });
                      setMensagem({ tipo: '', texto: '' });
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabela de Usuários */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                👥 Usuários Cadastrados ({usuarios.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Login</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cargo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estatísticas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {u.nome.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{u.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.login}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.cargo || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {u.role === 'admin' ? '👑 Admin' : '👤 Usuário'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex gap-4">
                            <span>📊 {u.jornadas?.length || 0} jornadas</span>
                            <span>📈 {u.producoes?.length || 0} produções</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

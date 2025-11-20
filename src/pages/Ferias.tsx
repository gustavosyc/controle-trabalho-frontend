import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import axios from '../api/axios';

export default function Ferias() {
  const [ferias, setFerias] = useState<any[]>([]);
  const [form, setForm] = useState({ inicio:'', fim:'' });
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const carregar = async ()=>{ const res = await axios.get('/ferias', authHeader); setFerias(res.data); };
  useEffect(()=>{ carregar() }, []);

  const enviar = async (e:any)=>{ e.preventDefault(); await axios.post('/ferias', form, authHeader); setForm({ inicio:'', fim:'' }); carregar(); };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Férias</h2>
          <form onSubmit={enviar} className="flex gap-2 mb-4">
            <input type="date" value={form.inicio} onChange={(e)=>setForm({...form, inicio:e.target.value})} className="border p-2"/>
            <input type="date" value={form.fim} onChange={(e)=>setForm({...form, fim:e.target.value})} className="border p-2"/>
            <button className="bg-blue-600 text-white px-4 rounded">Solicitar</button>
          </form>
          <table className="w-full border">
            <thead className="bg-gray-100"><tr><th>Início</th><th>Fim</th></tr></thead>
            <tbody>{ferias.map(f=>(<tr key={f.id}><td>{new Date(f.inicio).toLocaleDateString()}</td><td>{new Date(f.fim).toLocaleDateString()}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

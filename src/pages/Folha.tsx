import React, { useState, useEffect } from 'react';
import Sidebar from '../shared/Sidebar';
import Navbar from '../shared/Navbar';
import axios from '../api/axios';

export default function Folha() {
  const [folhas, setFolhas] = useState<any[]>([]);
  const [form, setForm] = useState({ mes:'', ano:new Date().getFullYear() });
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const carregar = async ()=>{ const res = await axios.get('/folha', authHeader); setFolhas(res.data); };
  useEffect(()=>{ carregar() }, []);

  const enviar = async (e:any)=>{ e.preventDefault(); await axios.post('/folha', form, authHeader); setForm({ mes:'', ano:new Date().getFullYear() }); carregar(); };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Folhas</h2>
          <form onSubmit={enviar} className="flex gap-2 mb-4">
            <input type="text" placeholder="Mês" value={form.mes} onChange={(e)=>setForm({...form, mes:e.target.value})} className="border p-2"/>
            <input type="number" placeholder="Ano" value={form.ano as number} onChange={(e)=>setForm({...form, ano:Number(e.target.value)})} className="border p-2 w-28"/>
            <button className="bg-blue-600 text-white px-4 rounded">Solicitar</button>
          </form>
          <table className="w-full border">
            <thead className="bg-gray-100"><tr><th>Mês</th><th>Ano</th><th>Status</th></tr></thead>
            <tbody>{folhas.map(f=>(<tr key={f.id}><td>{f.mes}</td><td>{f.ano}</td><td>{f.status}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

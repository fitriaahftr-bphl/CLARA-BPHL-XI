import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

export default function App() {
  const [data, setData] = useState([]);
  const [bulan, setBulan] = useState('Januari');
  const [form, setForm] = useState({ kode: '', uraian: '', rka: '', rpd: '', spj: '' });

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(ws);
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const handleAdd = () => {
    const rka = parseFloat(form.rka) || 0;
    const rpd = parseFloat(form.rpd) || 0;
    const spj = parseFloat(form.spj) || 0;
    const totalRealisasi = spj;
    const selisih = rpd - spj;
    const sisaPagu = rka - totalRealisasi;
    let status = 'Aman';
    if (sisaPagu < 0) status = 'Minus';
    else if (sisaPagu > 0 && spj < rpd) status = 'Kurang';

    setData([...data, { ...form, totalRealisasi, selisih, sisaPagu, status }]);
    setForm({ kode: '', uraian: '', rka: '', rpd: '', spj: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aman': return 'bg-green-100 text-green-800';
      case 'Kurang': return 'bg-yellow-100 text-yellow-800';
      case 'Minus': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white text-gray-800 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-pink-600">BPHL</h1>
        <h2 className="text-xl font-semibold">CLARA BPHL XI – Dashboard Pengendalian Anggaran</h2>
        <input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} className="border p-2 rounded" />
      </header>

      <div className="mb-6 flex gap-4 items-center">
        <select value={bulan} onChange={(e) => setBulan(e.target.value)} className="border p-2 rounded">
          {[ 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember' ].map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input placeholder="Kode Akun" value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value })} className="border p-2 rounded" />
        <input placeholder="Uraian" value={form.uraian} onChange={(e) => setForm({ ...form, uraian: e.target.value })} className="border p-2 rounded w-40" />
        <input placeholder="RKA" type="number" value={form.rka} onChange={(e) => setForm({ ...form, rka: e.target.value })} className="border p-2 rounded w-24" />
        <input placeholder="RPD" type="number" value={form.rpd} onChange={(e) => setForm({ ...form, rpd: e.target.value })} className="border p-2 rounded w-24" />
        <input placeholder="SPJ" type="number" value={form.spj} onChange={(e) => setForm({ ...form, spj: e.target.value })} className="border p-2 rounded w-24" />
        <button onClick={handleAdd} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">Tambah</button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow p-4 mb-6">
        <h3 className="font-semibold mb-2 text-pink-600">Grafik Realisasi Bulanan – {bulan}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="uraian" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="rka" fill="#ec4899" name="RKA" />
            <Bar dataKey="rpd" fill="#f9a8d4" name="RPD" />
            <Bar dataKey="spj" fill="#d1d5db" name="SPJ" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full bg-white shadow rounded-2xl overflow-hidden">
        <thead className="bg-pink-100">
          <tr>
            {['Kode', 'Uraian', 'RKA', 'RPD', 'SPJ', 'Total Realisasi', 'Selisih', 'Sisa Pagu', 'Status'].map((h) => (
              <th key={h} className="p-2 text-left text-sm font-semibold text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="p-2 text-sm">{row.kode}</td>
              <td className="p-2 text-sm">{row.uraian}</td>
              <td className="p-2 text-sm">{row.rka}</td>
              <td className="p-2 text-sm">{row.rpd}</td>
              <td className="p-2 text-sm">{row.spj}</td>
              <td className="p-2 text-sm">{row.totalRealisasi}</td>
              <td className="p-2 text-sm">{row.selisih}</td>
              <td className="p-2 text-sm">{row.sisaPagu}</td>
              <td className={`p-2 text-sm font-semibold rounded ${getStatusColor(row.status)}`}>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </motion.table>

      <footer className="mt-8 text-center text-gray-400 text-sm">Created by FTR</footer>
    </div>
  );
}

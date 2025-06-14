// pages/CourseSiswa.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Siswa {
  nama: string;
  esai_title: string;
  status: string;
  skor: string;
  persentase: number;
}


const CourseSiswa: React.FC = () => {
  const { id, esaiId } = useParams<{ id: string; esaiId: string }>();
  const [pesertaList, setPesertaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const res = await fetch(`http://localhost:8000/course/${id}/esai/${esaiId}/siswa`);
        if (!res.ok) throw new Error('Gagal mengambil data siswa');
        const data = await res.json();
        setPesertaList(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPeserta();
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto text-black">
        <button
          className="mb-4 text-teal-600 hover:underline"
          onClick={() => navigate(`/course/${id}`)}
        >
          &larr; Kembali ke Detail Course
        </button>

        <h1 className="text-2xl font-bold mb-4">Daftar Siswa dan Nilai Esai</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : pesertaList.length === 0 ? (
          <p>Belum ada siswa yang mengerjakan esai.</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Nama</th>
                <th className="px-4 py-2 border">Judul Esai</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Skor</th>
                <th className="px-4 py-2 border">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {pesertaList.map((p, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{p.nama}</td>
                  <td className="border px-4 py-2">{p.esai_title}</td>
                  <td className="border px-4 py-2">{p.status}</td>
                  <td className="border px-4 py-2">{p.skor}</td>
                  <td className="border px-4 py-2">{p.persentase}%</td>
                </tr>
              ))}
            </tbody>
            
          </table>
        )}
      </div>
    </div>
  );
};

export default CourseSiswa;
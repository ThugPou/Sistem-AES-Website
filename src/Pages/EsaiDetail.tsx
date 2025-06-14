//pages/EsaiDetail.tsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EsaiInfoSection from '../components/EsaiInfo.tsx';
import Navbar from '../components/Navbar.tsx';
import SoalList from '../components/SoalList.tsx';
import { AuthContext } from '../contexts/AuthContext';
import KerjakanSoalForm from "../components/KerjakanSoalForm";
import HasilPengerjaan from '../components/HasilPengerjaan.tsx';

interface Soal {
  id: number;
  question: string;
  reference_answer: string;
}

const EsaiDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const roleId = auth?.user?.role_id;
  const [esai, setEsai] = useState<any>(null);
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [kerjakan, setKerjakan] = useState(false);
  const [hasil, setHasil] = useState<any[]>([]);

  useEffect(() => {
  const fetchEsai = async () => {
    const res = await fetch(`http://localhost:8000/esai/${id}`);
    const data = await res.json();
    setEsai(data);
  };

  const fetchSoal = async () => {
    const res = await fetch(`http://localhost:8000/soal-esai/by-esai/${id}`);
    const data = await res.json();
    setSoalList(data);
    };
    
    const fetchHasil = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/jawaban-siswa/by-esai/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHasil(data);
      }
    } catch (err) {
      console.error("Gagal fetch hasil:", err);
    }
  };

  fetchEsai();
  fetchSoal();
  fetchHasil();
  }, [id]);

  if (!esai) return <p>Loading...</p>;
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <button
          className="mb-4 text-teal-600 hover:underline"
          onClick={() => navigate(`/course/${esai.course_id}`)}>
          &larr; Kembali ke Course
        </button>
        <EsaiInfoSection esai={esai} />
        {roleId === 1 ? (
  <SoalList esaiId={parseInt(id!)} soalList={soalList} setSoalList={setSoalList} />
) : (
  <div className="mt-6">
    {hasil.length > 0 ? (
      <HasilPengerjaan data={hasil} />
    ) : !kerjakan ? (
      <>
        <h2 className="text-lg font-semibold text-black">Jumlah Soal: {soalList.length}</h2>
        <button
          onClick={() => setKerjakan(true)}
          className="bg-teal-500 text-white px-4 py-2 mt-4 rounded"
        >
          Mulai Kerjakan
        </button>
      </>
    ) : (
      <KerjakanSoalForm listSoal={soalList} durasi={esai.durasi_menit} onSelesai={() => window.location.reload()} />
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default EsaiDetail;
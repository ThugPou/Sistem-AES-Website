//pages/CourseDetail.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EsaiCard from '../components/EsaiCard';
import EsaiFormModal from '../components/EsaiFormModal';
import { AuthContext } from '../contexts/AuthContext';

interface Course {
  id: number;
  name: string;
  enroll_key: string;
  user_id: number;
}

interface Esai {
  id: number;
  title: string;
  description: string;
  durasi_menit: number;
  start_time: string;
  end_time: string
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const roleId = auth?.user?.role_id;

  const [course, setCourse] = useState<Course | null>(null);
  const [esaiList, setEsaiList] = useState<Esai[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editEsaiId, setEditEsaiId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
          title: '',
          description: '',
          durasi_menit: '',
          start_time: '',
          end_time: ''
        });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [courseRes, esaiRes] = await Promise.all([
          fetch(`http://localhost:8000/courses/${id}`),
          fetch(`http://localhost:8000/esai/course/${id}`)
        ]);
      
        if (!courseRes.ok) throw new Error('Failed to fetch course');
        if (!esaiRes.ok) throw new Error('Failed to fetch esai');
      
        const [courseData, esaiData] = await Promise.all([
          courseRes.json(),
          esaiRes.json()
        ]);
      
        setCourse(courseData);
        setEsaiList(esaiData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddClick = () => {
    setFormData({
      title: '',
      description: '',
      durasi_menit: '',
      start_time: '',
      end_time: ''
    });
    setEditEsaiId(null);
    setShowForm(true);
  };

  const handleEditClick = (esaiId: number, initialData: { title: string; description: string }) => {
    setEditEsaiId(esaiId);
    setFormData({
      ...initialData,
      durasi_menit: (initialData as any).durasi_menit || '',
      start_time: (initialData as any).start_time?.slice(0, 16) || '',
      end_time: (initialData as any).end_time?.slice(0, 16) || ''
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    const payload = {
      ...data,
      course_id: Number(id)
    };
  
    try {
      const url = editEsaiId !== null
        ? `http://localhost:8000/esai/${editEsaiId}`
        : 'http://localhost:8000/esai/create';
    
      const method = editEsaiId !== null ? 'PUT' : 'POST';
    
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    
      if (!res.ok) throw new Error('Gagal menyimpan esai');
    
      const result = await res.json();
      if (editEsaiId !== null) {
        setEsaiList(prev => prev.map(e => (e.id === result.id ? result : e)));
      } else {
        setEsaiList(prev => [...prev, result]);
      }
    } catch (err: any) {
      alert(err.message);
    }
  
    setShowForm(false);
  };
  
  const handleDelete = async (esaiId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/esai/${esaiId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus esai');
      setEsaiList(prev => prev.filter(e => e.id !== esaiId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div><Navbar /><p className="p-4">Loading...</p></div>;
  if (error) return <div><Navbar /><p className="p-4 text-red-600">Error: {error}</p></div>;
  if (!course) return <div><Navbar /><p className="p-4">Course not found</p></div>;

  return (
    <div>
      <Navbar />
      <div className="p-4 max-w-4xl mx-auto text-black">
        <button
          className="mb-4 text-teal-500 hover:underline"
          onClick={() => navigate('/dashboard')}
        >
          &larr; Kembali ke Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-4">{course.name}</h1>

        {roleId === 1 && (
          <>
            <button
              className="mb-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
              onClick={handleAddClick}
            >
              Tambah Esai
            </button>
            <EsaiFormModal
              isOpen={showForm}
              onClose={() => setShowForm(false)}
              onSubmit={handleFormSubmit}
              initialData={formData}
              mode={editEsaiId ? 'edit' : 'add'}
            />
          </>
        )}

        <h2 className="text-2xl font-semibold mb-2">Daftar Esai</h2>
        {esaiList.length === 0 ? (
          <p className="text-gray-600">Belum ada esai.</p>
        ) : (
          <div className="space-y-3">
            {esaiList.map(esai => (
              <div key={esai.id}>
                <EsaiCard
                  id={esai.id}
                  title={esai.title}
                  description={esai.description}
                  durasi_menit={esai.durasi_menit}
                  start_time={esai.start_time}
                  end_time={esai.end_time}
                  onDelete={handleDelete}
                  onEditClick={handleEditClick}
                  showMenu={roleId === 1}
                  onClick={() => navigate(`/soal/${esai.id}`)}
                />
                {roleId === 1 && (
                  <button
                    className="mt-2 text-teal-600 hover:underline text-sm"
                    onClick={() => navigate(`/course/${id}/esai/${esai.id}/siswa`)}
                  >
                    Lihat Nilai Siswa
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;

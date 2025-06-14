// pages/dashboard.tsx
import React, { useEffect, useState, useContext } from 'react';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import CourseFormModal from '../components/CourseFormModal';
import { AuthContext } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  name: string;
  enroll_key: string;
  user_id: number;
}

const Dashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  const auth = useContext(AuthContext);
  const userId = auth?.user?.id;
  const roleId = auth?.user?.role_id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8000/courses/user/${userId}`)
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, [userId]);

  const handleAddSubmit = async (formData: { name: string; enroll_key: string }) => {
    try {
      const res = await fetch(`http://localhost:8000/courses/create?pengajar_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: 0, user_id: userId }),
      });

      if (!res.ok) throw new Error('Gagal tambah course');

      const newCourse = await res.json();
      setCourses([...courses, newCourse]);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (formData: { name: string; enroll_key: string }) => {
    if (!editingCourse) return;

    try {
      const res = await fetch(`http://localhost:8000/courses/${editingCourse.id}?pengajar_id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingCourse.id, user_id: userId }),
      });

      if (!res.ok) throw new Error('Gagal edit course');

      const updated = await res.json();
      setCourses(prev => prev.map(c => (c.id === editingCourse.id ? updated : c)));
      setShowEditForm(false);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/courses/${id}?pengajar_id=${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Gagal hapus course');

      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (courseId: number, data: { name: string; enroll_key: string }) => {
    setEditingCourse({ id: courseId, name: data.name, enroll_key: data.enroll_key, user_id: userId! });
    setShowEditForm(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          {roleId === 1 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
            >
              + Tambah Course
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Course Overview</h2>

      {courses.length === 0 ? (
        <p className="text-gray-600">
          {roleId === 1
            ? "Anda belum mempunyai course, buat course baru."
            : "Anda belum mempunyai course, mulai join course."}
        </p>
      ) : (
        <div className="space-y-4">
          {paginatedCourses.map((course) => (
            <CourseCard
              id={course.id}
              title={course.name}
              color="bg-blue-400"
              enrollKey={course.enroll_key}
              onDelete={handleDeleteCourse}
              onEditClick={handleEditClick}
              onClick={() => navigate(`/course/${course.id}`)}
            />
            
          ))}
        </div>
      )}

      {/* Pagination */}
      {courses.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-teal-500 hover:text-white transition duration-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
      </main>

      {/* Modal Tambah Course */}
      <CourseFormModal
        visible={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddSubmit}
        mode="add"
      />

      {/* Modal Edit Course */}
      <CourseFormModal
        visible={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleEditSubmit}
        initialData={
          editingCourse ? { name: editingCourse.name, enroll_key: editingCourse.enroll_key } : undefined
        }
        mode="edit"
      />
    </div>
  );
};

export default Dashboard;
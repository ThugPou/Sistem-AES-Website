// pages/AllCourses.tsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [enrollKeyInput, setEnrollKeyInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetchCourses('');
  }, []);

  const fetchCourses = async (keyword: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/courses/search?keyword=${keyword}`
      );
      setCourses(response.data);
      setCurrentPage(1); // Reset ke halaman pertama saat search
    } catch (error) {
      console.error('Gagal mengambil data course:', error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchCourses(searchTerm);
  };

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setShowModal(true);
    setEnrollKeyInput('');
    setErrorMessage('');
  };

  const handleEnrollSubmit = async () => {
    if (enrollKeyInput === selectedCourse.enroll_key) {
      try {
        const response = await fetch(`http://localhost:8000/courses/enroll`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: auth?.user?.id,
            enroll_key: enrollKeyInput,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          setErrorMessage(data.detail || 'Gagal enroll.');
          return;
        }

        navigate(`/course/${selectedCourse.id}`);
      } catch (error) {
        setErrorMessage('Terjadi kesalahan saat mencoba enroll.');
      }
    } else {
      setErrorMessage('Enroll key salah. Silakan coba lagi.');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);
  const paginatedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-teal-800 mb-6">
          Semua Course
        </h1>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row items-center gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Cari nama course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm text-black"
          />
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          >
            Cari
          </button>
        </form>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <p className="text-gray-600 text-center">
            Tidak ada course ditemukan.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {paginatedCourses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.name}
                  color="bg-blue-400"
                  enrollKey={course.enroll_key}
                  showMenu={false}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                Sebelumnya
              </button>
              <span className="text-gray-700">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                Berikutnya
              </button>
            </div>
          </>
        )}
      </div>

      {/* Enroll Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Masukkan Enroll Key
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Untuk mengakses course{' '}
              <strong>{selectedCourse?.name}</strong>, masukkan enroll key.
            </p>
            <input
              type="text"
              value={enrollKeyInput}
              onChange={(e) => setEnrollKeyInput(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
              placeholder="Enroll key"
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={handleEnrollSubmit}
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourses;

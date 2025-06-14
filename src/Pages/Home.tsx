import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Sistem Penilaian Esai Otomatis
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Evaluasi jawaban esai secara instan dan objektif dengan teknologi pemrosesan bahasa alami. Cocok untuk dosen, guru, dan pengajar lainnya.
          </p>
          <Link
            to="/"
            className="inline-flex items-center bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
          >
            Mulai Sekarang <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} EssayGrade. Semua Hak Dilindungi.
      </footer>
    </div>
  );
};

export default Home;

//components/SoalList.tsx
import { useState } from 'react';
import TambahSoalModal from './TambahSoalModal';
import { FiTrash2, FiMoreVertical, FiX } from 'react-icons/fi';

interface SoalItem {
  id: number;
  question: string;
  reference_answer: string;
}

interface SoalListProps {
  esaiId: number;
  soalList: SoalItem[];
  setSoalList: React.Dispatch<React.SetStateAction<SoalItem[]>>;
}

const SoalList = ({ esaiId, soalList, setSoalList }: SoalListProps) => {
  const [showModal, setShowModal] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [showConfirmId, setShowConfirmId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const res = await fetch(`http://localhost:8000/soal-esai/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setSoalList((prev) => prev.filter((soal) => soal.id !== id));
    } else {
      alert("Gagal menghapus soal");
    }
  };

  const handleMenuClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setMenuOpenId(id);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setShowConfirmId(id);
    setMenuOpenId(null);
  };

  const handleCloseMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmId(null);
  };

  const handleConfirmDelete = (id: number) => {
    handleDelete(id);
    setShowConfirmId(null);
  };

  return (
    <div className="mt-6 text-black">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Daftar Soal</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-500 text-white px-4 py-2 rounded"
        >
          Tambah Soal
        </button>
      </div>

      {soalList.length === 0 ? (
        <p>Belum ada soal.</p>
      ) : (
        <ul className="space-y-2">
          {soalList.map((soal, i) => (
            <li
              key={soal.id}
              className="border p-3 rounded shadow-sm relative bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Soal {i + 1}:</p>
                  <p>{soal.question}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Referensi Jawaban: {soal.reference_answer}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {menuOpenId !== soal.id && (
                    <button
                      onClick={(e) => handleMenuClick(e, soal.id)}
                      className="text-gray-600 hover:text-gray-800 text-xl"
                    >
                      <FiMoreVertical />
                    </button>
                  )}
                  {menuOpenId === soal.id && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleDeleteClick(e, soal.id)}
                        className="text-red-600 hover:text-red-800 text-xl"
                        title="Hapus"
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        onClick={handleCloseMenu}
                        className="text-gray-600 hover:text-gray-800 text-xl"
                        title="Tutup Menu"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {showConfirmId === soal.id && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-400 bg-opacity-50 rounded">
                  <div className="bg-white p-6 rounded shadow-lg w-72">
                    <h3 className="text-md text-black font-semibold mb-2">
                      Yakin ingin menghapus?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tindakan ini tidak bisa dibatalkan.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelDelete}
                        className="px-3 py-1 bg-gray-500 rounded text-white hover:bg-gray-600"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(soal.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <TambahSoalModal
          esaiId={esaiId}
          onClose={() => setShowModal(false)}
          onSoalAdded={(newSoal) => setSoalList((prev) => [...prev, newSoal])}
        />
      )}
    </div>
  );
};

export default SoalList;

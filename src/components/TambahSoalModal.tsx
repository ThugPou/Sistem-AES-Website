//components/TambahSoalModal

import { useState } from 'react';

interface TambahSoalModalProps {
  esaiId: number;
  onClose: () => void;
  onSoalAdded: (newSoal: {
    id: number;
    question: string;
    reference_answer: string;
  }) => void;
}

const TambahSoalModal: React.FC<TambahSoalModalProps> = ({ esaiId, onClose, onSoalAdded }) => {
  const [pertanyaan, setPertanyaan] = useState('');
  const [referensi, setReferensi] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await fetch(`http://localhost:8000/soal-esai/${esaiId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: pertanyaan,
      reference_answer: referensi,
    }),
  });

  if (res.ok) {
    const newSoal = await res.json();
    onSoalAdded(newSoal);
    onClose();
  } else {
    alert("Gagal menambahkan soal");
  }
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 text-black">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Tambah Soal</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            placeholder="Pertanyaan"
            className="w-full p-2 border rounded mb-3"
            required
          />
          <textarea
            value={referensi}
            onChange={(e) => setReferensi(e.target.value)}
            placeholder="Referensi Jawaban"
            className="w-full p-2 border rounded mb-4"
            required
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="text-gray-500">
              Batal
            </button>
            <button type="submit" className="bg-teal-500 text-white px-4 py-1 rounded">
              Tambah
            </button>
          </div>
        </form>
          
      </div>
    </div>
  );
};

export default TambahSoalModal;
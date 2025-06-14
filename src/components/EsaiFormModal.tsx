// components/EsaiFormModal.tsx
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface EsaiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; durasi_menit?: number; start_time?: string | null; end_time?: string | null; }) => void;
  initialData?: { title: string; description: string };
  mode: 'add' | 'edit';
}

const EsaiFormModal: React.FC<EsaiFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durasiMenit, setDurasiMenit] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
  if (initialData) {
    setTitle(initialData.title);
    setDescription(initialData.description);
    setDurasiMenit((initialData as any).durasi_menit || '');
    setStartTime((initialData as any).start_time?.slice(0, 16) || '');
    setEndTime((initialData as any).end_time?.slice(0, 16) || '');
  } else {
    setTitle('');
    setDescription('');
    setDurasiMenit('');
    setStartTime('');
    setEndTime('');
  }
}, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const convertToUTC = (local: string) => {
      return local ? dayjs(local).utc().format() : null;
    };

    onSubmit({
    title,
    description,
    durasi_menit: Number(durasiMenit),
    start_time: convertToUTC(startTime),
    end_time: convertToUTC(endTime),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-30">
      <div className="bg-white rounded p-6 w-96 max-w-full shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{mode === "edit" ? 'Edit Esai' : 'Tambah Esai'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Judul esai"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi esai"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Durasi (menit)</label>
            <input
              type="number"
              min={1}
              value={durasiMenit}
              onChange={(e) => setDurasiMenit(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: 30"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Waktu Mulai</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Waktu Selesai</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              {mode === "edit" ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EsaiFormModal;

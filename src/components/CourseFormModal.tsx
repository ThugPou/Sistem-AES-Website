//CourseFormModal.tsx
import React, { useState, useEffect } from 'react';

interface CourseFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string; enroll_key: string }) => void;
  initialData?: { name: string; enroll_key: string };
  mode: 'add' | 'edit';
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState({ name: '', enroll_key: '' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', enroll_key: '' });
    }
  }, [initialData, visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-black mb-4">
          {mode === 'edit' ? 'Edit Course' : 'Tambah Course'}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nama Course"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded text-black"
          />
          <input
            type="text"
            placeholder="Enroll Key"
            value={formData.enroll_key}
            onChange={(e) => setFormData({ ...formData, enroll_key: e.target.value.slice(0, 6) })}
            required
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded text-black"
          />
          <p className="text-sm text-gray-500 mb-3">Enroll Key hanya dapat berisi maksimal 6 karakter.</p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              {mode === 'edit' ? 'Simpan Perubahan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;

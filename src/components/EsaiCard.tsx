// components/EsaiCard.tsx
import React, { useState, useContext } from 'react';
import { FiEdit2, FiTrash2, FiMoreVertical, FiX } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';

interface EsaiCardProps {
  id: number;
  title: string;
  description: string;
  durasi_menit: number;
  start_time: string | null;
  end_time: string | null;
  onDelete?: (id: number) => void;
  onEditClick?: (esaiId: number, initialData: {
    title: string;
    description: string;
    durasi_menit: number;
    start_time: string | null;
    end_time: string | null;
  }) => void;
  showMenu?: boolean;
  onClick?: () => void;
}

const EsaiCard: React.FC<EsaiCardProps> = ({
  id,
  title,
  description,
  durasi_menit,
  start_time,
  end_time,
  onDelete,
  onEditClick,
  showMenu,
  onClick
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const auth = useContext(AuthContext);

  const isPengajar = auth?.user?.role_id === 1;

  const handleDeleteClick = () => {
    setShowConfirm(true);
    setMenuOpen(false);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // cegah trigger onClick parent
    setMenuOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // cegah trigger onClick parent
    onEditClick?.(id, { title, description, durasi_menit, start_time, end_time });
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // cegah trigger onClick parent
    handleDeleteClick();
  };

  const handleCloseMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // cegah trigger onClick parent
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col p-4 border rounded hover:shadow-md transition-all relative">
      <div className="flex justify-between items-start" onClick={onClick}>
        <div>
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
          <p className="text-sm text-gray-700 mt-2">
            Durasi: {durasi_menit} menit
          </p>
          <p className="text-sm text-gray-700">
            Waktu aktif:{' '}
            {start_time ? new Date(start_time).toLocaleString('id-ID') : 'Belum ditentukan'} –{' '}
            {end_time ? new Date(end_time).toLocaleString('id-ID') : 'Belum ditentukan'}
          </p>
        </div>

        {isPengajar && showMenu !== false && (
          <div className="flex items-center gap-3 ml-4">
            {!menuOpen && (
              <button
                title="Menu"
                onClick={handleMenuClick}
                className="text-gray-600 hover:text-gray-800 text-xl"
              >
                <FiMoreVertical />
              </button>
            )}
            {menuOpen && (
              <div className="flex items-center gap-3">
                <button
                  title="Edit"
                  onClick={handleEditClick}
                  className="text-blue-600 hover:text-blue-800 text-xl"
                >
                  <FiEdit2 />
                </button>
                <button
                  title="Hapus"
                  onClick={handleDeleteButtonClick}
                  className="text-red-600 hover:text-red-800 text-xl"
                >
                  <FiTrash2 />
                </button>
                <button
                  title="Tutup Menu"
                  onClick={handleCloseMenu}
                  className="text-gray-600 hover:text-gray-800 text-xl"
                >
                  <FiX />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirm && showMenu !== false && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-400 bg-opacity-50 rounded">
          <div className="bg-white p-6 rounded shadow-lg w-72">
            <h3 className="text-md text-black font-semibold mb-2">Yakin ingin menghapus?</h3>
            <p className="text-sm text-gray-600 mb-4">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 bg-gray-500 rounded text-white hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                onClick={() => onDelete?.(id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EsaiCard;
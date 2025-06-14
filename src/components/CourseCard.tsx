import React, { useState, useContext } from 'react';
import { FiEdit2, FiTrash2, FiMoreVertical, FiX } from 'react-icons/fi';
import { AuthContext } from '../contexts/AuthContext';

interface CourseCardProps {
  id: number;
  title: string;
  color: string;
  enrollKey: string;
  onDelete?: (id: number) => void;
  onEditClick?: (courseId: number, initialData: { name: string; enroll_key: string }) => void;
  showMenu?: boolean;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  color,
  enrollKey,
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
    e.stopPropagation();
    setMenuOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick?.(id, { name: title, enroll_key: enrollKey });
  };

  const handleDeleteButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteClick();
  };

  const handleCloseMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
  };

  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 cursor-pointer relative"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex-shrink-0`}
            style={{ backgroundColor: color }}
          ></div>
          <div className="flex flex-col">
            <div className="text-lg font-semibold text-black break-words">
              {title}
            </div>
          </div>
        </div>

        {isPengajar && showMenu !== false && (
          <div className="relative">
            <button
              title="Menu"
              onClick={handleMenuClick}
              className="text-gray-600 hover:text-gray-800 text-xl"
            >
              <FiMoreVertical />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-10 w-32"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  title="Edit"
                  onClick={handleEditClick}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiEdit2 className="mr-2" /> Edit
                </button>
                <button
                  title="Hapus"
                  onClick={handleDeleteButtonClick}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FiTrash2 className="mr-2" /> Hapus
                </button>
                <button
                  title="Tutup"
                  onClick={handleCloseMenu}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiX className="mr-2" /> Tutup
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showConfirm && showMenu !== false && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-red-400 bg-opacity-50 rounded-lg"
             onClick={(e) => e.stopPropagation()}>
          <div className="bg-white p-6 rounded shadow-lg w-72">
            <h3 className="text-md text-black font-semibold mb-2">
              Yakin ingin menghapus?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                className="px-3 py-1 bg-gray-500 rounded text-white hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(id);
                }}
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

export default CourseCard;

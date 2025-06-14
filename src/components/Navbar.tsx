//Navbar.tsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Navbar = () => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.user) {
    return <div>Loading...</div>;
  }

  const { user, logout } = auth;

  return (
    <header className="bg-teal-800 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo dan judul */}
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-2xl font-bold hover:underline">
            Sistem Penilaian Esai
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* <Link
            to="/home"
            className="hover:underline hover:text-teal-300 transition"
          >
            Home
          </Link> */}
          <Link
            to="/dashboard"
            className="hover:underline hover:text-teal-300 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/allcourses"
            className="hover:underline hover:text-teal-300 transition"
          >
            Semua Course
          </Link>
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm">{user.username}</span>
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-teal-800 font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { authService } from '@services/auth.service';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          🏨 HotelPro
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/rooms" className="text-gray-700 hover:text-blue-600">Rooms</Link>
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>
              )}
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="btn btn-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="btn btn-outline">Login</Link>
              <Link to="/auth/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from '@pages/HomePage';
import RoomsPage from '@pages/RoomsPage';
import RoomDetailsPage from '@pages/RoomDetailsPage';
import BookingPage from '@pages/BookingPage';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import DashboardPage from '@pages/customer/DashboardPage';
import AdminDashboardPage from '@pages/admin/AdminDashboardPage';

// Components
import Navbar from '@components/layout/Navbar';
import Footer from '@components/layout/Footer';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
          <Route path="/booking/:roomId" element={<BookingPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

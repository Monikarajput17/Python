import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">🏨 HotelPro</h4>
            <p className="text-gray-400">Premium hotel management & booking platform</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-white">Rooms</Link></li>
              <li><Link to="/auth/login" className="hover:text-white">Login</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-4">Contact</h5>
            <p className="text-gray-400">Email: info@hotelpro.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 HotelPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

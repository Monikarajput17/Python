import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="section-title">My Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="text-3xl font-bold text-blue-600">5</div>
            <p className="text-gray-600">Total Bookings</p>
          </div>
          <div className="card p-6">
            <div className="text-3xl font-bold text-green-600">$2,500</div>
            <p className="text-gray-600">Total Spent</p>
          </div>
          <div className="card p-6">
            <div className="text-3xl font-bold text-orange-600">2</div>
            <p className="text-gray-600">Upcoming Bookings</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Booking ID</th>
                  <th className="text-left py-2">Room</th>
                  <th className="text-left py-2">Check-in</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">#HM001</td>
                  <td className="py-2">Deluxe Room</td>
                  <td className="py-2">2026-06-01</td>
                  <td className="py-2"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Confirmed</span></td>
                  <td className="py-2">$500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

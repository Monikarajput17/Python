import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="section-title">Admin Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Revenue', value: '$150,000' },
            { label: 'Total Bookings', value: '125' },
            { label: 'Occupancy Rate', value: '78%' },
            { label: 'Active Customers', value: '450' },
          ].map((stat, i) => (
            <div key={i} className="card p-6">
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <div className="text-3xl font-bold text-blue-600 mt-2">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
            {/* Chart would go here */}
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
            {/* Chart would go here */}
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

import React, { useEffect, useState } from 'react';
import { roomService } from '@services/room.service';
import { Room } from '@types/index';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, [category]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getAllRooms(1, 12, { category: category || undefined });
      setRooms(response.data || []);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['economy', 'standard', 'deluxe', 'luxury', 'suite'];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="section-title">Available Rooms</h1>

        {/* Filters */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-4">
          <button
            onClick={() => setCategory('')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              category === '' ? 'btn btn-primary' : 'btn btn-secondary'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize ${
                category === cat ? 'btn btn-primary' : 'btn btn-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden cursor-pointer hover:shadow-hover"
                onClick={() => navigate(`/rooms/${room.id}`)}
              >
                {/* Room Image */}
                {room.images && room.images.length > 0 && (
                  <img
                    src={room.images[0].url}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">${room.pricePerNight}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded capitalize">
                      {room.category}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>👥 {room.capacity} guests</span>
                    <span>⭐ {room.averageRating.toFixed(1)}</span>
                  </div>

                  <button className="w-full btn btn-primary">View Details</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;

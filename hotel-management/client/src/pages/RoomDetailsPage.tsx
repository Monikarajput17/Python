import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '@services/room.service';
import { Room } from '@types/index';
import toast from 'react-hot-toast';

const RoomDetailsPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) loadRoom();
  }, [roomId]);

  const loadRoom = async () => {
    try {
      setLoading(true);
      if (roomId) {
        const data = await roomService.getRoomById(roomId);
        setRoom(data);
      }
    } catch (error) {
      toast.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!room) return <div className="text-center py-12">Room not found</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <button onClick={() => navigate('/rooms')} className="btn btn-outline mb-6">
          ← Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            {room.images && room.images.length > 0 && (
              <img
                src={room.images[0].url}
                alt={room.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            )}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {room.images?.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-20 object-cover rounded cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{room.name}</h1>
            <p className="text-gray-600 mb-6">{room.description}</p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Category:</span>
                <span className="capitalize">{room.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Capacity:</span>
                <span>{room.capacity} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Price/Night:</span>
                <span className="text-2xl font-bold text-blue-600">${room.pricePerNight}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Rating:</span>
                <span>⭐ {room.averageRating.toFixed(1)} ({room.totalReviews} reviews)</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate(`/booking/${room.id}`)}
              className="w-full btn btn-primary text-lg py-3"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;

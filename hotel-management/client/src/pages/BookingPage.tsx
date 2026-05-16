import React from 'react';
import { useParams } from 'react-router-dom';

const BookingPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="section-title">Complete Your Booking</h1>
        <div className="card p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Check-in Date</label>
                <input type="date" className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-out Date</label>
                <input type="date" className="input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Number of Guests</label>
              <input type="number" min="1" className="input" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Special Requests</label>
              <textarea className="input" rows={4} />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Price:</span>
                <span className="text-blue-600">$XXX</span>
              </div>
            </div>

            <button type="submit" className="w-full btn btn-primary text-lg py-3">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

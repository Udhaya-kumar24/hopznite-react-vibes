import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const BookingManagementTab = ({ bookings, onRebook, onStatusChange }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          {/* Status Tabs */}
          {['pending', 'confirmed', 'completed'].map(status => (
            <Button key={status} variant="outline" className="capitalize" onClick={() => onStatusChange(status)}>{status}</Button>
          ))}
        </div>
        <ul className="divide-y">
          {bookings && bookings.length > 0 ? bookings.map((booking, i) => (
            <li key={i} className="py-2 flex items-center justify-between">
              <div>
                <span className="font-medium">{booking.eventName}</span> <span className="text-sm text-muted-foreground">{booking.date} {booking.time} - {booking.djName}</span>
                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
              </div>
              <div className="flex gap-2">
                {booking.status === 'completed' && <Button size="sm" variant="outline" onClick={() => onRebook(booking)}>Rebook</Button>}
                <Button size="sm" variant="outline">Details</Button>
              </div>
            </li>
          )) : <li className="text-muted-foreground py-2">No bookings found.</li>}
        </ul>
      </CardContent>
    </Card>
  );
};

export default BookingManagementTab; 
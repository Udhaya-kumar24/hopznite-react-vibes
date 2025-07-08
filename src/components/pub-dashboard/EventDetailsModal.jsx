import React from 'react';
import { Button } from '../ui/button';

const EventDetailsModal = ({ open, onClose, event }) => {
  if (!open || !event) return null;
  const dj = event.dj || {};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
        <div className="mb-2 text-muted-foreground">{event.date} • {event.time} • {event.venue}</div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">{dj.avatar || '🎵'}</div>
          <div>
            <div className="font-semibold">{dj.name}</div>
            <div className="text-xs text-muted-foreground">{dj.genre}</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-medium mb-1">Description</div>
          <div className="text-sm text-muted-foreground">{event.description || 'No description provided.'}</div>
        </div>
        <Button className="w-full" variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

export default EventDetailsModal; 
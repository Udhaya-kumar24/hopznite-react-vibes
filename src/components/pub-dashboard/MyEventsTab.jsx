import React, { useState } from 'react';
import { Button } from '../ui/button';
import RateDJModal from './RateDJModal';
import EventDetailsModal from './EventDetailsModal';
import { addReview } from '../../services/api';

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  confirmed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
};
const paymentColors = {
  complete: 'bg-green-100 text-green-800',
  due: 'bg-yellow-100 text-yellow-800',
  pending: 'bg-gray-100 text-gray-800',
};

const MyEventsTab = ({ events = [], onRate, onDetails, onMessage, onCreateEvent }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [showRateModal, setShowRateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleOpenRate = (event) => {
    setSelectedEvent(event);
    setShowRateModal(true);
  };
  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };
  const handleSubmitRating = async ({ rating, review }) => {
    await addReview(selectedEvent.dj?.id || 1, { rating, review, eventId: selectedEvent.id });
    // Optionally update UI or show toast
  };

  const filtered =
    activeTab === 'all'
      ? events
      : events.filter(e =>
          activeTab === 'upcoming'
            ? e.status === 'confirmed' || e.status === 'pending'
            : e.status === 'completed'
        );
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold">My Events</h1>
          <p className="text-muted-foreground">Manage your DJ bookings and rate completed events</p>
        </div>
        <Button className="bg-black text-white" onClick={onCreateEvent}>+ Create Event</Button>
      </div>
      <div className="flex gap-2 mb-4">
        <Button variant={activeTab === 'all' ? 'default' : 'outline'} onClick={() => setActiveTab('all')}>All Events ({events.length})</Button>
        <Button variant={activeTab === 'upcoming' ? 'default' : 'outline'} onClick={() => setActiveTab('upcoming')}>Upcoming ({events.filter(e => e.status === 'confirmed' || e.status === 'pending').length})</Button>
        <Button variant={activeTab === 'completed' ? 'default' : 'outline'} onClick={() => setActiveTab('completed')}>Completed ({events.filter(e => e.status === 'completed').length})</Button>
      </div>
      <div className="space-y-6">
        {filtered.map((event, i) => (
          <div key={i} className="bg-white border rounded-xl p-6 shadow flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">{event.title}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[event.status]}`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</div>
              <div className="text-2xl font-bold ml-4">${event.price}</div>
              <div className="text-xs text-muted-foreground ml-1">Reference Price</div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>📅 {event.date}</span>
              <span>⏰ {event.time} ({event.duration})</span>
              <span>📍 {event.venue}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-muted-foreground">{event.dj?.avatar || <span>🎵</span>}</div>
              <div className="flex-1">
                <div className="font-semibold">{event.dj?.name}</div>
                <div className="text-xs text-muted-foreground">{event.dj?.genre} <span className="ml-2">⭐ {event.dj?.rating} ({event.dj?.reviews})</span></div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentColors[event.paymentStatus]}`}>{event.paymentLabel}</div>
              {event.status === 'completed' && <Button size="sm" className="bg-black text-white" onClick={() => handleOpenRate(event)}>Rate DJ</Button>}
              <Button size="sm" variant="outline" onClick={() => handleOpenDetails(event)}>Details</Button>
              {event.status !== 'completed' && <Button size="sm" variant="outline" onClick={() => onMessage(event)}>Message</Button>}
            </div>
            {event.status === 'completed' && (
              <div className="bg-green-50 text-green-800 rounded p-3 text-sm flex items-center gap-2">
                <span className="font-semibold">✔ Payment Completed:</span> You have successfully paid the DJ directly after the event.
              </div>
            )}
            {event.status !== 'completed' && (
              <div className="bg-blue-50 text-blue-800 rounded p-3 text-sm flex items-center gap-2">
                <span className="font-semibold">💡 Reference Pricing:</span> This is the agreed reference price. You will pay the DJ directly after the event completion.
              </div>
            )}
          </div>
        ))}
      </div>
      <RateDJModal open={showRateModal} onClose={() => setShowRateModal(false)} event={selectedEvent} onSubmit={handleSubmitRating} />
      <EventDetailsModal open={showDetailsModal} onClose={() => setShowDetailsModal(false)} event={selectedEvent} />
    </div>
  );
};

export default MyEventsTab; 
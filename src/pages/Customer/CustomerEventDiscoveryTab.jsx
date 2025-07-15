import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, Image as ImageIcon, Info } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { getEvents } from '@/services/api';

const EVENTS_PER_PAGE = 6;

const CustomerEventDiscoveryTab = () => {
  const [events, setEvents] = useState([]);
  const [eventPage, setEventPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);

  useEffect(() => {
    getEvents().then(res => setEvents(res.data || []));
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setEventLoading(true);
      import('@/services/api').then(api => {
        api.getEventsById(selectedEvent.id).then(res => {
          setEventDetails(res.data);
          setEventLoading(false);
        });
      });
    } else {
      setEventDetails(null);
    }
  }, [selectedEvent]);

  const paginatedEvents = events.slice((eventPage - 1) * EVENTS_PER_PAGE, eventPage * EVENTS_PER_PAGE);
  const totalEventPages = Math.max(1, Math.ceil(events.length / EVENTS_PER_PAGE));

  const renderEventModal = () => (
    <Modal
      open={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      title={eventDetails ? eventDetails.title : 'Event Details'}
      maxWidth="max-w-lg"
    >
      {eventLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading event details...</div>
      ) : eventDetails ? (
        <div className="space-y-4 text-left">
          <div className="flex gap-4 items-center">
            {eventDetails.image ? (
              <img src={eventDetails.image} alt={eventDetails.title} className="w-20 h-20 object-cover rounded-lg border" />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                <Info className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <div className="font-semibold text-xl mb-1">{eventDetails.title}</div>
              <div className="text-muted-foreground mb-1">{eventDetails.date} • {eventDetails.venue}</div>
              <div className="text-xs text-muted-foreground">{eventDetails.genre} • {eventDetails.dj}</div>
              <div className="text-xs text-muted-foreground">Price: ₹{eventDetails.ticketPrice}</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-1">Description</div>
            <div className="text-sm text-muted-foreground">{eventDetails.description}</div>
          </div>
        </div>
      ) : null}
    </Modal>
  );

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginatedEvents.map(event => (
          <div
            key={event.id}
            className="bg-card border border-border rounded-xl p-3 flex flex-col gap-2 shadow-md relative transition-all duration-200 hover:scale-[1.03] hover:shadow-xl group cursor-pointer min-h-[220px]"
          >
            <div className="relative flex justify-center items-center mb-2">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-20 h-20 object-cover rounded-full border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-200"
                />
              ) : (
                <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-full border-4 border-background shadow-lg">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="font-semibold text-base mb-0.5 truncate text-center">{event.title}</div>
            <div className="text-xs text-muted-foreground mb-0.5 truncate text-center">{event.date} • {event.venue}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 justify-center">
              <span>{event.genre}</span>
              <span>•</span>
              <span>{event.dj}</span>
            </div>
            <div className="flex-1" />
            <Button
              size="sm"
              className="w-full mt-2 bg-primary text-white hover:bg-primary/90 transition-all"
              onClick={() => setSelectedEvent(event)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button size="sm" variant="outline" disabled={eventPage === 1} onClick={() => setEventPage(p => Math.max(1, p - 1))}>Prev</Button>
        <span className="text-sm">Page {eventPage} of {totalEventPages}</span>
        <Button size="sm" variant="outline" disabled={eventPage === totalEventPages} onClick={() => setEventPage(p => Math.min(totalEventPages, p + 1))}>Next</Button>
      </div>
      {renderEventModal()}
    </div>
  );
};

export default CustomerEventDiscoveryTab; 
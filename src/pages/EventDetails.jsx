import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Star, ShieldCheck, Ticket } from 'lucide-react';
import GoogleCalendar from '../components/GoogleCalendar';
import GoogleMaps from '../components/GoogleMaps';
import { motion } from 'framer-motion';
import { getEventsById } from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEventsById(id)
      .then(res => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const availableTickets = event.capacity && event.soldTickets
    ? event.capacity - event.soldTickets
    : 0;

  const soldPercentage = event.capacity && event.soldTickets
    ? (event.soldTickets / event.capacity) * 100
    : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading event details...</div>;
  }

  return (
    <div className="bg-background text-foreground">
      {/* Event Hero */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        <img
          src={event.image || '/fallback.jpg'}
          alt={event.title || 'Event'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
          {event.genre && <Badge variant="secondary" className="mb-4 px-2">{event.genre}</Badge>}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title || 'Untitled Event'}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
            <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> {event.date}</div>
            <div className="flex items-center"><Clock className="w-5 h-5 mr-2" /> {event.time}</div>
            <div className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> {event.venue}, {event.location}</div>
          </div>
        </div>
      </div>

      <motion.div className="container mx-auto p-6 md:p-10" variants={containerVariants} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
            <Card>
              <CardHeader><CardTitle>About The Event</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description || 'No description available.'}</p>
              </CardContent>
            </Card>

            {event.dj && (
              <Card>
                <CardHeader><CardTitle>Featuring</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                      <img
                        src={event.dj_img || '/dj-placeholder.jpg'}
                        alt={event.dj}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{event.dj}</h3>
                      <p className="text-muted-foreground">Main Act</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader><CardTitle>What to Expect</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {Array.isArray(event.features) && event.features.length > 0 ? (
                      event.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Star className="w-4 h-4 mr-3 text-yellow-500 fill-yellow-500" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No highlights listed.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Event Information</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between"><span>Age Limit:</span> <span className="font-medium">{event.ageLimit || 'All Ages'}</span></div>
                  <div className="flex justify-between"><span>Dress Code:</span> <span className="font-medium">{event.dressCode || 'None'}</span></div>
                  <div className="flex justify-between"><span>Capacity:</span> <span className="font-medium">{event.capacity ?? 'N/A'}</span></div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div className="lg:sticky top-24 self-start space-y-8" variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="w-6 h-6" /> Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">₹{event.ticketPrice ?? 'N/A'}</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${isNaN(soldPercentage) ? 0 : soldPercentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available: <span className="font-bold text-foreground">{isNaN(availableTickets) ? '0' : availableTickets}</span></span>
                  <span className="text-muted-foreground">Sold: <span className="font-bold text-foreground">{event.soldTickets ?? '0'}</span></span>
                </div>

                <Button className="w-full" size="lg" disabled={availableTickets <= 0}>
                  {availableTickets > 0 ? 'Book Now' : 'Sold Out'}
                </Button>

                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure booking with instant confirmation
                </p>
              </CardContent>
            </Card>

            <GoogleCalendar event={event} />
            <GoogleMaps venue={event.venue} location={event.location} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
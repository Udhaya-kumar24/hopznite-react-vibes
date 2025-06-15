
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Search, Filter, Music } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import { getEvents } from '../services/api';
import { isFuture, isSameWeek, isWeekend } from 'date-fns';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Upcoming');

  const filters = ['All', 'Upcoming', 'This Weekend', 'Trending'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'All') return true;

    const eventDate = new Date(event.date);

    if (activeFilter === 'Upcoming') {
      return isFuture(eventDate) || new Date().toDateString() === eventDate.toDateString();
    }
    if (activeFilter === 'This Weekend') {
      return isWeekend(eventDate) && isSameWeek(eventDate, new Date(), { weekStartsOn: 1 });
    }
    if (activeFilter === 'Trending') {
      return event.status !== 'sold-out';
    }
    return true;
  });

  const EventCardSkeleton = () => (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-2/3 mb-1" />
        <Skeleton className="h-4 w-1/3 mb-3" />
        <div className="flex gap-1 mb-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-10" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <ParticlesBackground />
        
        <motion.div 
          className="min-h-screen bg-background py-16 px-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="mb-8"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="h-6 w-32" />
              </div>

              <motion.div 
                className="flex gap-4 mb-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {filters.map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </motion.div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <EventCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      
      <motion.div 
        className="min-h-screen bg-background py-16 px-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
                <p className="text-muted-foreground">Don't miss out on the hottest events</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    variant={activeFilter === filter ? 'default' : 'outline'}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>

          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              [...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <EventCardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card border border-border overflow-hidden h-full group">
                    <div className="aspect-video bg-muted relative">
                      <Link to={`/events/${event.id}`}>
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </Link>
                      {event.status === 'premium' && (
                        <Badge className="absolute top-3 left-3 bg-yellow-400 text-black z-10">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-foreground mb-2 truncate group-hover:text-primary">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4 mr-2 shrink-0" />
                        <span className="truncate">{event.venue}, {event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4 mr-2 shrink-0" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Music className="w-4 h-4 mr-2 shrink-0" />
                        <span className="truncate">{event.dj}</span>
                      </div>
                      <div className="flex gap-1 mb-3">
                        <Badge variant="secondary">{event.genre}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-lg font-bold text-foreground">₹{event.price}</span>
                        <Button asChild size="sm">
                          <Link to={`/events/${event.id}`}>Book Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {filteredEvents.length === 0 && !loading && (
            <motion.div 
              className="text-center py-12 col-span-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground text-lg">No events found.</p>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Events;

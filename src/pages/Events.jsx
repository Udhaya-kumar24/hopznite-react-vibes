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

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Upcoming');

  const filters = ['Upcoming', 'This Weekend', 'Trending'];

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

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-3xl font-bold text-foreground mb-2">Upcoming Events in Chennai</h1>
                <p className="text-muted-foreground">Don't miss out on the hottest events</p>
              </div>
              <Button variant="outline" className="text-primary hover:text-primary">
                View All Events →
              </Button>
            </div>

            <motion.div 
              className="flex gap-4 mb-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {filters.map((filter, index) => (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    activeFilter === filter ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {filter}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
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
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="overflow-hidden card-hover h-full">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {index === 0 && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900 z-10">
                          Premium
                        </Badge>
                      )}
                      <motion.div 
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Music className="w-8 h-8 text-muted-foreground" />
                      </motion.div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-2">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.venue}, {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.date}, 4:00 PM - 10:00 PM
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Music className="w-3 h-3 mr-1" />
                        DJ Aqua
                      </div>
                      <div className="flex gap-1 mb-3">
                        <Badge variant="secondary" className="text-xs">Beach</Badge>
                        <Badge variant="secondary" className="text-xs">House</Badge>
                        <Badge variant="secondary" className="text-xs">EDM</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">₹{event.price}</span>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="btn-primary">Book Now</Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {filteredEvents.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground">No events found matching your search.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Events;

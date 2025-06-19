import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '../ui/skeleton';
import { MapPin, Calendar, Music } from 'lucide-react';

const UpcomingEventsSection = ({ 
  selectedCity, 
  loading, 
  filteredEvents, 
  eventFilter, 
  setEventFilter, 
  eventFilters, 
  containerVariants, 
  itemVariants 
}) => {
  console.log(eventFilter, '???????????', eventFilters,'>>>>');
  
  return (
    <motion.section 
      className="py-16 px-4 z-10 relative" 
      // initial="hidden" 
      // whileInView="visible" 
      // viewport={{ once: true }} 
      // variants={containerVariants}
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events in {selectedCity}</h2>
            <p className="text-muted-foreground">Don't miss out on the hottest events</p>
          </div>
          <Link to="/events" className="text-primary hover:text-primary/90 font-medium">View All Events →</Link>
        </motion.div>

        <motion.div className="mb-6 space-y-4" variants={itemVariants}>
          <div className="flex gap-4 mb-4">
            {eventFilters.map((filter) => (
              <motion.button 
                key={filter} 
                onClick={() => setEventFilter(filter)} 
                className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                  eventFilter === filter 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-transparent border-border text-foreground hover:bg-accent'
                }`} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
          variants={containerVariants}
        >
          {loading ? (
            [...Array(5)].map((_, i) => <motion.div key={i} variants={itemVariants}><CardSkeleton /></motion.div>)
          ) : (
            filteredEvents.length > 0 ? (
              filteredEvents.slice(0, 5).map((event) => (
                <motion.div 
                  key={event.id} 
                  variants={itemVariants} 
                  whileHover={{ y: -5 }} 
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card border-border overflow-hidden h-full group flex flex-col">
                    <div className="aspect-video bg-muted relative">
                      <Link to={`/events/${event.id}`}>
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {event.status === 'premium' && (
                        <Badge className="absolute top-3 left-3 bg-yellow-400 text-black z-10">Premium</Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold text-card-foreground mb-2 truncate group-hover:text-primary">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4 mr-2 shrink-0" /> 
                        <span className="truncate">{event.venue}, {event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <Calendar className="w-4 h-4 mr-2 shrink-0" /> 
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {event.time}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Music className="w-4 h-4 mr-2 shrink-0" /> 
                        <span className="truncate">{event.dj}</span>
                      </div>
                      <div className="flex gap-1 mb-3">
                        <Badge variant="secondary">{event.genre}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-2">
                        {/* <span className="text-lg font-bold text-foreground">₹{event.price}</span> */}
                          <Link to={`/events/${event.id}`} className="w-full">
                            <Button size="sm" className="w-full">
                              View More
                            </Button>
                          </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No events found matching your criteria.</p>
              </div>
            )
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default UpcomingEventsSection; 
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardSkeleton } from '../ui/skeleton';
import { MapPin, Star, Calendar } from 'lucide-react';

const TopRestoBarsSection = ({ 
  selectedCity, 
  loading, 
  filteredVenues, 
  containerVariants, 
  itemVariants 
}) => {
  return (
    <motion.section 
      className="py-16 px-4 bg-muted/40 z-10 relative" 
      // initial="hidden" 
      // whileInView="visible" 
      // viewport={{ once: true }} 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      // variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Top Resto Bars in {selectedCity}</h2>
            <p className="text-muted-foreground">Discover the best venues for your night out</p>
          </div>
          <Link to="/venues" className="text-primary hover:text-primary/90 font-medium">View All Venues →</Link>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
          variants={containerVariants}
        >
          {loading ? (
            [...Array(5)].map((_, i) => <motion.div key={i} variants={itemVariants}><CardSkeleton /></motion.div>)
          ) : (
            filteredVenues.slice(0, 5).map((venue) => (
              <motion.div 
                key={venue.id} 
                variants={itemVariants} 
                whileHover={{ y: -5 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-card border-border overflow-hidden h-full">
                  <div className="aspect-video bg-muted relative">
                    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover"/>
                    <Badge className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />{venue.rating}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-card-foreground mb-1">{venue.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3 mr-1" />{venue.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3 mr-1" />3 upcoming events
                    </div>
                    <Badge variant="secondary" className="mb-3">{venue.type}</Badge>
                    <div className="flex gap-2">
                      <Link to={`/venues/${venue.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">View Venue</Button>
                      </Link>
                      <Button size="sm" className="w-full flex-1">See Events</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
          {filteredVenues.length === 0 && !loading && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No venues found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TopRestoBarsSection; 
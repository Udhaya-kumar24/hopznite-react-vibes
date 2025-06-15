import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Star } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import { getDJList } from '../services/api';

const DJs = () => {
  const [djs, setDjs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const genres = ['House', 'EDM', 'Techno', 'Hip Hop', 'R&B', 'Bollywood', 'Commercial', 'Progressive', 'Trance', 'Psy-Trance', 'Drum & Bass', 'Jungle', 'Deep House', 'Melodic', 'World Music', 'Fusion', 'Electro', 'Synthwave'];

  useEffect(() => {
    const fetchDJs = async () => {
      try {
        const response = await getDJList();
        if (response.success) {
          setDjs(response.data);
        }
      } catch (error) {
        console.error('Error fetching DJs:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500); // Simulate loading time
      }
    };

    fetchDJs();
  }, []);

  const filteredDJs = djs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dj.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenres.length === 0 || selectedGenres.some(genre => 
      dj.genre.toLowerCase().includes(genre.toLowerCase())
    );
    
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && dj.available) ||
                               (availabilityFilter === 'busy' && !dj.available);
    
    return matchesSearch && matchesGenre && matchesAvailability;
  });

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

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

  const DJCardSkeleton = () => (
    <Card className="dj-card">
      <div className="text-center">
        <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
        <Skeleton className="h-6 w-16 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto mb-1" />
        <div className="flex justify-center mb-2">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex gap-1 justify-center mb-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-10" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96 mb-6" />
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="flex gap-2 mb-4">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 8).map((genre, i) => (
                <Skeleton key={i} className="h-8 w-16" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <DJCardSkeleton key={i} />
            ))}
          </div>
        </div>
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
            <motion.div 
              className="flex justify-between items-center mb-6"
              variants={itemVariants}
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Top DJs in Chennai</h1>
                <p className="text-muted-foreground">Book the best talent for your next event</p>
              </div>
              <Button variant="outline" className="text-primary hover:text-primary">
                View All DJs →
              </Button>
            </motion.div>
            
            {/* Search and filters with animations */}
            <motion.div 
              className="flex flex-col md:flex-row gap-4 mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search DJs by name, genre, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </motion.div>
            </motion.div>

            {/* Availability filters with animations */}
            <motion.div 
              className="flex gap-2 mb-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {['all', 'available', 'busy'].map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setAvailabilityFilter(filter)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    availabilityFilter === filter ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter === 'all' ? 'All' : filter === 'available' ? 'Available' : 'Busy'}
                </motion.button>
              ))}
            </motion.div>

            {/* Genre filters with animations */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {genres.map((genre, index) => (
                <motion.button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1 text-sm rounded-lg border transition-all duration-200 ${
                    selectedGenres.includes(genre) ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {genre}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              [...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <DJCardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredDJs.map((dj, index) => (
                <motion.div
                  key={dj.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="dj-card h-full">
                    <div className="text-center">
                      <motion.div 
                        className="dj-avatar"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <img src={dj.image} alt={dj.name} className="w-full h-full object-cover rounded-full" />
                      </motion.div>
                      <Badge className={`status-badge mb-2 ${dj.available ? 'status-available' : 'status-busy'}`}>
                        {dj.available ? 'Available' : 'Busy'}
                      </Badge>
                      <h3 className="font-semibold text-foreground mb-1">{dj.name}</h3>
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">{dj.rating}</span>
                      </div>
                      <div className="flex gap-1 justify-center mb-3 flex-wrap">
                        {(dj.genres || [dj.genre]).slice(0, 2).map((g) => <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>)}
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link to={`/djs/${dj.id}`}>
                          <Button variant="outline" size="sm" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                            View Profile
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {filteredDJs.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground">No DJs found matching your criteria.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenres([]);
                    setAvailabilityFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DJs;

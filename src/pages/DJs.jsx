import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Star, ChevronDown, ChevronUp, X, Music, Clock, MapPin } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import { getDJList, getDJFilterOptions } from '../services/api';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/ui/pagination';

const DJs = () => {
  const location = useLocation();
  const filtersLoadedRef = useRef(false);
  const [djs, setDjs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [locationFilter, setLocationFilter] = useState('');
  const [filtersRestored, setFiltersRestored] = useState(false);
  
  // Simple filter data
  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    locations: [],
    availability: []
  });

  // Save filters to localStorage whenever they change
  const saveFilters = (filters) => {
    try {
      localStorage.setItem('dj-filters', JSON.stringify(filters));
      console.log('Filters successfully saved to localStorage:', filters);
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
  };

  // Load filters from localStorage
  const loadFilters = () => {
    if (filtersLoadedRef.current) return; // Only load once
    
    // Clear filters from other pages when entering DJs page
    localStorage.removeItem('event-filters');
    localStorage.removeItem('venue-filters');
    
    const saved = localStorage.getItem('dj-filters');
    if (saved) {
      try {
        const filters = JSON.parse(saved);
        setSearchTerm(filters.searchTerm || '');
        setSelectedGenres(filters.selectedGenres || []);
        setAvailabilityFilter(filters.availabilityFilter || 'all');
        setPriceRange(filters.priceRange || [0, 50000]);
        setLocationFilter(filters.locationFilter || '');
        setShowFilters(filters.showFilters || false);
        setFiltersRestored(true);
        console.log('DJ filters restored:', filters);
      } catch (error) {
        console.error('Error loading saved DJ filters:', error);
      }
    }
    
    // Always set this to true after attempting to load (whether filters were found or not)
    filtersLoadedRef.current = true;
  };

  // Save filters whenever any filter changes (but not on initial load)
  useEffect(() => {
    // Only save if we've loaded filters and the component is ready
    if (filtersLoadedRef.current && !loading) {
      const filters = {
        searchTerm,
        selectedGenres,
        availabilityFilter,
        priceRange,
        locationFilter,
        showFilters
      };
      saveFilters(filters);
      console.log('DJ filters saved:', filters);
    }
  }, [searchTerm, selectedGenres, availabilityFilter, priceRange, locationFilter, showFilters, loading]);

  useEffect(() => {
    // Load saved filters immediately
    loadFilters();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch DJs and filter options
        const [djResponse, filterResponse] = await Promise.all([
          getDJList(),
          getDJFilterOptions()
        ]);
        
        if (djResponse.success) {
          setDjs(djResponse.data);
        }
        
        if (filterResponse.success) {
          setFilterOptions(filterResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchData();
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
    
    const matchesLocation = !locationFilter || dj.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesPrice = dj.price >= priceRange[0] && dj.price <= priceRange[1];
    
    return matchesSearch && matchesGenre && matchesAvailability && matchesLocation && matchesPrice;
  });

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedDJs,
    goToPage,
    resetPagination,
    startIndex,
    endIndex,
    totalItems: totalDJs
  } = usePagination(filteredDJs, 25);

  // Reset pagination when filters change
  useEffect(() => {
    if (filtersRestored) {
      resetPagination();
    }
  }, [searchTerm, selectedGenres, availabilityFilter, priceRange, locationFilter, filtersRestored, resetPagination]);

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedGenres([]);
    setAvailabilityFilter('all');
    setLocationFilter('');
    setPriceRange([0, 50000]);
    setShowFilters(false);
    setFiltersRestored(false);
    filtersLoadedRef.current = false;
    resetPagination();
    // Clear saved filters from localStorage
    localStorage.removeItem('dj-filters');
  };

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    selectedGenres.length,
    availabilityFilter !== 'all' ? 1 : 0,
    locationFilter ? 1 : 0,
    priceRange[0] > 0 || priceRange[1] < 50000 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

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
              {Array.from({ length: 8 }).map((_, i) => (
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
            </motion.div>
            
            {/* Enhanced Search and Filter Bar */}
            <motion.div 
              className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-4 mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search DJs by name, genre, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>
                
                {/* Filter Toggle Button */}
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {activeFiltersCount}
                        </Badge>
                      )}
                      {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </motion.div>
                  
                  {activeFiltersCount > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        onClick={clearAllFilters}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Clear
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Filters Restored Indicator */}
              {filtersRestored && activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-xs text-muted-foreground flex items-center gap-2"
                >
                  <span>✓</span>
                  <span>Filters restored from previous session</span>
                </motion.div>
              )}

              {/* Collapsible Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border mt-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Availability Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Availability</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {filterOptions.availability.map((filter) => (
                              <motion.button
                                key={filter}
                                onClick={() => setAvailabilityFilter(filter)}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                  availabilityFilter === filter 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {filter === 'all' ? 'All' : filter === 'available' ? 'Available' : 'Busy'}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Location</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {filterOptions.locations.map((location) => (
                              <motion.button
                                key={location}
                                onClick={() => {
                                  const newLocation = locationFilter === location ? '' : location;
                                  setLocationFilter(newLocation);
                                  // Manually save filters after location change
                                  setTimeout(() => {
                                    const currentFilters = {
                                      searchTerm,
                                      selectedGenres,
                                      availabilityFilter,
                                      priceRange,
                                      locationFilter: newLocation,
                                      showFilters
                                    };
                                    saveFilters(currentFilters);
                                    console.log('Location filter manually saved:', currentFilters);
                                  }, 100);
                                }}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                  locationFilter === location 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {location}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-primary font-semibold">₹</span>
                            <h3 className="font-semibold text-sm">Price Range</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span>₹{priceRange[0].toLocaleString()}</span>
                              <span>-</span>
                              <span>₹{priceRange[1].toLocaleString()}</span>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                className="text-xs"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Active Filters Summary */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm">Active Filters</h3>
                          <div className="space-y-2">
                            {searchTerm && (
                              <Badge variant="secondary" className="text-xs">
                                Search: {searchTerm}
                              </Badge>
                            )}
                            {selectedGenres.map(genre => (
                              <Badge key={genre} variant="secondary" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                            {availabilityFilter !== 'all' && (
                              <Badge variant="secondary" className="text-xs">
                                {availabilityFilter}
                              </Badge>
                            )}
                            {locationFilter && (
                              <Badge variant="secondary" className="text-xs">
                                {locationFilter}
                              </Badge>
                            )}
                            {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                              <Badge variant="secondary" className="text-xs">
                                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Genre Filters */}
                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Music className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-sm">Genres</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filterOptions.genres.map((genre, index) => (
                            <motion.button
                              key={genre}
                              onClick={() => handleGenreToggle(genre)}
                              className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                selectedGenres.includes(genre) 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.02 }}
                            >
                              {genre}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              paginatedDJs.map((dj, index) => (
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

          {/* Pagination */}
          {!loading && filteredDJs.length > 0 && (
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalDJs}
              />
            </motion.div>
          )}

          {filteredDJs.length === 0 && !loading && (
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
                  onClick={clearAllFilters}
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

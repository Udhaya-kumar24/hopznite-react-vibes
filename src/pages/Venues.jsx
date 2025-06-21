import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Search, Filter, Star, ChevronDown, ChevronUp, X, Clock, Music } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import { getVenues, getVenueFilterOptions } from '../services/api';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/ui/pagination';

const Venues = () => {
  const location = useLocation();
  const filtersLoadedRef = useRef(false);
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [filtersRestored, setFiltersRestored] = useState(false);
  
  // Dynamic filter data
  const [filterOptions, setFilterOptions] = useState({
    types: [],
    locations: [],
    priceRanges: [],
    ratings: []
  });

  // Save filters to localStorage whenever they change
  const saveFilters = (filters) => {
    try {
      localStorage.setItem('venue-filters', JSON.stringify(filters));
      console.log('Venue filters successfully saved to localStorage:', filters);
    } catch (error) {
      console.error('Error saving venue filters to localStorage:', error);
    }
  };

  // Load filters from localStorage
  const loadFilters = () => {
    if (filtersLoadedRef.current) return; // Only load once
    
    // Clear filters from other pages when entering Venues page
    localStorage.removeItem('dj-filters');
    localStorage.removeItem('event-filters');
    
    const saved = localStorage.getItem('venue-filters');
    if (saved) {
      try {
        const filters = JSON.parse(saved);
        setSearchTerm(filters.searchTerm || '');
        setSelectedTypes(filters.selectedTypes || []);
        setLocationFilter(filters.locationFilter || '');
        setPriceRangeFilter(filters.priceRangeFilter || '');
        setRatingFilter(filters.ratingFilter || '');
        setShowFilters(filters.showFilters || false);
        setFiltersRestored(true);
        console.log('Venue filters restored:', filters);
      } catch (error) {
        console.error('Error loading saved venue filters:', error);
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
        selectedTypes,
        locationFilter,
        priceRangeFilter,
        ratingFilter,
        showFilters
      };
      saveFilters(filters);
      console.log('Venue filters saved:', filters);
    }
  }, [searchTerm, selectedTypes, locationFilter, priceRangeFilter, ratingFilter, showFilters, loading]);

  useEffect(() => {
    // Load saved filters immediately
    loadFilters();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch venues and filter options
        const [venuesResponse, filterResponse] = await Promise.all([
          getVenues(),
          getVenueFilterOptions()
        ]);
        
        if (venuesResponse.success) {
          setVenues(venuesResponse.data);
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

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setLocationFilter('');
    setPriceRangeFilter('');
    setRatingFilter('');
    setShowFilters(false);
    setFiltersRestored(false);
    filtersLoadedRef.current = false;
    localStorage.removeItem('venue-filters');
  };

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    selectedTypes.length,
    locationFilter ? 1 : 0,
    priceRangeFilter ? 1 : 0,
    ratingFilter ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedTypes.length === 0 || 
                       selectedTypes.some(type => venue.type?.toLowerCase().includes(type.toLowerCase()));
    
    const matchesLocation = !locationFilter || venue.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesRating = !ratingFilter || venue.rating >= parseFloat(ratingFilter);
    
    // Simple price range matching (you can enhance this based on your venue data structure)
    const matchesPrice = !priceRangeFilter || true; // Placeholder - implement based on your price data

    return matchesSearch && matchesType && matchesLocation && matchesRating && matchesPrice;
  });

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedVenues,
    goToPage,
    resetPagination,
    startIndex,
    endIndex,
    totalItems: totalVenues
  } = usePagination(filteredVenues, 25);

  // Reset pagination when filters change
  useEffect(() => {
    if (filtersRestored) {
      resetPagination();
    }
  }, [searchTerm, selectedTypes, locationFilter, priceRangeFilter, ratingFilter, filtersRestored, resetPagination]);

  const VenueCardSkeleton = () => (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
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
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-5 w-96 mb-6" />
              
              <div className="flex flex-col md:flex-row gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-32" />
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-5 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <VenueCardSkeleton />
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
            <h1 className="text-3xl font-bold text-foreground mb-4">Top Resto Bars in Chennai</h1>
            <p className="text-muted-foreground mb-6">Discover the best venues for your night out</p>
            
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
                    placeholder="Search venues by name or location..."
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
                        
                        {/* Venue Type Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Venue Type</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {filterOptions.types.map((type) => (
                              <motion.button
                                key={type}
                                onClick={() => handleTypeToggle(type)}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                  selectedTypes.includes(type) 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {type}
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
                                      selectedTypes,
                                      locationFilter: newLocation,
                                      priceRangeFilter,
                                      ratingFilter,
                                      showFilters
                                    };
                                    saveFilters(currentFilters);
                                    console.log('Venue location filter manually saved:', currentFilters);
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

                        {/* Rating Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Rating</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {filterOptions.ratings.map((rating) => (
                              <motion.button
                                key={rating}
                                onClick={() => setRatingFilter(ratingFilter === rating ? '' : rating)}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                  ratingFilter === rating 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {rating}
                              </motion.button>
                            ))}
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
                            {selectedTypes.map(type => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {locationFilter && (
                              <Badge variant="secondary" className="text-xs">
                                {locationFilter}
                              </Badge>
                            )}
                            {ratingFilter && (
                              <Badge variant="secondary" className="text-xs">
                                {ratingFilter}
                              </Badge>
                            )}
                            {priceRangeFilter && (
                              <Badge variant="secondary" className="text-xs">
                                {priceRangeFilter}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  <VenueCardSkeleton />
                </motion.div>
              ))
            ) : (
              paginatedVenues.map((venue, index) => (
                <motion.div
                  key={venue.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="overflow-hidden card-hover h-full">
                    <div className="aspect-video bg-muted relative">
                      <Badge className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        {venue.rating}
                      </Badge>
                      <motion.div 
                        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Music className="w-8 h-8 text-muted-foreground" />
                      </motion.div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-1">{venue.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {venue.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Clock className="w-3 h-3 mr-1" />
                        3 upcoming events
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        Rooftop Bar & Lounge
                      </Badge>
                      <div className="flex gap-2">
                        <Link to={`/venues/${venue.id}`} className="flex-1">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="w-full btn-primary">
                              View Venue
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {!loading && filteredVenues.length > 0 && (
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
                totalItems={totalVenues}
              />
            </motion.div>
          )}

          {filteredVenues.length === 0 && !loading && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-muted-foreground">No venues found matching your search.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Venues;

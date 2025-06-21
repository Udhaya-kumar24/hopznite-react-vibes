import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Search, Filter, Music, ChevronDown, ChevronUp, X, Clock, Star } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import { getEvents, getEventFilterOptions } from '../services/api';
import { isFuture, isSameWeek, isWeekend } from 'date-fns';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/ui/pagination';

const Events = () => {
  const location = useLocation();
  const filtersLoadedRef = useRef(false);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filtersRestored, setFiltersRestored] = useState(false);
  
  // Dynamic filter data
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    locations: [],
    priceRanges: [],
    status: []
  });

  // Save filters to localStorage whenever they change
  const saveFilters = (filters) => {
    try {
      localStorage.setItem('event-filters', JSON.stringify(filters));
      console.log('Event filters successfully saved to localStorage:', filters);
    } catch (error) {
      console.error('Error saving event filters to localStorage:', error);
    }
  };

  // Load filters from localStorage
  const loadFilters = () => {
    if (filtersLoadedRef.current) return; // Only load once
    
    // Clear filters from other pages when entering Events page
    localStorage.removeItem('dj-filters');
    localStorage.removeItem('venue-filters');
    
    const saved = localStorage.getItem('event-filters');
    if (saved) {
      try {
        const filters = JSON.parse(saved);
        setSearchTerm(filters.searchTerm || '');
        setSelectedCategories(filters.selectedCategories || []);
        setLocationFilter(filters.locationFilter || '');
        setPriceRangeFilter(filters.priceRangeFilter || '');
        setStatusFilter(filters.statusFilter || 'all');
        setShowFilters(filters.showFilters || false);
        setFiltersRestored(true);
        console.log('Event filters restored:', filters);
      } catch (error) {
        console.error('Error loading saved event filters:', error);
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
        selectedCategories,
        locationFilter,
        priceRangeFilter,
        statusFilter,
        showFilters
      };
      saveFilters(filters);
      console.log('Event filters saved:', filters);
    }
  }, [searchTerm, selectedCategories, locationFilter, priceRangeFilter, statusFilter, showFilters, loading]);

  useEffect(() => {
    // Load saved filters immediately
    loadFilters();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch events and filter options
        const [eventsResponse, filterResponse] = await Promise.all([
          getEvents(),
          getEventFilterOptions()
        ]);
        
        if (eventsResponse.success) {
          setEvents(eventsResponse.data);
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

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setLocationFilter('');
    setPriceRangeFilter('');
    setStatusFilter('all');
    setShowFilters(false);
    setFiltersRestored(false);
    filtersLoadedRef.current = false;
    resetPagination();
    localStorage.removeItem('event-filters');
  };

  const activeFiltersCount = [
    searchTerm ? 1 : 0,
    selectedCategories.length,
    locationFilter ? 1 : 0,
    priceRangeFilter ? 1 : 0,
    statusFilter !== 'all' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const matchesCategory = selectedCategories.length === 0 || 
                           selectedCategories.some(category => {
                             if (category === 'All') return true;
                             if (category === 'Upcoming') return isFuture(new Date(event.date));
                             if (category === 'This Weekend') return isWeekend(new Date(event.date)) && isSameWeek(new Date(event.date), new Date(), { weekStartsOn: 1 });
                             if (category === 'Trending') return event.status !== 'sold-out';
                             return event.category?.toLowerCase().includes(category.toLowerCase());
                           });

    const matchesLocation = !locationFilter || event.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    // Simple price range matching (you can enhance this based on your event data structure)
    const matchesPrice = !priceRangeFilter || true; // Placeholder - implement based on your price data

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus && matchesPrice;
  });

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedEvents,
    goToPage,
    resetPagination,
    startIndex,
    endIndex,
    totalItems: totalEvents
  } = usePagination(filteredEvents, 25);

  // Reset pagination when filters change
  useEffect(() => {
    if (filtersRestored) {
      resetPagination();
    }
  }, [searchTerm, selectedCategories, locationFilter, priceRangeFilter, statusFilter, filtersRestored, resetPagination]);

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
                {Array.from({ length: 4 }).map((_, i) => (
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
                    placeholder="Search events, venues..."
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
                        
                        {/* Category Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Categories</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {filterOptions.categories.map((category) => (
                              <motion.button
                                key={category}
                                onClick={() => handleCategoryToggle(category)}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                  selectedCategories.includes(category) 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {category}
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
                                      selectedCategories,
                                      locationFilter: newLocation,
                                      priceRangeFilter,
                                      statusFilter,
                                      showFilters
                                    };
                                    saveFilters(currentFilters);
                                    console.log('Event location filter manually saved:', currentFilters);
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

                        {/* Status Filter */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm">Status</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {filterOptions.status.map((status) => (
                              <motion.button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                                  statusFilter === status 
                                    ? 'bg-primary text-primary-foreground border-primary' 
                                    : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {status === 'all' ? 'All' : status}
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
                            {selectedCategories.map(category => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {locationFilter && (
                              <Badge variant="secondary" className="text-xs">
                                {locationFilter}
                              </Badge>
                            )}
                            {statusFilter !== 'all' && (
                              <Badge variant="secondary" className="text-xs">
                                {statusFilter}
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
              paginatedEvents.map((event, index) => (
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
                        <Button size="sm" className="w-full">
                          <Link to={`/events/${event.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination */}
          {!loading && filteredEvents.length > 0 && (
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
                totalItems={totalEvents}
              />
            </motion.div>
          )}

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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import ParticlesBackground from '../components/ParticlesBackground';
import { getDJList, getEvents, getVenues } from '../services/api';
import DJCard from '../components/DJCard';
import { MapPin, Star, Calendar, Clock, Users, Music } from 'lucide-react';
import { isFuture, isToday, isWeekend } from 'date-fns';
import HeroCarousel from '../components/home/HeroCarousel'
import TopDJsSection from '../components/home/TopDJsSection';
import TopRestoBarsSection from '../components/home/TopRestoBarsSection';
import UpcomingEventsSection from '../components/home/UpcomingEventsSection';
import EventManagementSection from '../components/home/EventManagementSection';
import WhyChooseSection from '../components/home/WhyChooseSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';
import { fetchFilterCountries } from '../services/api';

const Home = () => {
  const [filterList, setFilterList] = useState({});
  const [featuredDJs, setFeaturedDJs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [djSearchTerm, setDjSearchTerm] = useState('');
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [eventFilter, setEventFilter] = useState('Upcoming');
  const [loading, setLoading] = useState(true);

  const eventFilters = ['All', 'Upcoming', 'This Weekend', 'Trending'];

  useEffect(() => {
    fetchFilterCountries()
      .then(res => {
        setFilterList(res.data);
        const countries = Object.keys(res.data);
        if (countries.length > 0) {
          setSelectedCountry(countries[0]);
          if (Array.isArray(res.data[countries[0]]) && res.data[countries[0]].length > 0) {
            setSelectedCity(res.data[countries[0]][0].value);
          }
        }
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedCountry && filterList[selectedCountry]) {
      setSelectedCity(filterList[selectedCountry][0]?.value || '');
    }
  }, [selectedCountry, filterList]);

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      setLoading(true);
      try {
        const [djResponse, eventsResponse, venuesResponse] = await Promise.all([
          getDJList(),
          getEvents(),
          getVenues()
        ]);
        
        if (djResponse.success) {
          setFeaturedDJs(djResponse.data);
        }
        
        if (eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data);
        }

        if (venuesResponse.success) {
          setTopVenues(venuesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchFeaturedContent();
  }, [selectedCity]);

  // Filter functions
  const filteredDJs = featuredDJs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(djSearchTerm.toLowerCase()) ||
                         (dj.genres || [dj.genre]).some(g => g.toLowerCase().includes(djSearchTerm.toLowerCase()));
    const matchesGenre = selectedGenre === 'all' || (dj.genres || [dj.genre]).some(g => g.toLowerCase() === selectedGenre.toLowerCase());
    const matchesAvailability = selectedAvailability === 'all' || 
                               (selectedAvailability === 'available' && dj.available) ||
                               (selectedAvailability === 'busy' && !dj.available);
    const matchesCity = selectedCity === 'all' || !selectedCity || dj.location === selectedCity;
    return matchesSearch && matchesGenre && matchesAvailability && matchesCity;
  });

  const filteredVenues = topVenues.filter(venue =>
    (venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(venueSearchTerm.toLowerCase())) &&
    (selectedCity === 'all' || !selectedCity || venue.location.includes(selectedCity))
  );

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = (event.title.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(eventSearchTerm.toLowerCase())) &&
                           (selectedCity === 'all' || !selectedCity || event.location === selectedCity);
    
    if (!matchesSearch) {
      return false;
    }

    if (eventFilter === 'All') {
      return true;
    }

    const eventDate = new Date(event.date);
    if (isNaN(eventDate.getTime())) {
      return false; 
    }

    if (eventFilter === 'Upcoming') {
      return isFuture(eventDate) || isToday(eventDate);
    }
    
    if (eventFilter === 'This Weekend') {
      // Show only events on Saturday or Sunday, and include today if today is a weekend
      const day = eventDate.getDay(); // 0=Sunday, 6=Saturday
      const isWeekendEvent = day === 6 || day === 0;
      return isWeekendEvent && (isFuture(eventDate) || isToday(eventDate));
    }
    
    if (eventFilter === 'Trending') {
      return event.status !== 'sold-out';
    }
    
    return false;
  });

  // Animation variants
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

  const CardSkeleton = ({ className = "" }) => (
    <Card className={`overflow-hidden bg-card/80 border border-border ${className}`}>
      <div className="aspect-video">
        <Skeleton className="w-full h-full bg-muted" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 bg-muted" />
        <Skeleton className="h-4 w-1/2 mb-1 bg-muted" />
        <Skeleton className="h-4 w-2/3 mb-3 bg-muted" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 bg-muted" />
        </div>
      </CardContent>
    </Card>
  );

  const carouselItems = [...upcomingEvents.slice(0, 5), ...topVenues.slice(0, 5)];

  return (
    <div className="min-h-screen bg-background/70 text-foreground relative backdrop-blur-sm">
      <ParticlesBackground />
      
      {/* Header Section with Location */}
      <motion.section 
        className="bg-background/80 backdrop-blur-sm border-b border-border py-3 sticky top-16 z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">Location:</span>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-36 h-9 bg-background/80 backdrop-blur-sm border-border/40 text-foreground rounded-lg hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-border/40 rounded-lg shadow-lg p-1 min-w-[8rem]">
              {
                Object.keys(filterList).map(country => (
                  <SelectItem 
                    key={country}
                    value={country} 
                    className="relative flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer select-none outline-none hover:bg-accent/30 hover:text-primary data-[highlighted]:bg-accent/30 data-[highlighted]:text-primary data-[state=checked]:bg-accent/30 data-[state=checked]:text-primary"
                  >
                    {country}
                  </SelectItem>
                ))
              }
              </SelectContent>
            </Select>


            <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedCountry || !Array.isArray(filterList[selectedCountry])}>
              <SelectTrigger className="w-36 h-9 bg-background/80 backdrop-blur-sm border-border/40 text-foreground rounded-lg hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-border/40 rounded-lg shadow-lg p-1 min-w-[8rem]">
                {Array.isArray(filterList[selectedCountry]) &&
                  filterList[selectedCountry].map((city) => (
                    <SelectItem 
                      key={city.value}
                      value={city.value}
                      className="relative flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer select-none outline-none hover:bg-accent/30 hover:text-primary data-[highlighted]:bg-accent/30 data-[highlighted]:text-primary data-[state=checked]:bg-accent/30 data-[state=checked]:text-primary"
                    >
                      {city.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-4">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-muted-foreground text-sm">Loading data...</span>
                </div>
              ) : (
                <>
                  <span className="text-muted-foreground text-sm">
                    Showing results for {selectedCity}, {selectedCountry}
                  </span>
                  {filteredDJs.length === 0 && filteredVenues.length === 0 && filteredEvents.length === 0 && (
                    <span className="text-destructive text-sm font-medium">
                      • No data available
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hero Section */}
      <HeroCarousel carouselItems={carouselItems}/>
      
      {/* Top DJs Section */}
      <TopDJsSection 
        selectedCity={selectedCity}
        loading={loading}
        filteredDJs={filteredDJs}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />

      
      {/* Top Resto Bars Section */}
      <TopRestoBarsSection 
        selectedCity={selectedCity}
        loading={loading}
        filteredVenues={filteredVenues}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      
      {/* Upcoming Events Section */}
      <UpcomingEventsSection 
        selectedCity={selectedCity}
        loading={loading}
        filteredEvents={filteredEvents}
        eventFilter={eventFilter}
        setEventFilter={setEventFilter}
        eventFilters={eventFilters}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      
      {/* Event Management Section */}
      <EventManagementSection 
        selectedCity={selectedCity}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      
      {/* Why Choose Section */}
      <WhyChooseSection 
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      
      {/* Testimonials Section */}
      <TestimonialsSection 
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      
      {/* Contact Section */}
      <ContactSection 
        containerVariants={containerVariants}
        itemVariants={itemVariants}
      />
      
    </div>
  );
};

export default Home;

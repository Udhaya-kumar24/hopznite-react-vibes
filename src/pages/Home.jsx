import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import ParticlesBackground from '../components/ParticlesBackground';
import { getDJList, getEvents, getVenues } from '../services/api';
import DJCard from '../components/DJCard';
import { MapPin, Star, Calendar, Clock, Users, FileText, Globe, Music, Search, Filter } from 'lucide-react';
import { isFuture, isToday, isWeekend } from 'date-fns';
import HeroCarousel from '../components/home/HeroCarousel'
import TopDJsSection from '../components/home/TopDJsSection';
import TopRestoBarsSection from '../components/home/TopRestoBarsSection';
import UpcomingEventsSection from '../components/home/UpcomingEventsSection';
import EventManagementSection from '../components/home/EventManagementSection';
import WhyChooseSection from '../components/home/WhyChooseSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';

const Home = () => {
  const [featuredDJs, setFeaturedDJs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [djSearchTerm, setDjSearchTerm] = useState('');
  const [venueSearchTerm, setVenueSearchTerm] = useState('');
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [eventFilter, setEventFilter] = useState('Upcoming');
  const [loading, setLoading] = useState(true);

  const carouselPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  const genres = ['all', 'House', 'EDM', 'Techno', 'Hip Hop', 'R&B', 'Bollywood'];
  const eventFilters = ['All', 'Upcoming', 'This Weekend', 'Trending'];

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
    if (isNaN(eventDate.getTime())) { // Invalid date
      return false; 
    }

    if (eventFilter === 'Upcoming') {
      return isFuture(eventDate) || isToday(eventDate);
    }
    
    if (eventFilter === 'This Weekend') {
      // Show only upcoming weekend events
      return isWeekend(eventDate) && isFuture(eventDate);
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
        className="bg-background/80 backdrop-blur-sm border-b border-border py-3 sticky top-0 z-20"
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
                <SelectItem 
                  value="India" 
                  className="relative flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer select-none outline-none hover:bg-accent/30 hover:text-primary data-[highlighted]:bg-accent/30 data-[highlighted]:text-primary data-[state=checked]:bg-accent/30 data-[state=checked]:text-primary"
                >
                  India
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-36 h-9 bg-background/80 backdrop-blur-sm border-border/40 text-foreground rounded-lg hover:bg-accent/30 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-border/40 rounded-lg shadow-lg p-1 min-w-[8rem]">
                {[
                  { value: "Chennai", label: "Chennai" },
                  { value: "Mumbai", label: "Mumbai" },
                  { value: "Delhi", label: "Delhi" },
                  { value: "Bangalore", label: "Bangalore" },
                  { value: "Hyderabad", label: "Hyderabad" }
                ].map((city) => (
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

      {/* For theme/genre selection */}
            <div className="flex gap-4 mb-4">
              {eventFilters.map((filter) => (
          <motion.button 
            key={filter} 
            onClick={() => setEventFilter(filter)} 
            className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
              eventFilter === filter 
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20' 
                : 'bg-background/80 backdrop-blur-sm border-border/40 text-foreground hover:bg-accent/30 hover:border-accent/50'
            }`} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
          >
            {filter}
          </motion.button>
              ))}
            </div>
    </div>
  );
};

export default Home;

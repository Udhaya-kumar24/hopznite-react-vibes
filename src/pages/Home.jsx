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
import { MapPin, Star, Calendar, Clock, Users, FileText, Globe, Music, Search, Filter } from 'lucide-react';

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

  const carouselPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  const genres = ['all', 'House', 'EDM', 'Techno', 'Hip Hop', 'R&B', 'Bollywood'];
  const eventFilters = ['Upcoming', 'This Weekend', 'Trending'];

  useEffect(() => {
    const fetchFeaturedContent = async () => {
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
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchFeaturedContent();
  }, []);

  // Filter functions
  const filteredDJs = featuredDJs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(djSearchTerm.toLowerCase()) ||
                         dj.genre.toLowerCase().includes(djSearchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || dj.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    const matchesAvailability = selectedAvailability === 'all' || 
                               (selectedAvailability === 'available' && dj.available) ||
                               (selectedAvailability === 'busy' && !dj.available);
    const matchesCity = selectedCity === 'all' || dj.location === selectedCity;
    return matchesSearch && matchesGenre && matchesAvailability && matchesCity;
  });

  const filteredVenues = topVenues.filter(venue =>
    venue.name.toLowerCase().includes(venueSearchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(venueSearchTerm.toLowerCase())
  );

  const filteredEvents = upcomingEvents.filter(event =>
    event.title.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(eventSearchTerm.toLowerCase())
  );

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
    <Card className={`overflow-hidden ${className}`}>
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  );

  const carouselItems = [...upcomingEvents.slice(0, 5), ...topVenues.slice(0, 5)];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticlesBackground />
      
      {/* Header Section with Location */}
      <motion.section 
        className="bg-card border-b border-border py-4 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-foreground" />
              <span className="text-foreground">Location:</span>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="India">India</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
              </SelectContent>
            </Select>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button>Update Location</Button>
            </motion.div>
            <span className="text-muted-foreground ml-4">
              Showing results for {selectedCity}, {selectedCountry}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Hero Section */}
      <motion.section 
        className="relative bg-muted/30 py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto">
          <Carousel
            plugins={[carouselPlugin.current]}
            className="w-full"
            onMouseEnter={carouselPlugin.current.stop}
            onMouseLeave={carouselPlugin.current.reset}
          >
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="bg-card/80 backdrop-blur-sm">
                      <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
                        <div className="flex-1 mb-4 md:mb-0">
                          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                            {item.title ? 'Upcoming Event' : 'Top Venue'}
                          </Badge>
                          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-4">
                            {item.title || item.name}
                          </h1>
                          <div className="flex items-center gap-2 text-muted-foreground mb-6">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                              {item.title ? 'Book Now' : 'Explore Venue'}
                            </Button>
                          </motion.div>
                        </div>
                        <motion.div 
                          className="w-full md:w-96 h-64 bg-muted rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.02, rotateY: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                            <Music className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </motion.section>

      {/* Section 2: Top DJs with Filters */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-8"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top DJs in Chennai</h2>
              <p className="text-muted-foreground">Book the best talent for your next event</p>
            </div>
            <Link to="/djs" className="text-primary hover:text-primary/80 font-medium">
              View All DJs →
            </Link>
          </motion.div>
          
          {/* DJ Filters */}
          <motion.div 
            className="mb-6 space-y-4"
            variants={itemVariants}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search DJs..."
                  value={djSearchTerm}
                  onChange={(e) => setDjSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>
                      {genre === 'all' ? 'All Genres' : genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            variants={containerVariants}
          >
            {loading ? (
              [...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <CardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredDJs.slice(0, 10).map((dj, index) => (
                <motion.div
                  key={dj.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card border border-border text-center p-4 h-full">
                    <motion.div 
                      className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-2xl font-bold text-foreground">{dj.name.charAt(0)}</span>
                    </motion.div>
                    <Badge className={`mb-2 ${dj.available ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                      {dj.available ? 'Available' : 'Busy'}
                    </Badge>
                    <h3 className="font-semibold text-foreground mb-1">{dj.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground ml-1">{dj.rating}</span>
                    </div>
                    <div className="flex gap-1 justify-center mb-3">
                      <Badge variant="secondary" className="text-xs">{dj.genre}</Badge>
                      <Badge variant="secondary" className="text-xs">EDM</Badge>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Top Resto Bars with Filters */}
      <motion.section 
        className="py-16 px-4 bg-muted/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-8"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top Resto Bars in Chennai</h2>
              <p className="text-muted-foreground">Discover the best venues for your night out</p>
            </div>
            <Link to="/venues" className="text-primary hover:text-primary/80 font-medium">
              View All Venues →
            </Link>
          </motion.div>

          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search venues..."
                value={venueSearchTerm}
                onChange={(e) => setVenueSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            variants={containerVariants}
          >
            {loading ? (
              [...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <CardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredVenues.slice(0, 10).map((venue, index) => (
                <motion.div
                  key={venue.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card border border-border overflow-hidden h-full">
                    <div className="aspect-video bg-muted relative">
                      <Badge className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        {venue.rating}
                      </Badge>
                      <motion.div 
                        className="w-full h-full flex items-center justify-center"
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
                        <Calendar className="w-3 h-3 mr-1" />
                        3 upcoming events
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        Rooftop Bar & Lounge
                      </Badge>
                      <div className="flex gap-2">
                        <Link to={`/venues/${venue.id}`} className="flex-1">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="w-full">
                              View Venue
                            </Button>
                          </motion.div>
                        </Link>
                        <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="sm" className="w-full btn-primary">
                            See Events
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 4: Upcoming Events with Filters */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-8"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events in Chennai</h2>
              <p className="text-muted-foreground">Don't miss out on the hottest events</p>
            </div>
            <Link to="/events" className="text-primary hover:text-primary/80 font-medium">
              View All Events →
            </Link>
          </motion.div>

          <motion.div 
            className="mb-6 space-y-4"
            variants={itemVariants}
          >
            <div className="flex gap-4 mb-4">
              {eventFilters.map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setEventFilter(filter)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                    eventFilter === filter 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'bg-transparent border-border text-muted-foreground hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={eventSearchTerm}
                onChange={(e) => setEventSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            variants={containerVariants}
          >
            {loading ? (
              [...Array(10)].map((_, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <CardSkeleton />
                </motion.div>
              ))
            ) : (
              filteredEvents.slice(0, 10).map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-card border border-border overflow-hidden h-full">
                    <div className="aspect-video bg-muted relative">
                      {index === 0 && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">
                          Premium
                        </Badge>
                      )}
                      <motion.div 
                        className="w-full h-full flex items-center justify-center"
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
                          <Button size="sm">Book Now</Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 5: Top Event Management Companies */}
      <motion.section 
        className="py-16 px-4 bg-muted/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-8"
            variants={itemVariants}
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top Event Management Companies</h2>
              <p className="text-muted-foreground">Professional event planners in Chennai</p>
            </div>
            <Link to="/companies" className="text-primary hover:text-primary/80 font-medium">
              View All Companies →
            </Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {[
              { name: 'EventPro', rating: 4.8, description: 'Full-service event management for corporate and private events', events: '120 events organized', avatar: 'E' },
              { name: 'Celebration Masters', rating: 4.7, description: 'Specializing in weddings and large-scale celebrations', events: '85 events organized', avatar: 'C' },
              { name: 'NightLife Events', rating: 4.9, description: 'Experts in club events and music festivals', events: '150 events organized', avatar: 'N' },
              { name: 'Corporate Connect', rating: 4.6, description: 'Business conferences and corporate entertainment', events: '95 events organized', avatar: 'C' }
            ].map((company, index) => (
              <motion.div key={company.name} variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-card border border-border p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground font-bold">{company.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{company.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-muted-foreground ml-1">{company.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    {company.events}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 6: Why Choose Hopznite */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 className="text-3xl font-bold text-foreground mb-4" variants={itemVariants}>
            Why Choose Hopznite
          </motion.h2>
          <motion.p className="text-muted-foreground mb-12" variants={itemVariants}>
            The ultimate platform connecting DJs, venues, and music lovers across the globe
          </motion.p>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Top Talent</h3>
              <p className="text-muted-foreground">
                Access to the best DJs and venues, all vetted and rated by our community
              </p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Seamless Booking</h3>
              <p className="text-muted-foreground">
                Easy-to-use platform for finding and booking events or talent with just a few clicks
              </p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Global Community</h3>
              <p className="text-muted-foreground">
                Join a worldwide network of music enthusiasts, professionals, and venues
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 7: Testimonials */}
      <motion.section 
        className="py-16 px-4 bg-muted/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl font-bold text-foreground text-center mb-4" variants={itemVariants}>
            What Our Users Say
          </motion.h2>
          <motion.p className="text-center text-muted-foreground mb-12" variants={itemVariants}>
            Hear from the people who use Hopznite every day
          </motion.p>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
            {[
              {
                name: "Rahul Kumar",
                role: "DJ",
                rating: 5,
                text: "Hopznite has transformed my career as a DJ. I'm getting more bookings than ever, and the platform makes it easy to manage my schedule and connect with venues."
              },
              {
                name: "Sanjay Patel", 
                role: "Venue Owner",
                rating: 5,
                text: "Finding the right DJ for our events used to be a nightmare. With Hopznite, we can browse profiles, check availability, and book instantly. It's been a game-changer for our business."
              },
              {
                name: "Priya Gupta",
                role: "Customer", 
                rating: 5,
                text: "The premium membership is worth every penny. I get access to exclusive events and can book my favorite DJs directly. Hopznite has completely changed how I discover and enjoy music events."
              }
            ].map((testimonial, index) => (
              <motion.div key={testimonial.name} className="bg-card border border-border p-6 h-full" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-foreground font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 8: Get in Touch */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about Hopznite? We're here to help. Reach out to our team for support, 
                partnership inquiries, or feedback.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  <span className="text-foreground">123 Music Street, Chennai, India</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary mr-3" />
                  <span className="text-foreground">Monday - Friday: 9am - 6pm</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button>Contact Us</Button>
                <Button variant="outline">Support</Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card border border-border p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Input placeholder="Your email" type="email" required />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <Textarea placeholder="Your message" rows={4} required />
                </div>
                <Button className="w-full">Send Message</Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

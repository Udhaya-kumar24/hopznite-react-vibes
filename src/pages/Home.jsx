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
import { isFuture, isSameWeek, isWeekend } from 'date-fns';

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
    
    if (!matchesSearch) return false;

    if (eventFilter === 'All') {
      return true;
    }

    const eventDate = new Date(event.date);

    if (eventFilter === 'Upcoming') {
      // Check if the event date is in the future or today
      return isFuture(eventDate) || new Date().toDateString() === eventDate.toDateString();
    }
    if (eventFilter === 'This Weekend') {
      return isWeekend(eventDate) && isSameWeek(eventDate, new Date(), { weekStartsOn: 1 });
    }
    if (eventFilter === 'Trending') {
      // Simple logic for trending: could be based on status or a specific flag
      return event.status !== 'sold-out';
    }
    
    return true;
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
    <Card className={`overflow-hidden bg-gray-900/50 border border-gray-800 ${className}`}>
      <div className="aspect-video">
        <Skeleton className="w-full h-full bg-gray-800" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
        <Skeleton className="h-4 w-1/2 mb-1 bg-gray-700" />
        <Skeleton className="h-4 w-2/3 mb-3 bg-gray-700" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1 bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );

  const carouselItems = [...upcomingEvents.slice(0, 5), ...topVenues.slice(0, 5)];

  const HomeFooter = () => (
    <motion.footer className="bg-black text-gray-400 py-12 px-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center"><Music className="mr-2" /> Hopznite</h3>
            <p className="pr-8">Connecting the global entertainment industry.</p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-white">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">Facebook</a></li>
            </ul>
          </motion.div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Hopznite. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );


  return (
    <div className="min-h-screen bg-black text-gray-300 relative">
      <ParticlesBackground />
      
      {/* Header Section with Location */}
      <motion.section 
        className="bg-black border-b border-gray-800 py-3 sticky top-0 z-20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-white">Location:</span>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                 <SelectItem value="Hyderabad">Hyderabad</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground ml-4">
              Showing results for {selectedCity}, {selectedCountry}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Hero Section */}
      <motion.section 
        className="relative bg-black h-[70vh] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Carousel
          plugins={[carouselPlugin.current]}
          className="w-full h-full"
          onMouseEnter={carouselPlugin.current.stop}
          onMouseLeave={carouselPlugin.current.reset}
        >
          <CarouselContent className="h-full">
            {carouselItems.map((item, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative w-full h-full text-white">
                   <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover"/>
                   <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                   <div className="absolute inset-0 flex flex-col justify-center items-start w-full h-full">
                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <motion.div 
                          className="max-w-xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        >
                          <Badge className="mb-4 bg-white/20 text-white border-white/20 backdrop-blur-sm py-2 px-4 rounded-full font-medium">
                            {item.title ? `Event - ${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Top Venue'}
                          </Badge>
                          <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                            {item.title || item.name}
                          </h1>
                          <div className="flex items-center gap-2 text-gray-300 mb-6">
                            <MapPin className="w-5 h-5" />
                            <span>{item.location}</span>
                          </div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" asChild className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3 text-base font-semibold">
                               <Link to={item.title ? `/events/${item.id}` : `/venues/${item.id}`}>Explore {item.title ? 'Event' : 'Venue'}</Link>
                            </Button>
                          </motion.div>
                        </motion.div>
                     </div>
                   </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-4 bg-black/30 border-none text-white hover:bg-black/50" />
          <CarouselNext className="hidden md:flex right-4 bg-black/30 border-none text-white hover:bg-black/50" />
        </Carousel>
      </motion.section>

      {/* Section 2: Top DJs with Filters */}
      <motion.section 
        className="py-16 px-4 z-10 relative"
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Top DJs in {selectedCity}</h2>
              <p className="text-gray-400">Book the best talent for your next event</p>
            </div>
            <Link to="/djs" className="text-white hover:text-gray-300 font-medium">View All DJs →</Link>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            variants={containerVariants}
          >
            {loading ? (
              [...Array(10)].map((_, i) => <motion.div key={i} variants={itemVariants}><CardSkeleton /></motion.div>)
            ) : (
              filteredDJs.slice(0, 10).map((dj) => (
                <motion.div key={dj.id} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-gray-900/50 border border-gray-800 text-center p-4 h-full group overflow-hidden">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                       <motion.img src={dj.image} alt={dj.name} className="w-full h-full rounded-full object-cover" whileHover={{ scale: 1.1 }} />
                       <Badge className={`absolute -bottom-1 right-0 text-xs ${dj.available ? 'bg-green-500' : 'bg-gray-500'}`}>{dj.available ? 'Available' : 'Busy'}</Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{dj.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-400 ml-1">{dj.rating}</span>
                    </div>
                    <div className="flex gap-1 justify-center mb-3 flex-wrap">
                      {(dj.genres || [dj.genre]).slice(0, 2).map((g) => <Badge key={g} variant="secondary" className="text-xs bg-gray-700 text-gray-300">{g}</Badge>)}
                    </div>
                    <Link to={`/djs/${dj.id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full bg-transparent border-gray-600 hover:bg-white hover:text-black transition-all duration-200">View Profile</Button>
                    </Link>
                  </Card>
                </motion.div>
              ))
            )}
            {filteredDJs.length === 0 && !loading && (
                <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">No DJs found matching your criteria.</p>
                </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Top Resto Bars */}
      <motion.section className="py-16 px-4 bg-black z-10 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
           <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Top Resto Bars in {selectedCity}</h2>
              <p className="text-gray-400">Discover the best venues for your night out</p>
            </div>
            <Link to="/venues" className="text-white hover:text-gray-300 font-medium">View All Venues →</Link>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" variants={containerVariants}>
            {loading ? (
              [...Array(5)].map((_, i) => <motion.div key={i} variants={itemVariants}><CardSkeleton /></motion.div>)
            ) : (
              filteredVenues.slice(0, 5).map((venue) => (
                <motion.div key={venue.id} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="bg-gray-900/50 border border-gray-800 overflow-hidden h-full">
                    <div className="aspect-video bg-gray-800 relative">
                       <img src={venue.image} alt={venue.name} className="w-full h-full object-cover"/>
                       <Badge className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"><Star className="w-3 h-3 mr-1" />{venue.rating}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1">{venue.name}</h3>
                      <div className="flex items-center text-sm text-gray-400 mb-2"><MapPin className="w-3 h-3 mr-1" />{venue.location}</div>
                      <div className="flex items-center text-sm text-gray-400 mb-3"><Calendar className="w-3 h-3 mr-1" />3 upcoming events</div>
                      <Badge variant="secondary" className="mb-3 bg-gray-700 text-gray-300">{venue.type}</Badge>
                      <div className="flex gap-2">
                        <Link to={`/venues/${venue.id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full bg-transparent border-gray-600 hover:bg-white hover:text-black">View Venue</Button></Link>
                        <Button size="sm" className="w-full flex-1">See Events</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
            {filteredVenues.length === 0 && !loading && (
                <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">No venues found matching your criteria.</p>
                </div>
            )}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Section 4: Upcoming Events with Filters */}
      <motion.section className="py-16 px-4 z-10 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Upcoming Events in {selectedCity}</h2>
              <p className="text-gray-400">Don't miss out on the hottest events</p>
            </div>
            <Link to="/events" className="text-white hover:text-gray-300 font-medium">View All Events →</Link>
          </motion.div>

          <motion.div className="mb-6 space-y-4" variants={itemVariants}>
            <div className="flex gap-4 mb-4">
              {eventFilters.map((filter) => (
                <motion.button key={filter} onClick={() => setEventFilter(filter)} className={`px-4 py-2 rounded-lg border transition-all duration-200 ${eventFilter === filter ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-gray-600 text-gray-300 hover:border-white/50'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{filter}</motion.button>
              ))}
            </div>
          </motion.div>
          
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" variants={containerVariants}>
            {loading ? (
              [...Array(5)].map((_, i) => <motion.div key={i} variants={itemVariants}><CardSkeleton /></motion.div>)
            ) : (
              filteredEvents.length > 0 ? (
                filteredEvents.slice(0, 5).map((event) => (
                  <motion.div key={event.id} variants={itemVariants} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="bg-gray-900/50 border border-gray-800 overflow-hidden h-full group flex flex-col">
                      <div className="aspect-video bg-gray-800 relative">
                        <Link to={`/events/${event.id}`}>
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                        </Link>
                        {event.status === 'premium' && <Badge className="absolute top-3 left-3 bg-yellow-400 text-black z-10">Premium</Badge>}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-white mb-2 truncate group-hover:text-primary">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-400 mb-1"><MapPin className="w-4 h-4 mr-2 shrink-0" /> <span className="truncate">{event.venue}, {event.location}</span></div>
                        <div className="flex items-center text-sm text-gray-400 mb-1"><Calendar className="w-4 h-4 mr-2 shrink-0" /> <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {event.time}</span></div>
                        <div className="flex items-center text-sm text-gray-400 mb-3"><Music className="w-4 h-4 mr-2 shrink-0" /> <span className="truncate">{event.dj}</span></div>
                        <div className="flex gap-1 mb-3"><Badge variant="secondary" className="bg-gray-700 text-gray-300">{event.genre}</Badge></div>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <span className="text-lg font-bold text-white">₹{event.price}</span>
                          <Button asChild size="sm" className="bg-white text-black hover:bg-gray-200">
                            <Link to={`/events/${event.id}`}>Book Now</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                    <p className="text-gray-400">No events found matching your criteria.</p>
                </div>
              )
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 5: Top Event Management Companies */}
      <motion.section className="py-16 px-4 bg-black z-10 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
           <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Top Event Management Companies</h2>
              <p className="text-gray-400">Professional event planners in {selectedCity}</p>
            </div>
            <Link to="/companies" className="text-white hover:text-gray-300 font-medium">View All Companies →</Link>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6" variants={containerVariants}>
            {[
              { name: 'EventPro', rating: 4.8, description: 'Full-service event management for corporate and private events', events: '120 events organized', avatar: 'E' },
              { name: 'Celebration Masters', rating: 4.7, description: 'Specializing in weddings and large-scale celebrations', events: '85 events organized', avatar: 'C' },
              { name: 'NightLife Events', rating: 4.9, description: 'Experts in club events and music festivals', events: '150 events organized', avatar: 'N' },
              { name: 'Corporate Connect', rating: 4.6, description: 'Business conferences and corporate entertainment', events: '95 events organized', avatar: 'C' },
              { name: 'Gala Planners', rating: 4.8, description: 'High-end galas and charity events.', events: '70 events organized', avatar: 'G' }
            ].map((company, index) => (
              <motion.div key={company.name} variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="bg-gray-900/50 border border-gray-800 p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mr-3"><span className="text-white font-bold">{company.avatar}</span></div>
                    <div>
                      <h3 className="font-semibold text-white">{company.name}</h3>
                      <div className="flex items-center"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm text-gray-400 ml-1">{company.rating}</span></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{company.description}</p>
                  <div className="flex items-center text-sm text-gray-400 mb-4"><Calendar className="w-3 h-3 mr-1" />{company.events}</div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent border-gray-600 hover:bg-white hover:text-black">View Profile</Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 6: Why Choose Hopznite */}
      <motion.section className="py-16 px-4 bg-black z-10 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 className="text-3xl font-bold text-white mb-4" variants={itemVariants}>Why Choose Hopznite</motion.h2>
          <motion.p className="text-gray-400 mb-12" variants={itemVariants}>The ultimate platform connecting DJs, venues, and music lovers across the globe</motion.p>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><Music className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Top Talent</h3>
              <p className="text-gray-400">Access to the best DJs and venues, all vetted and rated by our community</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Seamless Booking</h3>
              <p className="text-gray-400">Easy-to-use platform for finding and booking events or talent with just a few clicks</p>
            </motion.div>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Community</h3>
              <p className="text-gray-400">Join a worldwide network of music enthusiasts, professionals, and venues</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 7: Testimonials */}
       <motion.section className="py-16 px-4 bg-black z-10 relative" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl font-bold text-white text-center mb-4" variants={itemVariants}>What Our Users Say</motion.h2>
          <motion.p className="text-center text-gray-400 mb-12" variants={itemVariants}>Hear from the people who use Hopznite every day</motion.p>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants}>
            {[
              { name: "Rahul Kumar", role: "DJ", rating: 5, text: "Hopznite has transformed my career as a DJ. I'm getting more bookings than ever, and the platform makes it easy to manage my schedule and connect with venues." },
              { name: "Sanjay Patel", role: "Venue Owner", rating: 5, text: "Finding the right DJ for our events used to be a nightmare. With Hopznite, we can browse profiles, check availability, and book instantly. It's been a game-changer for our business." },
              { name: "Priya Gupta", role: "Customer", rating: 5, text: "The premium membership is worth every penny. I get access to exclusive events and can book my favorite DJs directly. Hopznite has completely changed how I discover and enjoy music events." }
            ].map((testimonial, index) => (
              <motion.div key={testimonial.name} className="bg-gray-900/50 border border-gray-800 p-6 h-full" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-3"><span className="text-white font-bold">{testimonial.name.charAt(0)}</span></div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <div className="flex">{[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{testimonial.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section 8: Get in Touch */}
      <motion.section className="py-16 px-4 z-10 relative bg-black" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-gray-400 mb-8">Have questions about Hopznite? We're here to help. Reach out to our team for support, partnership inquiries, or feedback.</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center"><MapPin className="w-5 h-5 text-white mr-3" /><span className="text-gray-300">123 Music Street, Chennai, India</span></div>
                <div className="flex items-center"><Clock className="w-5 h-5 text-white mr-3" /><span className="text-gray-300">Monday - Friday: 9am - 6pm</span></div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black">Contact Us</Button>
                <Button variant="secondary" className="bg-gray-800 text-white hover:bg-gray-700">Support</Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gray-900/50 border border-gray-800 p-8">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <Input id="name" placeholder="Your name" required className="bg-gray-800 border-gray-700 text-white" />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <Input id="email" placeholder="Your email" type="email" required className="bg-gray-800 border-gray-700 text-white" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <Input id="subject" placeholder="Subject" required className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                      <Textarea id="message" placeholder="Your message" rows={4} required className="bg-gray-800 border-gray-700 text-white" />
                    </div>
                  <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 py-3">Send Message</Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <HomeFooter />
    </div>
  );
};

export default Home;

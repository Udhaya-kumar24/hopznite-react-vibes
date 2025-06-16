
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Music } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import ParticlesBackground from '../components/ParticlesBackground';
import { getDJList, getVenues, getEvents } from '@/services/api';
import { toast } from 'sonner';

const Home = () => {
  const [djs, setDJs] = useState([]);
  const [venues, setVenues] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [djsResponse, venuesResponse, eventsResponse] = await Promise.all([
          getDJList(),
          getVenues(),
          getEvents()
        ]);

        if (djsResponse.success) {
          setDJs(djsResponse.data);
        } else {
          toast.error('Failed to fetch DJs');
        }

        if (venuesResponse.success) {
          setVenues(venuesResponse.data);
        } else {
          toast.error('Failed to fetch venues');
        }

        if (eventsResponse.success) {
          setEvents(eventsResponse.data);
        } else {
          toast.error('Failed to fetch events');
        }
      } catch (error) {
        toast.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ParticlesBackground />

      {/* Hero Section - Fixed for laptop screens */}
      <motion.section 
        className="relative bg-background min-h-[250px] lg:min-h-[280px] xl:min-h-[300px] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
        
        {/* Enhanced Carousel Design */}
        <div className="relative z-10 h-full">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full h-full"
          >
            <CarouselContent className="h-full">
              <CarouselItem className="h-full">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm">
                  <div className="text-center px-6 py-12">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                          HopzNite
                        </h1>
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl rounded-full"></div>
                      </div>
                      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Discover amazing DJs, book stunning venues, and create unforgettable nightlife experiences
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                          <Music className="mr-2 h-5 w-5" />
                          Explore Events
                        </Button>
                        <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2 hover:bg-primary/10 transform hover:scale-105 transition-all duration-300">
                          Find DJs
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem className="h-full">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-600/20 via-teal-600/20 to-blue-600/20 backdrop-blur-sm">
                  <div className="text-center px-6 py-12">
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                          Premium Venues
                        </h2>
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 blur-xl rounded-full"></div>
                      </div>
                      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Book the best restaurants, bars, and event spaces for your perfect night out
                      </p>
                      <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        <MapPin className="mr-2 h-5 w-5" />
                        Browse Venues
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
              
              <CarouselItem className="h-full">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-600/20 via-red-600/20 to-pink-600/20 backdrop-blur-sm">
                  <div className="text-center px-6 py-12">
                    <motion.div
                      initial={{ rotate: -5, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="space-y-6"
                    >
                      <div className="relative">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                          Epic Events
                        </h2>
                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-pink-600/20 blur-xl rounded-full"></div>
                      </div>
                      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join exclusive parties and events that will make your night legendary
                      </p>
                      <Button size="lg" className="px-8 py-3 text-lg bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        <Calendar className="mr-2 h-5 w-5" />
                        View Events
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            
            <CarouselPrevious className="left-4 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white" />
            <CarouselNext className="right-4 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white" />
            
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-white/50"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
              <div className="w-2 h-2 rounded-full bg-white/30"></div>
            </div>
          </Carousel>
        </div>
      </motion.section>

      {/* DJ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center">Featured DJs</h2>
            <p className="text-muted-foreground text-center">Discover top DJs for your next event</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Skeleton loaders
              [...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-md"></div>
                  <CardContent className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              djs.slice(0, 3).map((dj) => (
                <Card key={dj.id}>
                  <Link to={`/djs/${dj.id}`}>
                    <img src={dj.image} alt={dj.name} className="w-full h-48 object-cover rounded-md" />
                    <CardContent className="space-y-2">
                      <CardTitle>{dj.name}</CardTitle>
                      <CardDescription>{dj.genre}</CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
          <div className="text-center mt-6">
            <Button asChild>
              <Link to="/djs">View All DJs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Venues Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center">Featured Venues</h2>
            <p className="text-muted-foreground text-center">Explore popular venues for your events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Skeleton loaders
              [...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-md"></div>
                  <CardContent className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              venues.slice(0, 3).map((venue) => (
                <Card key={venue.id}>
                  <Link to={`/venues/${venue.id}`}>
                    <img src={venue.image} alt={venue.name} className="w-full h-48 object-cover rounded-md" />
                    <CardContent className="space-y-2">
                      <CardTitle>{venue.name}</CardTitle>
                      <CardDescription>{venue.location}</CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
          <div className="text-center mt-6">
            <Button asChild>
              <Link to="/venues">View All Venues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center">Upcoming Events</h2>
            <p className="text-muted-foreground text-center">Find exciting events happening near you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Skeleton loaders
              [...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-md"></div>
                  <CardContent className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded-md"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              events.slice(0, 3).map((event) => (
                <Card key={event.id}>
                  <Link to={`/events/${event.id}`}>
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-md" />
                    <CardContent className="space-y-2">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>{event.venue}, {event.location}</CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              ))
            )}
          </div>
          <div className="text-center mt-6">
            <Button asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Event Management Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Manage Your Events</h2>
              <p className="text-muted-foreground mb-6">
                List your events and reach a wider audience. Get started today!
              </p>
              <Button>List Your Event</Button>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Promote Your Venue</h2>
              <p className="text-muted-foreground mb-6">
                Showcase your venue to attract more customers and increase bookings.
              </p>
              <Button variant="outline">Promote Venue</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              Have questions or need assistance? Reach out to our support team.
            </p>
            <Button variant="secondary">Contact Support</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

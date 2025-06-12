
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import DJCard from '../components/DJCard';
import { getDJList, getEvents, getVenues } from '../services/api';
import { Search, Star, Calendar, MapPin, Users } from 'lucide-react';

const Home = () => {
  const [featuredDJs, setFeaturedDJs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [djResponse, eventsResponse, venuesResponse] = await Promise.all([
          getDJList(),
          getEvents(),
          getVenues()
        ]);
        
        if (djResponse.success) {
          setFeaturedDJs(djResponse.data.slice(0, 10));
        }
        
        if (eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data.slice(0, 6));
        }

        if (venuesResponse.success) {
          setTopVenues(venuesResponse.data.slice(0, 8));
        }
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      }
    };

    fetchFeaturedContent();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "DJ Real",
      text: "I've been with the DJSeeds family for the past year. I can't overstate how much DJSeeds has helped me grow my brand and my career.",
      rating: 5
    },
    {
      id: 2,
      name: "Sophie Red",
      text: "DJSeeds is a platform that made me realize the true potential of a DJ! All the bookings and gigs are happening thanks to DJSeeds.",
      rating: 5
    },
    {
      id: 3,
      name: "DJ Dragon",
      text: "The platform is amazing and has helped me connect with amazing venues and clients. Highly recommend to all DJs out there!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Connect with DJs & Bars
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover amazing DJs, book the best venues, and create unforgettable experiences.
              </p>
              
              <div className="flex gap-4 mb-8">
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="max-w-md bg-white/10 border-white/20 text-white placeholder:text-gray-300"
                />
                <Link to={`/events?location=${searchLocation}`}>
                  <Button className="bg-green-primary hover:bg-green-600 text-white">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-96 h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4"></div>
                  <p>Skyline Lounge</p>
                  <p className="text-sm">Mumbai, City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top DJs Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Top DJs in Chennai</h2>
            <Link to="/djs" className="view-all-link">View All DJs →</Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {featuredDJs.map((dj) => (
              <div key={dj.id} className="text-center">
                <div className="w-20 h-20 bg-green-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{dj.name.charAt(3)}</span>
                </div>
                <h3 className="text-white font-medium">{dj.name}</h3>
                <p className="text-gray-400 text-sm">{dj.genre}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-gray-300 text-sm ml-1">{dj.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Bars Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Top Resto Bars in Chennai</h2>
            <Link to="/venues" className="view-all-link">View All Venues →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVenues.map((venue) => (
              <Card key={venue.id} className="card-dark overflow-hidden">
                <div className="aspect-video bg-gray-800">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-1">{venue.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{venue.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-300 text-sm ml-1">{venue.rating}</span>
                    </div>
                    <Button size="sm" className="bg-green-primary hover:bg-green-600">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Upcoming Events in Chennai</h2>
            <Link to="/events" className="view-all-link">View All Events →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="card-dark overflow-hidden">
                <div className="aspect-video bg-gray-800">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.venue}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-primary font-bold">₹{event.price}</span>
                    <Button size="sm" className="bg-green-primary hover:bg-green-600">
                      Buy Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Hopznite Section */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-title text-center">Why Choose Hopznite</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Top Talent</h3>
              <p className="text-gray-400">Access to the best DJs and artists in your city</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Seamless Booking</h3>
              <p className="text-gray-400">Easy and secure booking process for all events</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Community</h3>
              <p className="text-gray-400">Connect with music lovers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="card-dark p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

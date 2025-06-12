
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDJList, getEvents, getVenues } from '../services/api';
import { Search, Star, Calendar, MapPin, Users, Music, FileText, Globe } from 'lucide-react';

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

  const eventManagementCompanies = [
    { id: 1, name: 'EventPro', description: 'Professional event management for all occasions', avatar: 'E' },
    { id: 2, name: 'Celebration Masters', description: 'Creating unforgettable experiences', avatar: 'C' },
    { id: 3, name: 'Nightlife Events', description: 'Specialists in nightlife and party planning', avatar: 'N' },
    { id: 4, name: 'Corporate Connect', description: 'Corporate event specialists', avatar: 'C' }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Nitish Kumar",
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
      name: "Priya Goel",
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
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Connect with DJs & Bars
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover amazing DJs, book the best venues, and create unforgettable experiences.
              </p>
              
              <div className="flex gap-4 mb-8">
                <Input
                  placeholder="Search by location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="max-w-md"
                />
                <Link to={`/events?location=${searchLocation}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="venue-card w-96 h-64">
                <div className="h-32 bg-muted rounded-t-lg"></div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-foreground">Skyline Lounge</h3>
                  <p className="text-sm text-muted-foreground">Mumbai, City</p>
                  <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90">
                    Book Venue
                  </Button>
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
                <div className="dj-avatar mx-auto mb-3">
                  <span>{dj.name.charAt(0)}</span>
                </div>
                <h3 className="text-foreground font-medium">{dj.name}</h3>
                <p className="text-muted-foreground text-sm">{dj.genre}</p>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-muted-foreground text-sm ml-1">{dj.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Bars Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Top Resto Bars in Chennai</h2>
            <Link to="/venues" className="view-all-link">View All Venues →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVenues.map((venue) => (
              <Card key={venue.id} className="venue-card">
                <div className="aspect-video bg-muted">
                  <img
                    src={venue.image || `https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400`}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-foreground font-semibold mb-1">{venue.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {venue.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-muted-foreground text-sm ml-1">{venue.rating}</span>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
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
              <Card key={event.id} className="event-card">
                <div className="aspect-video bg-muted">
                  <img
                    src={event.image || `https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-foreground font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
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
                    <span className="text-primary font-bold">₹{event.price}</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Buy Tickets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Management Companies */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Top Event Management Companies</h2>
            <Link to="/companies" className="view-all-link">View All Companies →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventManagementCompanies.map((company) => (
              <Card key={company.id} className="text-center p-6">
                <div className="company-avatar mx-auto mb-4">
                  <span>{company.avatar}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{company.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{company.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Hopznite Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="section-title text-center">Why Choose Hopznite</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="feature-icon mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Top Talent</h3>
              <p className="text-muted-foreground">Access to the best DJs and artists in your city</p>
            </div>
            <div className="text-center">
              <div className="feature-icon mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Seamless Booking</h3>
              <p className="text-muted-foreground">Easy and secure booking process for all events</p>
            </div>
            <div className="text-center">
              <div className="feature-icon mx-auto mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Global Community</h3>
              <p className="text-muted-foreground">Connect with music lovers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="testimonial-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-primary-foreground font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-center">Get In Touch</h2>
          <p className="text-muted-foreground mb-8">
            Ready to get started? Get in touch or create an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

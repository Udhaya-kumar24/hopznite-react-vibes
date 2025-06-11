
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import DJCard from '@/components/DJCard';
import { getDJList, getEvents } from '@/services/api';
import { Search, Music, Users, Calendar, Star } from 'lucide-react';

const Home = () => {
  const [featuredDJs, setFeaturedDJs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      try {
        const [djResponse, eventsResponse] = await Promise.all([
          getDJList(),
          getEvents()
        ]);
        
        if (djResponse.success) {
          setFeaturedDJs(djResponse.data.slice(0, 3));
        }
        
        if (eventsResponse.success) {
          setUpcomingEvents(eventsResponse.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Connect. Book. <span className="text-primary">Experience.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Hopznite brings together DJs, venues, and music lovers for unforgettable experiences. 
            Discover top talent, book amazing venues, and create memories that last.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="flex-1"
              />
              <Link to={`/events?location=${searchLocation}`}>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events">
              <Button size="lg" className="px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Browse Events
              </Button>
            </Link>
            <Link to="/djs">
              <Button variant="outline" size="lg" className="px-8">
                <Music className="w-5 h-5 mr-2" />
                Find DJs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Professional DJs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Partner Venues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Events Hosted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured DJs */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured DJs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the hottest DJs in your city. From EDM to Hip-Hop, find the perfect sound for your event.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredDJs.map((dj) => (
              <DJCard key={dj.id} dj={dj} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/djs">
              <Button variant="outline" size="lg">
                View All DJs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on the hottest events in your city. Book your tickets now!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <div className="text-sm text-muted-foreground mb-2">
                    <div>{event.venue}</div>
                    <div>{new Date(event.date).toLocaleDateString()} at {event.time}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ₹{event.price.toLocaleString()}
                    </span>
                    <Link to={`/events/${event.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/events">
              <Button variant="outline" size="lg">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect with the best DJs and venues in your area.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of professional DJs and premier venues in your city.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book</h3>
              <p className="text-muted-foreground">
                Select your preferred date, time, and package. Secure your booking instantly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Experience</h3>
              <p className="text-muted-foreground">
                Enjoy an unforgettable experience and share your feedback with the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

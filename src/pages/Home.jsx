
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getDJList, getEvents, getVenues } from '../services/api';
import { MapPin, Star, Calendar, Clock, Users, FileText, Globe, Music } from 'lucide-react';

const Home = () => {
  const [featuredDJs, setFeaturedDJs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [topVenues, setTopVenues] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedCity, setSelectedCity] = useState('Chennai');

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
          setUpcomingEvents(eventsResponse.data.slice(0, 3));
        }

        if (venuesResponse.success) {
          setTopVenues(venuesResponse.data.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch featured content:', error);
      }
    };

    fetchFeaturedContent();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section with Location */}
      <section className="bg-card border-b border-border py-4">
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
            <Button>Update Location</Button>
            <span className="text-muted-foreground ml-4">
              Showing results for {selectedCity}, {selectedCountry}
            </span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-muted/30 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Summer Beach Party - May 28
              </Badge>
              <h1 className="text-6xl font-bold text-foreground mb-4">
                Skyline Lounge
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, India</span>
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Venue
              </Button>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-96 h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-muted-foreground/20 rounded-full flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Top DJs in Chennai */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top DJs in Chennai</h2>
              <p className="text-muted-foreground">Book the best talent for your next event</p>
            </div>
            <Link to="/djs" className="text-primary hover:text-primary/80 font-medium">
              View All DJs →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {featuredDJs.map((dj) => (
              <Card key={dj.id} className="bg-card border border-border text-center p-4">
                <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{dj.name.charAt(0)}</span>
                </div>
                <Badge className="mb-2 bg-green-500/20 text-green-500 border-green-500/30">
                  Available
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
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Top Resto Bars in Chennai */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top Resto Bars in Chennai</h2>
              <p className="text-muted-foreground">Discover the best venues for your night out</p>
            </div>
            <Link to="/venues" className="text-primary hover:text-primary/80 font-medium">
              View All Venues →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topVenues.map((venue) => (
              <Card key={venue.id} className="bg-card border border-border overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <Badge className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                    <Star className="w-3 h-3 mr-1" />
                    {venue.rating}
                  </Badge>
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-muted-foreground" />
                  </div>
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
                    <Button variant="outline" size="sm" className="flex-1">
                      View Venue
                    </Button>
                    <Button size="sm" className="flex-1">
                      See Events
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Upcoming Events in Chennai */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Upcoming Events in Chennai</h2>
              <p className="text-muted-foreground">Don't miss out on the hottest events</p>
            </div>
            <Link to="/events" className="text-primary hover:text-primary/80 font-medium">
              View All Events →
            </Link>
          </div>

          <div className="flex gap-4 mb-6">
            <Button variant="default" size="sm">Upcoming</Button>
            <Button variant="outline" size="sm">This Weekend</Button>
            <Button variant="outline" size="sm">Trending</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} className="bg-card border border-border overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {index === 0 && (
                    <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900">
                      Premium
                    </Badge>
                  )}
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <CardContent className="p-4 bg-card">
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
                    <Button size="sm">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Top Event Management Companies */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top Event Management Companies</h2>
              <p className="text-muted-foreground">Professional event planners in Chennai</p>
            </div>
            <Link to="/companies" className="text-primary hover:text-primary/80 font-medium">
              View All Companies →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'EventPro', rating: 4.8, description: 'Full-service event management for corporate and private events', events: '120 events organized', avatar: 'E' },
              { name: 'Celebration Masters', rating: 4.7, description: 'Specializing in weddings and large-scale celebrations', events: '85 events organized', avatar: 'C' },
              { name: 'NightLife Events', rating: 4.9, description: 'Experts in club events and music festivals', events: '150 events organized', avatar: 'N' },
              { name: 'Corporate Connect', rating: 4.6, description: 'Business conferences and corporate entertainment', events: '95 events organized', avatar: 'C' }
            ].map((company) => (
              <Card key={company.name} className="bg-card border border-border p-6">
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
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Why Choose Hopznite */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Hopznite</h2>
          <p className="text-muted-foreground mb-12">
            The ultimate platform connecting DJs, venues, and music lovers across the globe
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Top Talent</h3>
              <p className="text-muted-foreground">
                Access to the best DJs and venues, all vetted and rated by our community
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Seamless Booking</h3>
              <p className="text-muted-foreground">
                Easy-to-use platform for finding and booking events or talent with just a few clicks
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Global Community</h3>
              <p className="text-muted-foreground">
                Join a worldwide network of music enthusiasts, professionals, and venues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Testimonials */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">What Our Users Say</h2>
          <p className="text-center text-muted-foreground mb-12">
            Hear from the people who use Hopznite every day
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            ].map((testimonial) => (
              <Card key={testimonial.name} className="bg-card border border-border p-6">
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
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Get in Touch */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
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
            </div>

            <Card className="bg-card border border-border p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input placeholder="Your email" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <Input placeholder="Subject" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <Textarea placeholder="Your message" rows={4} />
              </div>
              <Button className="w-full">Send Message</Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

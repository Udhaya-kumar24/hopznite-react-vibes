
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';
import { getEvents } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Events</h1>
        <p className="text-muted-foreground mb-6">Find the hottest events and parties in your city</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search events, venues, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <Badge variant={event.status === 'sold-out' ? 'destructive' : 'secondary'}>
                  {event.status === 'sold-out' ? 'Sold Out' : 'Available'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.venue}, {event.location}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">₹{event.price}</span>
                <span className="text-sm text-muted-foreground">{event.genre}</span>
              </div>

              <div className="flex gap-2">
                <Link to={`/events/${event.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
                <Button 
                  className="flex-1"
                  disabled={event.status === 'sold-out'}
                >
                  {event.status === 'sold-out' ? 'Sold Out' : 'Book Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Events;

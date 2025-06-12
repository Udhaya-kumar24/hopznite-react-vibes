
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Search, Filter, Music } from 'lucide-react';
import { getEvents } from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Upcoming');

  const filters = ['Upcoming', 'This Weekend', 'Trending'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const EventCardSkeleton = () => (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-2/3 mb-1" />
        <Skeleton className="h-4 w-1/3 mb-3" />
        <div className="flex gap-1 mb-3">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-10" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="flex gap-4 mb-6">
              {filters.map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Upcoming Events in Chennai</h1>
              <p className="text-muted-foreground">Don't miss out on the hottest events</p>
            </div>
            <Button variant="outline" className="text-primary hover:text-primary">
              View All Events →
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {filteredEvents.map((event, index) => (
            <Card key={event.id} className="overflow-hidden card-hover animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="aspect-video bg-muted relative overflow-hidden">
                {index === 0 && (
                  <Badge className="absolute top-3 left-3 bg-yellow-500 text-yellow-900 z-10">
                    Premium
                  </Badge>
                )}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
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
                  <Button size="sm" className="btn-primary">Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

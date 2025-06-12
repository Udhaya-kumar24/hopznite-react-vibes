
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Search, Filter, Star, Calendar, Music } from 'lucide-react';
import { getVenues } from '../services/api';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await getVenues();
        if (response.success) {
          setVenues(response.data);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setTimeout(() => setLoading(false), 1500);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const VenueCardSkeleton = () => (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-1" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96 mb-6" />
            
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <VenueCardSkeleton key={i} />
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
          <h1 className="text-3xl font-bold text-foreground mb-4">Top Resto Bars in Chennai</h1>
          <p className="text-muted-foreground mb-6">Discover the best venues for your night out</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search venues by name or location..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {filteredVenues.map((venue, index) => (
            <Card key={venue.id} className="overflow-hidden card-hover animate-scale-in" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="aspect-video bg-muted relative">
                <Badge className="absolute top-3 left-3 bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  <Star className="w-3 h-3 mr-1" />
                  {venue.rating}
                </Badge>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
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
                  <Link to={`/venues/${venue.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Venue
                    </Button>
                  </Link>
                  <Button size="sm" className="flex-1 btn-primary">
                    See Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No venues found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;

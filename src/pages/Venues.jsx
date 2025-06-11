
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Search, Filter } from 'lucide-react';
import { getVenues } from '../services/api';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Discover Venues</h1>
        <p className="text-muted-foreground mb-6">Find the perfect venue for your next event</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search venues by name, location, or type..."
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
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{venue.name}</CardTitle>
                <Badge variant="secondary">{venue.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  {venue.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  Capacity: {venue.capacity} people
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{venue.description}</p>

              <div className="flex gap-2">
                <Link to={`/venues/${venue.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View Details</Button>
                </Link>
                <Button className="flex-1">
                  Contact Venue
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No venues found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Venues;

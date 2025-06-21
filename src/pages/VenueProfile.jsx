import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Phone, Mail } from 'lucide-react';
import { getVenueById } from '@/services/api';
import { Link } from 'react-router-dom';

const VenueProfile = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVenueById(id).then(res => {
      setVenue(res.data || null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground">Loading venue details...</div>;
  }

  if (!venue) {
    return <div className="text-center py-20 text-destructive">Venue not found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {venue.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  Capacity: {venue.capacity}
                </div>
                <Badge variant="secondary">{venue.type}</Badge>
              </div>
              <p className="text-muted-foreground mb-6">{venue.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">{amenity}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Operating Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Weekdays: {venue.hours.weekdays}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Weekends: {venue.hours.weekends}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venue.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{event.name}</h4>
                      <p className="text-sm text-muted-foreground">{event.date} • {event.dj}</p>
                    </div>
                    {
                      event?.url &&
                      <Button variant="outline" size="sm">
                        <Link to={event.url}>View Details</Link>
                      </Button>
                    }
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{venue.contact.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{venue.contact.email}</span>
              </div>
              <Button className="w-full">
                Contact Venue
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-medium">{venue.capacity} people</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium">{venue.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Events</span>
                <span className="text-sm font-medium">{venue.upcomingEvents.length} upcoming</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VenueProfile;


import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Music, Ticket } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  
  // Mock event data
  const event = {
    id: 1,
    title: "Saturday Night Fever",
    description: "The biggest electronic dance music event of the month featuring top DJs and incredible vibes.",
    date: "June 15, 2024",
    time: "9:00 PM - 3:00 AM",
    venue: "Club Infinity",
    location: "Bandra, Mumbai",
    dj: "DJ Sonic",
    genre: "EDM",
    image: "https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600",
    ticketPrice: 1500,
    capacity: 250,
    soldTickets: 180,
    features: ["Live DJ Performance", "Premium Sound System", "Dance Floor", "Bar & Cocktails", "VIP Section"],
    ageLimit: "21+",
    dressCode: "Smart Casual"
  };

  const availableTickets = event.capacity - event.soldTickets;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{event.venue}</span>
                </div>
                <div className="flex items-center">
                  <Music className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{event.dj}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{event.soldTickets}/{event.capacity}</span>
                </div>
                <Badge variant="secondary">{event.genre}</Badge>
              </div>

              <p className="text-muted-foreground mb-6">{event.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Event Features</h3>
                  <ul className="space-y-2">
                    {event.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Event Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Age Limit:</span>
                      <span>{event.ageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dress Code:</span>
                      <span>{event.dressCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Venue:</span>
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="w-5 h-5 mr-2" />
                Book Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">₹{event.ticketPrice}</div>
                <p className="text-sm text-muted-foreground">per ticket</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available:</span>
                  <span className="font-medium">{availableTickets} tickets</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sold:</span>
                  <span className="font-medium">{event.soldTickets} tickets</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(event.soldTickets / event.capacity) * 100}%` }}
                ></div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                disabled={availableTickets === 0}
              >
                {availableTickets > 0 ? 'Book Now' : 'Sold Out'}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Secure booking with instant confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Featured DJ</span>
                  <span className="text-sm font-medium">{event.dj}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Music Genre</span>
                  <Badge variant="secondary">{event.genre}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Duration</span>
                  <span className="text-sm font-medium">6 hours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

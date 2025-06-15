
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Music, Ticket, Star, ShieldCheck } from 'lucide-react';
import GoogleCalendar from '../components/GoogleCalendar';
import GoogleMaps from '../components/GoogleMaps';

const EventDetails = () => {
  const { id } = useParams();
  
  // Mock event data - in real app, fetch based on id
  const event = {
    id: 1,
    title: "Saturday Night Fever",
    description: "The biggest electronic dance music event of the month featuring top DJs and incredible vibes. Get ready for a night of non-stop dancing, stunning visuals, and a sound system that will blow you away. This is one party you don't want to miss!",
    date: "June 15, 2024",
    time: "9:00 PM",
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
  const soldPercentage = (event.soldTickets / event.capacity) * 100;

  return (
    <div className="bg-background text-foreground">
      {/* Event Hero */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20"></div>
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
          <Badge variant="secondary" className="mb-4">{event.genre}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
            <div className="flex items-center"><Calendar className="w-5 h-5 mr-2" /> {event.date}</div>
            <div className="flex items-center"><Clock className="w-5 h-5 mr-2" /> {event.time}</div>
            <div className="flex items-center"><MapPin className="w-5 h-5 mr-2" /> {event.venue}, {event.location}</div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader><CardTitle>About The Event</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Featuring</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400" alt={event.dj} className="w-full h-full object-cover"/>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{event.dj}</h3>
                    <p className="text-muted-foreground">Main Act</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader><CardTitle>What to Expect</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {event.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Star className="w-4 h-4 mr-3 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Event Information</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between"><span>Age Limit:</span> <span className="font-medium">{event.ageLimit}</span></div>
                  <div className="flex justify-between"><span>Dress Code:</span> <span className="font-medium">{event.dressCode}</span></div>
                  <div className="flex justify-between"><span>Capacity:</span> <span className="font-medium">{event.capacity}</span></div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column: Tickets & Map */}
          <div className="lg:sticky top-24 self-start space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="w-6 h-6" /> Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">₹{event.ticketPrice}</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${soldPercentage}%` }}></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available: <span className="font-bold text-foreground">{availableTickets}</span></span>
                  <span className="text-muted-foreground">Sold: <span className="font-bold text-foreground">{event.soldTickets}</span></span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={availableTickets === 0}
                >
                  {availableTickets > 0 ? 'Book Now' : 'Sold Out'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure booking with instant confirmation
                </p>
              </CardContent>
            </Card>
            
            <GoogleCalendar event={event} />
            <GoogleMaps venue={event.venue} location={event.location} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

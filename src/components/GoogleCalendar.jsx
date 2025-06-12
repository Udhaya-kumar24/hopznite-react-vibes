
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const GoogleCalendar = ({ event }) => {
  const [isAdding, setIsAdding] = useState(false);

  const addToGoogleCalendar = () => {
    setIsAdding(true);
    
    try {
      const startDate = new Date(event.date + ' ' + event.time);
      const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours later
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[:-]/g, '').split('.')[0] + 'Z';
      };

      const calendarUrl = new URL('https://calendar.google.com/calendar/render');
      calendarUrl.searchParams.set('action', 'TEMPLATE');
      calendarUrl.searchParams.set('text', event.title);
      calendarUrl.searchParams.set('dates', `${formatDate(startDate)}/${formatDate(endDate)}`);
      calendarUrl.searchParams.set('details', `Event: ${event.title}\nVenue: ${event.venue}\nLocation: ${event.location}\nPrice: ₹${event.price}`);
      calendarUrl.searchParams.set('location', `${event.venue}, ${event.location}`);

      window.open(calendarUrl.toString(), '_blank');
      toast.success('Event added to Google Calendar!');
    } catch (error) {
      toast.error('Failed to add event to calendar');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Add to Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{event.venue}, {event.location}</span>
          </div>
        </div>
        <Button 
          onClick={addToGoogleCalendar}
          disabled={isAdding}
          className="w-full"
        >
          {isAdding ? 'Adding...' : 'Add to Google Calendar'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoogleCalendar;

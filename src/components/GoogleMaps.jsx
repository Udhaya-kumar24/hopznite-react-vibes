
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const GoogleMaps = ({ venue, location }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openInGoogleMaps = () => {
    setIsLoading(true);
    
    try {
      const query = encodeURIComponent(`${venue}, ${location}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
      
      window.open(mapsUrl, '_blank');
      toast.success('Opening venue location in Google Maps');
    } catch (error) {
      toast.error('Failed to open Google Maps');
    } finally {
      setIsLoading(false);
    }
  };

  const getDirections = () => {
    setIsLoading(true);
    
    try {
      const destination = encodeURIComponent(`${venue}, ${location}`);
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      
      window.open(directionsUrl, '_blank');
      toast.success('Getting directions to venue');
    } catch (error) {
      toast.error('Failed to get directions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Venue Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{venue}</span>
          </div>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={openInGoogleMaps}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Maps
          </Button>
          <Button 
            onClick={getDirections}
            disabled={isLoading}
            className="flex-1"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMaps;

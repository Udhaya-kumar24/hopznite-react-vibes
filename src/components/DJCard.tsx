
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';

interface DJ {
  id: number;
  name: string;
  genre: string;
  rating: number;
  price: number;
  location: string;
  image: string;
  bio: string;
}

interface DJCardProps {
  dj: DJ;
  showBookButton?: boolean;
  onBook?: (djId: number) => void;
}

const DJCard: React.FC<DJCardProps> = ({ dj, showBookButton = false, onBook }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={dj.image}
          alt={dj.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground">{dj.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{dj.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="secondary">{dj.genre}</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 mr-1" />
            {dj.location}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{dj.bio}</p>
        
        <div className="text-lg font-bold text-primary">
          ₹{dj.price.toLocaleString()}
          <span className="text-sm text-muted-foreground font-normal">/night</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/djs/${dj.id}`} className="flex-1">
          <Button variant="outline" className="w-full">View Profile</Button>
        </Link>
        {showBookButton && onBook && (
          <Button 
            className="flex-1"
            onClick={() => onBook(dj.id)}
          >
            Book Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DJCard;

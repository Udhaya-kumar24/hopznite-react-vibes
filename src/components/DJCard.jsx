import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const DJCard = ({ dj }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }} className="h-full">
      <Card className="bg-card border-border text-center p-4 h-full group overflow-hidden flex flex-col items-center">
        <CardContent className="p-0 flex flex-col items-center flex-grow">
          <motion.img 
            src={dj.image} 
            alt={dj.name} 
            className="w-24 h-24 rounded-full object-cover mb-2" 
            whileHover={{ scale: 1.1 }} 
          />
          {dj.available !== undefined && (
            <Badge className={`text-xs mb-2 ${dj.available ? 'bg-green-500 text-primary-foreground hover:bg-green-600' : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'}`}>
              {dj.available ? 'Available' : 'Busy'}
            </Badge>
          )}
          <h3 className="font-semibold text-card-foreground mb-1">{dj.name}</h3>
          <div className="flex items-center justify-center mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-muted-foreground ml-1">{dj.rating}</span>
          </div>
          <div className="flex gap-1 justify-center mb-3 flex-wrap">
            {(dj.genres || [dj.genre]).slice(0, 2).map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
            ))}
          </div>
        </CardContent>
        <Link to={`/djs/${dj.id}`} className="w-full mt-auto pt-4">
          <Button variant="outline" size="sm" className="w-full">
            View Profile
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
};

export default DJCard; 
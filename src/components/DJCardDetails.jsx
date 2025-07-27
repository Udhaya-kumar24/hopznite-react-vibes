import React from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const DJCardDetails = ({ dj, handleViewDetails, handleBookNow }) => {
  return (
    <motion.div 
      key={dj.id}
      whileHover={{ y: -5 }} 
      transition={{ type: "spring", stiffness: 300 }} 
      className="bg-white border rounded-xl shadow p-0 overflow-hidden flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-40 bg-gray-100 flex items-center justify-center">
        <motion.img 
          src={dj.image} 
          alt={dj.name} 
          className="object-cover w-full h-full" 
          whileHover={{ scale: 1.05 }} 
          transition={{ duration: 0.3 }}
        />
        <span className={`absolute top-2 left-2 w-3 h-3 rounded-full ${dj.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
        <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
          {dj.available ? 'Fully Available' : 'Busy'}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="font-semibold text-lg text-center">{dj.name}</div>
        <div className="text-sm text-muted-foreground text-center mb-2">{dj.genres?.join(', ')}</div>

        <div className="flex flex-col gap-1 text-xs mb-3">
          <div><span className="font-medium">Location:</span> {dj.location || '-'}</div>
          <div><span className="font-medium">Experience:</span> {dj.experience || '5+ years'}</div>
          <div><span className="font-medium">Equipment:</span> {dj.equipment || 'Full Setup Included'}</div>
          <div><span className="font-medium">Next Available:</span> {dj.nextAvailable || 'Dec 15, 2024'}</div>
          <div><span className="font-medium">Price Range:</span> ${dj.price - 300} - ${dj.price + 300}</div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button variant="outline" className="flex-1" onClick={() => handleViewDetails(dj)}>
            View Details
          </Button>
          <Button className="flex-1 bg-black text-white" onClick={() => handleBookNow(dj)}>
            Book Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DJCardDetails;

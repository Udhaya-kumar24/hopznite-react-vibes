
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const carouselItems = items.length > 0 ? items : [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1920&h=800&fit=crop",
      title: "Summer Beats Festival",
      type: "event",
      location: "Chennai Beach Resort",
      date: "2024-07-15",
      description: "The biggest electronic music festival of the year"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&h=800&fit=crop",
      title: "Club Neon",
      type: "venue",
      location: "Downtown Chennai",
      description: "Premium nightclub with world-class sound system"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=800&fit=crop",
      title: "Jazz Night Live",
      type: "event",
      location: "The Grand Hotel",
      date: "2024-07-20",
      description: "An evening of smooth jazz with renowned artists"
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, carouselItems.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden bg-background">
      {/* Main Carousel */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            className="absolute inset-0"
          >
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0">
              <motion.img
                src={carouselItems[currentIndex]?.image}
                alt={carouselItems[currentIndex]?.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 7 }}
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                  className="max-w-2xl text-white"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants}>
                    <Badge 
                      className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium"
                    >
                      {carouselItems[currentIndex]?.type === 'event' ? '🎵 Featured Event' : '🏛️ Premium Venue'}
                    </Badge>
                  </motion.div>

                  <motion.h1 
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                    variants={itemVariants}
                  >
                    {carouselItems[currentIndex]?.title}
                  </motion.h1>

                  <motion.p 
                    className="text-lg sm:text-xl text-gray-200 mb-6 leading-relaxed"
                    variants={itemVariants}
                  >
                    {carouselItems[currentIndex]?.description}
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 mb-8"
                    variants={itemVariants}
                  >
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{carouselItems[currentIndex]?.location}</span>
                    </div>
                    {carouselItems[currentIndex]?.date && (
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 mr-2" />
                        <span>{new Date(carouselItems[currentIndex]?.date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    variants={itemVariants}
                  >
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      asChild
                    >
                      <Link to={carouselItems[currentIndex]?.type === 'event' ? `/events/${carouselItems[currentIndex]?.id}` : `/venues/${carouselItems[currentIndex]?.id}`}>
                        {carouselItems[currentIndex]?.type === 'event' ? 'Book Tickets' : 'Explore Venue'}
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full backdrop-blur-sm"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPrevious}
          className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white border-none rounded-full backdrop-blur-sm transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNext}
          className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white border-none rounded-full backdrop-blur-sm transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="w-10 h-10 bg-black/30 hover:bg-black/50 text-white border-none rounded-full backdrop-blur-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Dot Indicators */}
          <div className="flex space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          key={currentIndex}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;

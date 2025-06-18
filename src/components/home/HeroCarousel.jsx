import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const HeroCarousel = ({ carouselItems }) => { 
  const carouselPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <motion.section 
      className="relative bg-background w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Carousel
        plugins={[carouselPlugin.current]}
        className="w-full h-full"
        onMouseEnter={carouselPlugin.current.stop}
        onMouseLeave={carouselPlugin.current.reset}
      >
        <CarouselContent className="h-full">
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full text-white">
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={item.image} 
                    alt={item.title || item.name} 
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-start w-full h-full">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div 
                      className="max-w-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Badge className="mb-4 bg-white/20 text-white border-white/20 backdrop-blur-sm py-2 px-4 rounded-full font-medium">
                        {item.title ? `Event - ${new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Top Venue'}
                      </Badge>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                        {item.title || item.name}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-300 mb-6">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{item.location}</span>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto"
                      >
                        <Button 
                          size="lg" 
                          asChild 
                          className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold"
                        >
                          <Link to={item.title ? `/events/${item.id}` : `/venues/${item.id}`}>
                            Explore {item.title ? 'Event' : 'Venue'}
                          </Link>
                        </Button>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-4 bg-black/30 border-none text-white hover:bg-black/50" />
        <CarouselNext className="hidden md:flex right-4 bg-black/30 border-none text-white hover:bg-black/50" />
      </Carousel>
    </motion.section>
  );
};

export default HeroCarousel; 
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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

  if (!carouselItems || carouselItems.length === 0) {
    return null;
  }

  return (
   <motion.section
  className="relative w-full bg-black"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <Carousel
    plugins={[carouselPlugin.current]}
    className="w-full h-full"
    onMouseEnter={() => carouselPlugin.current.stop()}
    onMouseLeave={() => carouselPlugin.current.reset()}
  >
    <CarouselContent className="flex h-full w-full">
      {carouselItems.map((item, index) => (
        <CarouselItem
          key={index}
          className="min-w-full h-full flex items-center justify-center relative"
        >
          <div className="relative w-full h-full">
            {/* Background Image */}
            <img
              src={
                item.image ||
                item.coverImage ||
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070&auto=format&fit=crop"
              }
              alt={item.title || item.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10"></div>

            {/* Content */}
            <div className="relative z-20 flex flex-col justify-end h-full px-6 sm:px-10 py-12 max-w-7xl mx-auto text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Badge className="mb-4 bg-white/20 text-white border-white/20 backdrop-blur-sm py-2 px-4 rounded-full font-medium">
                  {item.title
                    ? `Event - ${new Date(item.date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" }
                      )}`
                    : "Top Venue"}
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {item.title || item.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-300 mb-6">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm sm:text-base">{item.location}</span>
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    asChild
                    className="bg-primary rounded-full px-6 py-3 text-sm sm:text-base font-semibold"
                  >
                    <Link
                    className="bg-primary hover:bg-primary/90"
                      to={
                        item.title
                          ? `/events/${item.id}`
                          : `/venues/${item.id}`
                      }
                    >
                      Explore {item.title ? "Event" : "Venue"}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>

    {/* Navigation Buttons */}
    <CarouselPrevious className="hidden md:flex left-4 bg-black/30 border-none text-white hover:bg-black/50 z-30" />
    <CarouselNext className="hidden md:flex right-4 bg-black/30 border-none text-white hover:bg-black/50 z-30" />
  </Carousel>
</motion.section>

  );
};

export default HeroCarousel;

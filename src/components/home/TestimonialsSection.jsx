import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = ({ containerVariants, itemVariants }) => {
  const testimonials = [
    {
      name: "Rahul Kumar",
      role: "DJ",
      rating: 5,
      text: "Hopznite has transformed my career as a DJ. I'm getting more bookings than ever, and the platform makes it easy to manage my schedule and connect with venues."
    },
    {
      name: "Sanjay Patel",
      role: "Venue Owner",
      rating: 5,
      text: "Finding the right DJ for our events used to be a nightmare. With Hopznite, we can browse profiles, check availability, and book instantly. It's been a game-changer for our business."
    },
    {
      name: "Priya Gupta",
      role: "Customer",
      rating: 5,
      text: "The premium membership is worth every penny. I get access to exclusive events and can book my favorite DJs directly. Hopznite has completely changed how I discover and enjoy music events."
    }
  ];

  return (
    <motion.section 
      className="py-16 px-4 bg-muted/40 z-10 relative" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-foreground text-center mb-4" 
          variants={itemVariants}
        >
          What Our Users Say
        </motion.h2>
        <motion.p 
          className="text-center text-muted-foreground mb-12" 
          variants={itemVariants}
        >
          Hear from the people who use Hopznite every day
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8" 
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.name} 
              className="h-full" 
              variants={itemVariants} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mr-3">
                    <span className="text-foreground font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{testimonial.text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection; 
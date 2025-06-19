import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { getTestimonials } from '@/services/api';

const TestimonialsSection = ({ containerVariants, itemVariants }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTestimonials().then(res => {
      if (res.success) setTestimonials(res.data);
    }).finally(() => setLoading(false));
  }, []);

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
          {loading ? (
            [...Array(3)].map((_, i) => (
              <motion.div key={i} className="h-full" variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="p-6 h-full animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full mr-3" />
                    <div>
                      <div className="h-4 bg-muted rounded w-24 mb-2" />
                      <div className="h-3 bg-muted rounded w-16 mb-2" />
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="w-4 h-4 bg-muted rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </Card>
              </motion.div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial, index) => (
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
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No testimonials found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection; 
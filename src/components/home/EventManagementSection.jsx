import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar } from 'lucide-react';

const EventManagementSection = ({ 
  selectedCity, 
  containerVariants, 
  itemVariants 
}) => {
  const companies = [
    { 
      name: 'EventPro', 
      rating: 4.8, 
      description: 'Full-service event management for corporate and private events', 
      events: '120 events organized', 
      avatar: 'E' 
    },
    { 
      name: 'Celebration Masters', 
      rating: 4.7, 
      description: 'Specializing in weddings and large-scale celebrations', 
      events: '85 events organized', 
      avatar: 'C' 
    },
    { 
      name: 'NightLife Events', 
      rating: 4.9, 
      description: 'Experts in club events and music festivals', 
      events: '150 events organized', 
      avatar: 'N' 
    },
    { 
      name: 'Corporate Connect', 
      rating: 4.6, 
      description: 'Business conferences and corporate entertainment', 
      events: '95 events organized', 
      avatar: 'C' 
    },
    { 
      name: 'Gala Planners', 
      rating: 4.8, 
      description: 'High-end galas and charity events.', 
      events: '70 events organized', 
      avatar: 'G' 
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
        <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Top Event Management Companies</h2>
            <p className="text-muted-foreground">Professional event planners in {selectedCity}</p>
          </div>
          <Button variant="link" className="text-primary hover:text-primary/90 font-medium">
            View All Companies →
          </Button>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6" 
          variants={containerVariants}
        >
          {companies.map((company, index) => (
            <motion.div 
              key={company.name} 
              variants={itemVariants} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card border-border p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-muted border-border rounded-full flex items-center justify-center mr-3">
                    <span className="text-foreground font-bold">{company.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{company.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-muted-foreground ml-1">{company.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="w-3 h-3 mr-1" />{company.events}
                </div>
                <Button variant="outline" size="sm" className="w-full">View Profile</Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default EventManagementSection; 
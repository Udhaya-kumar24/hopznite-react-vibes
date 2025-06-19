import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Calendar } from 'lucide-react';
import { getEventManagementCompanies } from '@/services/api';
import { Link } from 'react-router-dom';

const EventManagementSection = ({ 
  selectedCity, 
  containerVariants, 
  itemVariants 
}) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getEventManagementCompanies().then(res => {
      if (res.success) setCompanies(res.data);
    }).finally(() => setLoading(false));
  }, []);

  console.log(companies,'???????');
  
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
          {loading ? (
            [...Array(5)].map((_, i) => (
              <motion.div key={i} variants={itemVariants} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-card border-border p-6 h-full animate-pulse">
                  <div className="w-12 h-12 bg-muted border-border rounded-full mb-4" />
                  <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/3 mb-4" />
                  <div className="h-3 bg-muted rounded w-full mb-3" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-8 bg-muted rounded w-full" />
                </Card>
              </motion.div>
            ))
          ) : companies.length > 0 ? (
            companies.map((company, index) => (
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
                  <Link to={`/eventmgmt/${company.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No companies found.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default EventManagementSection; 
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import DJCard from '../DJCard';
import { CardSkeleton } from '../ui/skeleton';

const TopDJsSection = ({ 
  selectedCity, 
  loading, 
  filteredDJs, 
  containerVariants, 
  itemVariants 
}) => {
  return (
    <motion.section 
      className="py-16 px-4 z-10 relative"
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Top DJs in {selectedCity}</h2>
            <p className="text-muted-foreground">Book the best talent for your next event</p>
          </div>
          <Link to="/djs" className="text-primary hover:text-primary/90 font-medium">View All DJs →</Link>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          variants={containerVariants}
        >
          {loading ? (
            [...Array(10)].map((_, i) => <motion.div key={i} variants={itemVariants}><CardSkeleton /></motion.div>)
          ) : (
            filteredDJs.slice(0, 10).map((dj) => (
              <DJCard key={dj.id} dj={dj} />
            ))
          )}
          {filteredDJs.length === 0 && !loading && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No DJs found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TopDJsSection; 
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Calendar, Users } from 'lucide-react';

const WhyChooseSection = ({ containerVariants, itemVariants }) => {
  const features = [
    {
      icon: <Music className="w-8 h-8 text-foreground" />,
      title: "Top Talent",
      description: "Access to the best DJs and venues, all vetted and rated by our community"
    },
    {
      icon: <Calendar className="w-8 h-8 text-foreground" />,
      title: "Seamless Booking",
      description: "Easy-to-use platform for finding and booking events or talent with just a few clicks"
    },
    {
      icon: <Users className="w-8 h-8 text-foreground" />,
      title: "Global Community",
      description: "Join a worldwide network of music enthusiasts, professionals, and venues"
    }
  ];

  return (
    <motion.section 
      className="py-16 px-4 z-10 relative" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2 
          className="text-3xl font-bold text-foreground mb-4" 
          variants={itemVariants}
        >
          Why Choose Hopznite
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mb-12" 
          variants={itemVariants}
        >
          The ultimate platform connecting DJs, venues, and music lovers across the globe
        </motion.p>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8" 
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              className="text-center" 
              variants={itemVariants}
            >
              <div className="w-16 h-16 bg-muted border-border rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WhyChooseSection; 
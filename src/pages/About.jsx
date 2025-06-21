
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, Heart, Award } from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const teamMembers = [
    {
      name: "Sarah Johnson",
      position: "CEO & Founder",
      description: "With over 10 years of experience in tech, Sarah leads our vision to revolutionize the industry.",
      avatar: "/api/placeholder/150/150"
    },
    {
      name: "Michael Chen",
      position: "CTO",
      description: "Michael brings deep technical expertise and leads our engineering team with innovation at heart.",
      avatar: "/api/placeholder/150/150"
    },
    {
      name: "Emily Rodriguez",
      position: "Head of Design",
      description: "Emily crafts beautiful user experiences that make complex problems simple and intuitive.",
      avatar: "/api/placeholder/150/150"
    },
    {
      name: "David Kim",
      position: "Head of Marketing",
      description: "David drives our growth strategy and helps connect our solutions with the right audience.",
      avatar: "/api/placeholder/150/150"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We constantly push boundaries to deliver cutting-edge solutions that solve real problems."
    },
    {
      icon: Users,
      title: "Customer Centric",
      description: "Every decision we make is guided by what's best for our customers and their success."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We build trust through transparency, honesty and ethical business practices."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from product quality to customer service."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <motion.section 
        className="py-20 px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.p 
            className="text-muted-foreground mb-4"
            variants={itemVariants}
          >
            About Hopznite
          </motion.p>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            Building the Future, One Solution at a Time
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            We're a passionate team of innovators dedicated to creating technology that empowers businesses and transforms industries. Our mission is to make complex solutions simple and accessible.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center"
            variants={itemVariants}
          >
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get in Touch
            </Button>
            <Button variant="outline">
              Learn More
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission and Vision */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to powerful technology solutions by creating intuitive, scalable, and affordable tools that help businesses of all sizes achieve their goals. We believe that great technology should be accessible to everyone, not just large enterprises.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To be the leading platform that bridges the gap between complex technology and everyday business needs. We envision a world where any organization can leverage cutting-edge solutions without the traditional barriers of cost, complexity, or expertise.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Our Values */}
      <motion.section 
        className="py-16 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            variants={itemVariants}
          >
            Our Values
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            These core principles guide everything we do and shape how we interact with our customers, partners, and each other.
          </motion.p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Meet Our Team */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            variants={itemVariants}
          >
            Meet Our Team
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            We're a diverse group of passionate individuals united by our commitment to innovation and customer success.
          </motion.p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5"></div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.position}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 bg-primary text-primary-foreground"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            variants={itemVariants}
          >
            Ready to Work Together?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            variants={itemVariants}
          >
            We'd love to hear from you. Let's discuss how we can help bring your vision to life.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center"
            variants={itemVariants}
          >
            <Button 
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90"
            >
              hello@hopznite.com
            </Button>
            <Button 
              variant="outline"
              className="border-primary-foreground text-foreground hover:bg-primary-foreground hover:text-primary"
            >
              (123) 456-7890
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;

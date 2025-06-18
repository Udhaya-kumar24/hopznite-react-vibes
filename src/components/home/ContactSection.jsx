import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Clock } from 'lucide-react';

const ContactSection = ({ containerVariants, itemVariants }) => {
  return (
    <motion.section 
      className="py-16 px-4 z-10 relative" 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              Have questions about Hopznite? We're here to help. Reach out to our team for support, 
              partnership inquiries, or feedback.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-foreground mr-3" />
                <span className="text-muted-foreground">123 Music Street, Chennai, India</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-foreground mr-3" />
                <span className="text-muted-foreground">Monday - Friday: 9am - 6pm</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline">Contact Us</Button>
              <Button variant="secondary">Support</Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-card border-border p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                      Email
                    </label>
                    <Input id="email" placeholder="Your email" type="email" required />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-card-foreground mb-2">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Subject" required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Your message" rows={4} required />
                </div>
                <Button type="submit" className="w-full py-3">Send Message</Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection; 
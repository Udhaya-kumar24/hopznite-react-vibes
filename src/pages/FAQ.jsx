
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate()

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

  const faqs = [
    {
      question: "What is Hopznite and how does it work?",
      answer: "Hopznite is a comprehensive platform that connects DJs, event managers, and venue owners. DJs can showcase their talent, set availability, and manage bookings. Venue owners can find and book talented DJs for their events. Event managers can coordinate and manage multiple events seamlessly. The platform handles everything from discovery to payment processing."
    },
    {
      question: "How much does Hopznite cost and what pricing plans are available?",
      answer: "Hopznite offers flexible pricing plans to suit different needs. We have a free tier for basic features, a Pro plan for individual DJs and venue owners, and an Enterprise plan for large organizations. DJs can set their own rates, and we charge a small commission on successful bookings. Visit our pricing page for detailed information."
    },
    {
      question: "Is my data secure with Hopznite?",
      answer: "Absolutely. We take data security very seriously. All data is encrypted in transit and at rest using industry-standard encryption. We comply with GDPR and other privacy regulations. Regular security audits are conducted, and we never share your personal information with third parties without your explicit consent."
    },
    {
      question: "Can I integrate Hopznite with my existing tools and software?",
      answer: "Yes! Hopznite offers robust API integrations with popular tools including Google Calendar, payment processors like Stripe and PayPal, CRM systems, and social media platforms. We also provide webhooks for custom integrations. Our technical team can help you set up integrations specific to your needs."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide comprehensive support including 24/7 chat support, email support, detailed documentation, video tutorials, and webinars. Pro and Enterprise customers get priority support with dedicated account managers. We also have an active community forum where users can share tips and get help from other users."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time with no cancellation fees. If you cancel, you'll continue to have access to paid features until the end of your current billing period. Your data will be preserved for 30 days after cancellation in case you decide to reactivate your account."
    }
  ];

  const quickLinks = [
    { label: "View Pricing", href: "/pricing" },
    { label: "Features", href: "/features" },
    { label: "Contact Us", href: "/contact" },
    { label: "Documentation", href: "/docs" }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
          <motion.div 
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            variants={itemVariants}
          >
            <HelpCircle className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.p 
            className="text-muted-foreground mb-4"
            variants={itemVariants}
          >
            Frequently Asked Questions
          </motion.p>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            variants={itemVariants}
          >
            How Can We Help You?
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Find answers to the most common questions about Hopznite. Can't find what you're looking for? Our support team is here to help.
          </motion.p>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="p-0">
                <div className="border-b border-border p-6">
                  <h2 className="text-2xl font-semibold text-center">Frequently Asked Questions</h2>
                </div>
                <div className="divide-y divide-border">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-6">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="font-medium pr-4">{faq.question}</span>
                        <ChevronDown 
                          className={`w-5 h-5 text-muted-foreground transition-transform ${
                            openFAQ === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 text-muted-foreground leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      {/* Still Have Questions Section */}
      <motion.section 
        className="py-16 px-4 bg-muted/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            variants={itemVariants}
          >
            <MessageCircle className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.h2 
            className="text-3xl font-bold mb-4"
            variants={itemVariants}
          >
            Still Have Questions?
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Our support team is ready to help you with any questions or concerns you might have. We typically respond within 24 hours.
          </motion.p>
          <motion.div 
            className="flex gap-4 justify-center"
            variants={itemVariants}
          >
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90"  onClick={() => navigate('/')}>
              Contact Support
            </Button>
            <Button variant="outline" onClick={() => navigate('/about')}>
              Learn More About Us
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default FAQ;

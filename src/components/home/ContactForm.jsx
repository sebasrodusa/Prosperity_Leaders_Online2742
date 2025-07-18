import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSend, FiCheck } = FiIcons;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: 'financial-plan',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    error: null
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('public_inquiries_7a8b9c')
        .insert([formData]);
        
      if (error) throw error;
      
      // Success
      setFormStatus({ isSubmitting: false, isSubmitted: true, error: null });
      setFormData({
        name: '',
        email: '',
        interest: 'financial-plan',
        message: ''
      });
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormStatus(prev => ({ ...prev, isSubmitted: false }));
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: false, 
        error: 'There was an error submitting your inquiry. Please try again.' 
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h2>
          <div className="mt-2 h-1 w-20 bg-[#00AAFF] mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">
            Have questions? We're here to help you find the right solution for your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <Card className="p-8 h-full">
              {formStatus.isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600 max-w-md">
                    Your message has been successfully submitted. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                  
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I'm interested in...
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => handleChange('interest', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="financial-plan">Financial Planning</option>
                      <option value="career">Career Opportunities</option>
                      <option value="information">General Information</option>
                    </select>
                  </div>
                  
                  <Textarea
                    label="Message"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    rows={5}
                    placeholder="Please provide any additional details about your inquiry..."
                  />
                  
                  {formStatus.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                      {formStatus.error}
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={formStatus.isSubmitting}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiSend} className="w-5 h-5" />
                      <span>
                        {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
                      </span>
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="h-full flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-medium text-[#0044AA] mb-2">Headquarters</h4>
                  <p className="text-gray-600">
                    1234 Prosperity Way<br />
                    Suite 500<br />
                    Miami, FL 33101
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#0044AA] mb-2">Contact Information</h4>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> info@prosperityleaders.net
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span> (800) 123-4567
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#0044AA] mb-2">Hours of Operation</h4>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                    Saturday: By appointment only<br />
                    Sunday: Closed
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#0044AA] mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-[#0044AA] text-white flex items-center justify-center hover:bg-[#00AAFF] transition-colors"
                      aria-label="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-[#0044AA] text-white flex items-center justify-center hover:bg-[#00AAFF] transition-colors"
                      aria-label="Twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-[#0044AA] text-white flex items-center justify-center hover:bg-[#00AAFF] transition-colors"
                      aria-label="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a 
                      href="#" 
                      className="w-10 h-10 rounded-full bg-[#0044AA] text-white flex items-center justify-center hover:bg-[#00AAFF] transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
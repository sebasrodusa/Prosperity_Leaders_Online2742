import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiShield, FiHome, FiBarChart2, FiBookOpen, FiDollarSign, FiHeart } = FiIcons;

const Services = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content_7a8b9c')
          .select('content')
          .eq('key', 'services_description')
          .single();

        if (error) throw error;
        setDescription(data.content);
      } catch (error) {
        console.error('Error fetching services description:', error);
        setDescription('We offer a comprehensive suite of financial services designed to protect your family today while building wealth for tomorrow.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const services = [
    {
      title: "Life Insurance",
      icon: FiShield,
      description: "Protect your family's financial future with customized life insurance solutions.",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Retirement Planning",
      icon: FiHome,
      description: "Build a retirement strategy that ensures financial security in your golden years.",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "College Savings",
      icon: FiBookOpen,
      description: "Start saving early for your children's education with tax-advantaged strategies.",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Income Protection",
      icon: FiDollarSign,
      description: "Safeguard your income with disability and supplemental insurance options.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Wealth Accumulation",
      icon: FiBarChart2,
      description: "Grow your assets with diversified investment strategies tailored to your goals.",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: "Final Expense Planning",
      icon: FiHeart,
      description: "Ensure your loved ones aren't burdened with expenses during difficult times.",
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
            <div className="mt-2 h-1 w-20 bg-[#00AAFF] mx-auto"></div>
            
            {loading ? (
              <div className="animate-pulse mt-6 max-w-3xl mx-auto">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded mt-2 w-5/6 mx-auto"></div>
              </div>
            ) : (
              <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full p-6 hover:shadow-lg transition-shadow" hover>
                <div className="flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-full ${service.color} flex items-center justify-center mb-4`}>
                    <SafeIcon icon={service.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-auto self-start"
                    onClick={() => document.getElementById('find-professional').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Talk to an Advisor
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
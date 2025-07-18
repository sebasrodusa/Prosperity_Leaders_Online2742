import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiGlobe, FiBookOpen, FiDollarSign } = FiIcons;

const JoinTeam = () => {
  const [recruitingText, setRecruitingText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content_7a8b9c')
          .select('content')
          .eq('key', 'recruiting_text')
          .single();

        if (error) throw error;
        setRecruitingText(data.content);
      } catch (error) {
        console.error('Error fetching recruiting content:', error);
        setRecruitingText('Join our team of dedicated financial professionals who are making a difference in their communities while enjoying the freedom and rewards of an entrepreneurial career.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <section id="join-team" className="py-20 bg-gradient-to-br from-[#0044AA] to-[#003399]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Looking for a career with purpose and flexibility?</h2>
            <div className="mt-2 h-1 w-20 bg-white"></div>
            
            {loading ? (
              <div className="animate-pulse mt-6 space-y-3">
                <div className="h-4 bg-blue-800/30 rounded w-5/6"></div>
                <div className="h-4 bg-blue-800/30 rounded"></div>
                <div className="h-4 bg-blue-800/30 rounded w-4/6"></div>
              </div>
            ) : (
              <p className="mt-6 text-xl text-blue-100">
                {recruitingText}
              </p>
            )}

            <div className="mt-10 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={FiGlobe} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Work from anywhere</h3>
                  <p className="mt-2 text-blue-100">Build your business remotely or in-person, with flexible hours that fit your lifestyle.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={FiBookOpen} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Paid training</h3>
                  <p className="mt-2 text-blue-100">Comprehensive training and mentorship to help you succeed, even if you're new to the industry.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Commission-based income with support</h3>
                  <p className="mt-2 text-blue-100">Unlimited earning potential with the backing of an experienced team and proven systems.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link to="/sebasrodusa-recruiting">
                <Button
                  size="lg"
                  className="bg-white text-[#0044AA] hover:bg-blue-50 font-semibold"
                >
                  Explore Career Paths
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl max-w-xs">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=100&h=100"
                  alt="Team member"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Maria G.</h4>
                  <p className="text-sm text-gray-600">Financial Professional</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"Joining Prosperity Leaders changed my life. I help families secure their future while building my own business."</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
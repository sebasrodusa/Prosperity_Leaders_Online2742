import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGlobe } = FiIcons;

const Footer = () => {
  const [legalText, setLegalText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content_7a8b9c')
          .select('content')
          .eq('key', 'legal_disclaimer')
          .single();

        if (error) throw error;
        setLegalText(data.content);
      } catch (error) {
        console.error('Error fetching legal disclaimer:', error);
        setLegalText('Prosperity Leaders™ is an independent marketing organization. Financial professionals are independent contractors and not employees of Prosperity Leaders™. Products and services offered through various carriers. Not available in all states.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Prosperity Leaders™</h2>
              <p className="mt-1 text-sm text-gray-400">Faith. Family. Finance.</p>
            </div>
            <p className="text-gray-400 text-sm">
              Helping families build generational wealth and secure their financial future since 2015.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <SafeIcon icon={FiFacebook} className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <SafeIcon icon={FiTwitter} className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <SafeIcon icon={FiInstagram} className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <SafeIcon icon={FiLinkedin} className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Our Team
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#services" className="text-gray-400 hover:text-white transition-colors">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-gray-400 hover:text-white transition-colors">
                  Retirement Planning
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-gray-400 hover:text-white transition-colors">
                  College Savings
                </Link>
              </li>
              <li>
                <Link to="#services" className="text-gray-400 hover:text-white transition-colors">
                  Wealth Accumulation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Financial Calculator
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} Prosperity Leaders™. All rights reserved.</p>
              
              {loading ? (
                <div className="animate-pulse mt-2">
                  <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded mt-1 w-5/6"></div>
                </div>
              ) : (
                <p className="mt-2 max-w-3xl">
                  {legalText}
                </p>
              )}
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-sm text-gray-400 mr-2">Language:</span>
              <button className="flex items-center text-gray-400 hover:text-white">
                <SafeIcon icon={FiGlobe} className="mr-1 w-4 h-4" />
                <span>English</span>
              </button>
              <span className="mx-2 text-gray-600">|</span>
              <button className="text-gray-400 hover:text-white">Español</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
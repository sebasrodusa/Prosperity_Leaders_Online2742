import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '../../data/mockUsers';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiSearch, FiUser } = FiIcons;

const FindProfessional = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Simple search logic using mock data
    setTimeout(() => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      const term = searchTerm.toLowerCase();
      const results = mockUsers.filter(
        user => 
          user.full_name.toLowerCase().includes(term) || 
          user.username.toLowerCase().includes(term)
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500); // Simulated delay for API call
  };

  const goToUserPage = (username) => {
    navigate(`/${username}`);
  };

  return (
    <section id="find-professional" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Find a Financial Professional</h2>
          <div className="mt-2 h-1 w-20 bg-[#00AAFF] mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600">
            Already working with someone? Find their page.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  placeholder="Search by name or username"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching}
                className="flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiSearch} className="w-5 h-5" />
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </Button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium text-gray-700 mb-4">Search Results:</h3>
                <div className="space-y-4">
                  {searchResults.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <img 
                          src={user.profile_photo_url} 
                          alt={user.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => goToUserPage(user.username)}
                        className="flex items-center space-x-2"
                      >
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>View Profile</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchTerm && searchResults.length === 0 && !isSearching && (
              <div className="mt-6 text-center py-8">
                <p className="text-gray-600">No financial professionals found matching "{searchTerm}"</p>
                <p className="mt-2 text-gray-500">Try a different search term or contact us for assistance.</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Need help finding the right financial professional for your needs?
              </p>
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default FindProfessional;
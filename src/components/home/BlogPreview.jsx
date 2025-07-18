import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiArrowRight } = FiIcons;

const BlogPreview = () => {
  const [blogIntro, setBlogIntro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content_7a8b9c')
          .select('content')
          .eq('key', 'blog_intro')
          .single();

        if (error) throw error;
        setBlogIntro(data.content);
      } catch (error) {
        console.error('Error fetching blog intro:', error);
        setBlogIntro('Discover practical financial insights and inspiration to help you make informed decisions about your family\'s financial future.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Mock blog posts (would come from Supabase in production)
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Secure Your Family's Financial Future",
      excerpt: "Discover practical strategies to protect and grow your wealth for generations to come.",
      image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80",
      author: "Sebastian Rodriguez",
      date: "October 15, 2023"
    },
    {
      id: 2,
      title: "Understanding Life Insurance: A Beginner's Guide",
      excerpt: "Learn the basics of life insurance and how it can provide security for your loved ones.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80",
      author: "Maria Gonzalez",
      date: "September 28, 2023"
    },
    {
      id: 3,
      title: "College Planning: Start Early, Finish Strong",
      excerpt: "How to create a solid financial plan for your children's education from day one.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80",
      author: "David Chen",
      date: "August 12, 2023"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Financial Tips & Inspiration</h2>
          <div className="mt-2 h-1 w-20 bg-[#00AAFF] mx-auto"></div>
          
          {loading ? (
            <div className="animate-pulse mt-6 max-w-3xl mx-auto">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-5/6 mx-auto"></div>
            </div>
          ) : (
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
              {blogIntro}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full overflow-hidden" hover>
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link to="#" className="inline-flex items-center text-[#0044AA] hover:text-[#00AAFF] font-medium">
                    <span>Read More</span>
                    <SafeIcon icon={FiArrowRight} className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-[#0044AA] text-[#0044AA] hover:bg-[#0044AA] hover:text-white transition-colors"
          >
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
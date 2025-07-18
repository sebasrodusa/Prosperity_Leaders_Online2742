import React from 'react';
import HomeNavbar from '../home/HomeNavbar';
import Hero from '../home/Hero';
import About from '../home/About';
import Services from '../home/Services';
import JoinTeam from '../home/JoinTeam';
import FindProfessional from '../home/FindProfessional';
import ContactForm from '../home/ContactForm';
import BlogPreview from '../home/BlogPreview';
import Footer from '../home/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />
      <Hero />
      <About />
      <Services />
      <JoinTeam />
      <FindProfessional />
      <BlogPreview />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default HomePage;
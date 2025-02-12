import React from 'react';
import Layout from '../components/Layout';
import Carousel from '../components/Carousel';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const carouselImages = [
    {
      src: '/images/banner1.jpg',
      alt: 'ELLAS Platform',
      caption: 'Open Data for Gender Equity in Science and Technology'
    },
    // Add more images
  ];

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        {/* Hero Section */}
        <section className="relative">
          <Carousel images={carouselImages} />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Open Data for Gender Equity
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
                Promoting equality in Science and Technology across Latin America
              </p>
              <Link
                to="/open-data"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors"
              >
                Explore Data
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Latin America in Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add feature cards */}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-100 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join the Initiative
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Help us promote gender equity in STEM fields across Latin America
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-purple-700 transition-colors">
              Get Started
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage; 
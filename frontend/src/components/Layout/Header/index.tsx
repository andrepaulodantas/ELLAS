import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';

const Header: React.FC = () => {
  const { translations } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-14">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/images/ellas-logo.png"
                alt="ELLAS Logo"
                className="h-6 md:h-8 w-auto"
              />
              <span className="ml-2 text-sm md:text-base font-medium text-purple-700 hidden sm:block">
                ELLAS
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              {translations.about || 'About'}
            </Link>
            <button className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 transition-colors">
              {translations.login || 'Login'}
            </button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100">
            <div className="px-4 py-2 space-y-1">
              <Link 
                to="/about" 
                className="block py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {translations.about || 'About'}
              </Link>
              <div className="pt-2 pb-3">
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition-colors">
                  {translations.login || 'Login'}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 
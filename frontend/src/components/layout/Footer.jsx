import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Instagram, X, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-7 h-7 text-primary-400" />
              <span className="text-xl font-bold text-white">Voyager AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered travel planning that creates personalized itineraries for your dream vacations.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-accent-400 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-accent-400 transition"
              >
                <X className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-accent-400 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-300 transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-300 transition">About Us</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-primary-300 transition">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-primary-300 transition">Register</Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/trips/new" className="text-gray-400 hover:text-primary-300 transition">
                  AI Trip Planning
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-300 transition">
                  Itinerary Management
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-300 transition">
                  Location Discovery
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary-300 transition">
                  Travel Guides
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary-400" />
                <span>Pune, MH, India</span>
              </li>
              {/* <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-400" />
                <span>(123) 456-7890</span>
              </li> */}
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-400" />
                <span>prajwalg2812@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Voyager AI. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary-300 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
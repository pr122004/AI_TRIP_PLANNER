import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Globe, Clock, BrainCircuit, Cloud } from 'lucide-react';
import heroBg from '../assets/heroBg.mp4';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-24"
    >
      <video
  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto h-auto max-w-none min-w-full min-h-full object-contain"
  src={heroBg}
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
/>




<section className="relative h-screen flex items-center -mt-24 overflow-hidden">
  

  {/* Foreground Content */}
  <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between w-full h-full px-6 md:px-4">
    {/* Text Content */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="w-full md:w-full"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
        AI-Powered Travel Planning Made Simple
      </h1>
      <p className="text-xl md:text-2xl text-gray-200">
        Create personalized trip itineraries with AI that adapts to your preferences and travel style.
      </p>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <Link
          to="/login"
          className="btn bg-accent-500 hover:bg-accent-600 text-white py-3 px-8 rounded-lg text-lg shadow-lg transform transition hover:-translate-y-1"
        >
          Start Planning
        </Link>
      </div>
    </motion.div>
  </div>
</section>


      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Better Trips with AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-500">
              Our smart travel planner uses advanced AI to create personalized itineraries that match your unique preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="w-10 h-10 text-accent-500" />,
                title: "AI-Powered Planning",
                description: "Our advanced AI learns your preferences to create personalized trip itineraries tailored just for you."
              },
              {
                icon: <MapPin className="w-10 h-10 text-accent-500" />,
                title: "Discover Hidden Gems",
                description: "Find unique locations and experiences that match your interests, not just the popular tourist spots."
              },
              {
                icon: <Calendar className="w-10 h-10 text-accent-500" />,
                title: "Smart Scheduling",
                description: "Optimize your daily plans for the best experience, with the perfect balance of activities and relaxation."
              },
              {
                icon: <Clock className="w-10 h-10 text-accent-500" />,
                title: "Real-Time Updates",
                description: "Receive timely updates about weather changes, traffic conditions, and venue closures affecting your plans."
              },
              {
                icon: <Cloud className="w-10 h-10 text-accent-500" />,
                title: "Weather Integration",
                description: "Plan around weather forecasts to make the most of your trip, with indoor alternatives for rainy days."
              },
              {
                icon: <Globe className="w-10 h-10 text-accent-500" />,
                title: "Google Maps Integration",
                description: "Seamlessly get directions to your destinations with one-click Google Maps integration."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="card p-6 dark:bg-black shadow-xl hover:shadow-2xl dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-500">
              Creating your perfect travel itinerary is easier than ever with our intuitive 3-step process.
            </p>
          </div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary-200 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  step: 1,
                  title: "Tell Us About Your Trip",
                  description: "Enter your destination, travel dates, preferences, and interests to help our AI understand what you're looking for."
                },
                {
                  step: 2,
                  title: "AI Creates Your Itinerary",
                  description: "Our AI generates a personalized day-by-day itinerary with activities, attractions, restaurants, and travel times."
                },
                {
                  step: 3,
                  title: "Customize & Explore",
                  description: "Fine-tune your plan, get directions with Google Maps integration, and enjoy your perfectly planned trip."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="card bg-white dark:bg-black p-8 text-center rounded-2xl shadow-xl hover:shadow-2xl dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] relative"
                >
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full mt-6 bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-18 mb-4">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
    </motion.div>
  );
};

export default HomePage;
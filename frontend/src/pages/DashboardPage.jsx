import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { PlusCircle, MapPin, Calendar, Cloud, Sun, CloudRain } from 'lucide-react';
import { fetchTrips } from '../redux/tripSlice';
import TripCard from '../components/trips/TripCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user }= useSelector(state => state.auth);
  console.log(user);
  const { trips, loading, error } = useSelector(state => state.trips);

  useEffect(() => {
    dispatch(fetchTrips());
  }, [dispatch]);

  // Mock weather data for demonstration
  const weatherData = {
    upcoming: [
      { city: 'Paris', date: '2023-12-15', temp: 12, condition: 'partly-cloudy' },
      { city: 'Rome', date: '2023-12-24', temp: 18, condition: 'sunny' }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Welcome Section */}
      <section className="bg-primary-900 text-white rounded-xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800" />
        <div className="absolute inset-0 opacity-20 bg-pattern" 
             style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-primary-700 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome!'}</h1>
              <p className="text-primary-200">Let's plan your next adventure</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            <Link to="/trips/new" className="btn bg-accent-500 hover:bg-accent-600 text-white py-3 px-6 rounded-lg inline-flex items-center">
              <PlusCircle className="w-5 h-5 mr-2" />
              Create New Trip
            </Link>
            <Link to="/trips" className="btn bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 py-3 px-6 rounded-lg">
              View All Trips
            </Link>
          </div>
        </div>
      </section>

      {/* Trip Overview Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Trips</h2>
          <Link to="/trips" className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center">
            View all <span className="ml-1">→</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any trips yet. Start planning your next adventure!
            </p>
            <Link to="/trips/new" className="btn btn-primary">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip, index) => (
              <TripCard key={trip._id || index} trip={trip} />
            ))}
            
            <Link 
              to="/trips/new" 
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-all h-full min-h-[220px]"
            >
              <PlusCircle className="w-12 h-12 mb-3" />
              <span className="font-medium">Create New Trip</span>
            </Link>
          </div>
        )}
      </section>

      {/* Weather Overview for Upcoming Trips */}
      {weatherData.upcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Weather for Upcoming Trips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weatherData.upcoming.map((item, index) => (
              <div key={index} className="card p-6 flex items-center">
                <div className="flex-shrink-0 mr-6">
                  {item.condition === 'sunny' ? (
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Sun className="w-10 h-10 text-yellow-500" />
                    </div>
                  ) : item.condition === 'rainy' ? (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <CloudRain className="w-10 h-10 text-blue-500" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Cloud className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <h3 className="font-medium text-gray-900">{item.city}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-900">{item.temp}°C</span>
                    <span className="ml-2 text-gray-600 text-sm capitalize">{item.condition.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default DashboardPage;
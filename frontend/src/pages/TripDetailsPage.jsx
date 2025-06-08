import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock, Edit, Trash2, Download, Share2, ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchTripById, deleteTrip } from '../redux/tripSlice.js';
import DayItinerary from '../components/trips/DayItinerary';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { toast } from 'react-toastify';

const TripDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedTrip, loading, error } = useSelector(state => state.trips);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTripById(id));
    }
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteTrip(id)).unwrap();
      toast.success('Trip deleted successfully');
      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error(error || 'Failed to delete trip');
    }
  };

  const handleDirections = (location) => {
    // Open Google Maps with the location
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-3">Error</h2>
        <p>{error}</p>
        <Link to="/dashboard" className="btn btn-primary mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!selectedTrip) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
        <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      {/* Back button */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      {/* Trip Header */}
      <div className="relative bg-primary-900 text-white rounded-xl overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" 
             style={{ 
               backgroundImage: selectedTrip.imageUrl ? `url('${selectedTrip.imageUrl}')` : "url('https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&h=650')"
             }} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800/80" />
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">{selectedTrip.destination}</h1>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center text-primary-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {new Date(selectedTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(selectedTrip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex items-center text-primary-100">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{selectedTrip.duration} {selectedTrip.duration === 1 ? 'day' : 'days'}</span>
                </div>
                
                <div className="flex items-center text-primary-100">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{selectedTrip.travelers} {selectedTrip.travelers === 1 ? 'traveler' : 'travelers'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="btn bg-white/10 hover:bg-white/20 text-white inline-flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="btn bg-white/10 hover:bg-white/20 text-white inline-flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="btn bg-red-500/80 hover:bg-red-600 text-white inline-flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trip Details and Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar with trip details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Destination</dt>
                <dd className="mt-1 flex items-center">
                  <MapPin className="w-4 h-4 text-primary-500 mr-1" />
                  {selectedTrip.destination}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Travel Dates</dt>
                <dd className="mt-1 flex items-start">
                  <Calendar className="w-4 h-4 text-primary-500 mr-1 mt-1" />
                  <div>
                    <div>{new Date(selectedTrip.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div>to</div>
                    <div>{new Date(selectedTrip.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Travelers</dt>
                <dd className="mt-1">{selectedTrip.travelers} {selectedTrip.travelers === 1 ? 'person' : 'people'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="mt-1 capitalize">{selectedTrip.budget}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Interests</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-md"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              
              {selectedTrip.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-700">{selectedTrip.notes}</dd>
                </div>
              )}
            </dl>
          </div>
          
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather Forecast</h2>
            
            <div className="text-center py-8">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                <Calendar className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-600">
                Weather forecast will be available 7 days before your trip.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main content with itinerary */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Your Itinerary</h2>
                <button className="btn btn-secondary inline-flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Itinerary
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                AI-generated itinerary for your trip to {selectedTrip.destination}
              </p>
            </div>
            
            <div className="p-6">
              {selectedTrip.itinerary && selectedTrip.itinerary.length > 0 ? (
                <div className="space-y-8">
                  {selectedTrip.itinerary.map((day, index) => (
                    <DayItinerary 
                      key={index} 
                      day={day} 
                      index={index} 
                      onGetDirections={handleDirections} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
                    <Clock className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your itinerary is being generated
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Our AI is working on creating your perfect trip plan. This might take a few moments.
                  </p>
                  <div className="animate-pulse flex justify-center gap-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Trip Map</h2>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTrip.destination)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 inline-flex items-center"
          >
            View in Google Maps <ExternalLink className="ml-1 w-4 h-4" />
          </a>
        </div>
        
        <div className="h-80 bg-gray-200 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => handleDirections(selectedTrip.destination)}
              className="btn btn-primary inline-flex items-center"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Open in Google Maps
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone."
        confirmText="Delete Trip"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </motion.div>
  );
};

export default TripDetailsPage;
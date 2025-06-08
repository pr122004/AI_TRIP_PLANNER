import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { createTrip } from '../redux/tripSlice.js';

const NewTripPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: 'medium',
    interests: [],
    pace: 'moderate',
    accommodation: '',
    notes: ''
  });
  const [generating, setGenerating] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.trips);

  const interestOptions = [
    'Museums', 'Food', 'Nightlife', 'Shopping', 'Nature', 
    'Beach', 'History', 'Architecture', 'Art', 'Adventure',
    'Local Culture', 'Relaxation', 'Photography', 'Theme Parks', 'Sports'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          interests: [...prev.interests, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          interests: prev.interests.filter(interest => interest !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Check if end date is after start date
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        toast.error("End date must be after start date");
        return;
      }
    }
    
    if (step === 2) {
      // Validate second step
      if (formData.interests.length === 0) {
        toast.error("Please select at least one interest");
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setGenerating(true);
      
      // Calculate trip duration
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      
      const tripData = {
        ...formData,
        duration
      };
      
      const result = await dispatch(createTrip(tripData)).unwrap();
      toast.success("Trip created successfully!");
      navigate(`/trips/${result._id}`);
    } catch (error) {
      toast.error(error || "Failed to create trip. Please try again.");
      setGenerating(false);
    }
  };

  // Calculate trip duration for display
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return diff > 0 ? diff : null;
  };

  const duration = calculateDuration();

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className={`w-3 h-3 rounded-full ${
            step === i ? 'bg-primary-600' : 
            step > i ? 'bg-primary-400' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plan Your Trip</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Let our AI create a personalized itinerary just for you
        </p>
      </div>
      
      {renderStepIndicator()}
      
      <div className="bg-white dark:bg-black rounded-xl shadow-sm overflow-hidden mb-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Trip Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Trip Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Paris, France"
                    className="input"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    id="travelers"
                    name="travelers"
                    value={formData.travelers}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    className="input"
                  />
                </div>
                
                {duration && (
                  <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="text-primary-800 font-medium">
                        Trip Duration: {duration} {duration === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Preferences */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary-600" />
                Your Preferences
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Travel Budget
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['budget', 'medium', 'luxury'].map((option) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`budget-${option}`}
                          name="budget"
                          value={option}
                          checked={formData.budget === option}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`budget-${option}`}
                          className={`block text-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.budget === option
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-primary-300'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Interests (select at least one) <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                      <div key={interest} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`interest-${interest}`}
                          name="interests"
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`interest-${interest}`}
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Travel Pace
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['relaxed', 'moderate', 'busy'].map((option) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`pace-${option}`}
                          name="pace"
                          value={option}
                          checked={formData.pace === option}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`pace-${option}`}
                          className={`block text-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.pace === option
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-300 hover:border-primary-300'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Additional Info */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                Final Details
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preferred Accommodation
                  </label>
                  <select
                    id="accommodation"
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleChange}
                    className="input dark:bg-black"
                  >
                    <option value="">No preference</option>
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment/Vacation Rental</option>
                    <option value="resort">Resort</option>
                    <option value="budget">Budget-friendly</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Additional Notes or Special Requests
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Any special requirements, preferences, or places you'd specifically like to visit..."
                    className="input"
                  ></textarea>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-100">
                  <h3 className="font-medium text-cyan-800 mb-2">Trip Summary</h3>
                  <ul className="space-y-2 text-sm text-cyan-700">
                    <li className="flex">
                      <span className="font-medium w-28">Destination:</span>
                      <span>{formData.destination}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-28">Dates:</span>
                      <span>
                        {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {duration && ` (${duration} ${duration === 1 ? 'day' : 'days'})`}
                      </span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-28">Travelers:</span>
                      <span>{formData.travelers}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-28">Budget:</span>
                      <span className="capitalize">{formData.budget}</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium w-28">Interests:</span>
                      <span>{formData.interests.join(', ')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Navigation buttons */}
          <div className="p-6 border-t border-gray-200 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-secondary"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary inline-flex items-center"
              >
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || generating}
                className={`btn btn-accent inline-flex items-center ${(loading || generating) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Generating your plan...
                  </>
                ) : (
                  'Create My Itinerary'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default NewTripPage;
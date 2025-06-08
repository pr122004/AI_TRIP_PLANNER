import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Coffee, Utensils, Bed, Footprints, Camera, Car, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const DayItinerary = ({ day, index, onGetDirections }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0); // Expand first day by default
  
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'breakfast':
      case 'coffee':
        return <Coffee className="w-4 h-4" />;
      case 'lunch':
      case 'dinner':
      case 'food':
      case 'restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'hotel':
      case 'accommodation':
      case 'check-in':
      case 'check-out':
        return <Bed className="w-4 h-4" />;
      case 'sightseeing':
      case 'tour':
      case 'visit':
        return <Camera className="w-4 h-4" />;
      case 'travel':
      case 'transport':
      case 'transfer':
        return <Car className="w-4 h-4" />;
      default:
        return <Footprints className="w-4 h-4" />;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Day Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
          isExpanded ? 'bg-primary-50' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            isExpanded ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
          }`}>
            <span className="font-bold">{index + 1}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Day {index + 1}: {day.title}</h3>
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{day.date}</span>
            </div>
          </div>
        </div>
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </button>
      
      {/* Day Details - Expandable */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-200">
              {day.description && (
                <p className="text-gray-700 mb-4">{day.description}</p>
              )}
              
              <div className="space-y-4">
                {day.activities.map((activity, actIndex) => (
                  <div key={actIndex} className="flex">
                    <div className="flex-shrink-0 w-16 text-sm text-gray-500 pt-0.5">
                      {activity.time}
                    </div>
                    
                    <div className="flex-shrink-0 flex flex-col items-center mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${actIndex === 0 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {actIndex < day.activities.length - 1 && (
                        <div className="w-0.5 bg-gray-200 h-full mt-1" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 hover:border-primary-200 transition-colors">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        {activity.location && (
                          <div className="flex items-center text-gray-600 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span>{activity.location}</span>
                            
                            <button
                              onClick={() => onGetDirections(activity.location)}
                              className="ml-2 text-primary-600 hover:text-primary-700 inline-flex items-center"
                            >
                              <span className="text-xs underline">Get Directions</span>
                              <ExternalLink className="ml-1 w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {activity.description && (
                          <p className="text-gray-700 text-sm mt-2">{activity.description}</p>
                        )}
                        {activity.notes && (
                          <div className="mt-2 text-sm bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800">
                            <strong>Note:</strong> {activity.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DayItinerary;
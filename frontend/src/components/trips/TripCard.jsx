import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const TripCard = ({ trip }) => {
  // Use a default image if none is provided
  const backgroundImage = trip.imageUrl 
    ? `url('${trip.imageUrl}')`
    : "url('https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&h=350')";

  return (
    <div className="card group hover:shadow-md transition-all duration-300">
      <div 
        className="h-48 bg-cover bg-center relative rounded-t-xl overflow-hidden"
        style={{ backgroundImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-xl font-bold">{trip.destination}</h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start mb-3">
          <MapPin className="w-5 h-5 text-primary-500 mr-2 mt-0.5" />
          <div>
            <div className="font-medium">{trip.destination}</div>
            <div className="text-sm text-gray-600">{trip.duration} {trip.duration === 1 ? 'day' : 'days'}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {trip.interests && trip.interests.slice(0, 3).map((interest, index) => (
            <span 
              key={index}
              className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-md"
            >
              {interest}
            </span>
          ))}
          {trip.interests && trip.interests.length > 3 && (
            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
              +{trip.interests.length - 3} more
            </span>
          )}
        </div>
        
        <Link 
          to={`/trips/${trip._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center group-hover:underline"
        >
          View Trip <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default TripCard;
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import travelSpinner from '../../assets/travelSpinner.json'; 

const LoadingSpinner = ({ size = 'medium', useLottie = false, className = '' }) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const sizeClass = sizes[size] || sizes.medium;

  return (
    <div className={`flex items-center justify-center ${sizeClass} ${className}`}>
      {useLottie ? (
        <Player
          autoplay
          loop
          src={travelSpinner}
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <svg
          className="animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
              5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 
              3 7.938l3-2.647z"
          />
        </svg>
      )}
    </div>
  );
};

export default LoadingSpinner;

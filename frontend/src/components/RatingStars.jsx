import React from 'react';
import { assets } from '../assets/assets';

const RatingStars = ({ value = 0, size = 'w-3 h-3' }) => {
  // Ensure value is between 0 and 5
  const rating = Math.max(0, Math.min(5, value));
  
  // Calculate full stars and check for half star
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className='flex items-center gap-1'>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <img 
          key={`full-${i}`} 
          src={assets.star_icon} 
          alt="★" 
          className={size} 
        />
      ))}
      
      {/* Half star - if no half icon, show empty star (rounded down) */}
      {hasHalfStar && (
        <img 
          src={assets.star_dull_icon} 
          alt="½" 
          className={size} 
          style={{ opacity: 0.5 }}
        />
      )}
      
      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <img 
          key={`empty-${i}`} 
          src={assets.star_dull_icon} 
          alt="☆" 
          className={size} 
        />
      ))}
    </div>
  );
};

export default RatingStars;


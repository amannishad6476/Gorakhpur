import { useState } from 'react';

const StarRating = ({ rating = 0, maxStars = 5, onRate, size = 'md', readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  const sizeClasses = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl', xl: 'text-3xl' };

  return (
    <div className={`flex gap-1 ${sizeClasses[size]}`}>
      {Array.from({ length: maxStars }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          className={`cursor-${readonly ? 'default' : 'pointer'} transition-transform ${!readonly && 'hover:scale-125'} select-none`}
          style={{ color: star <= (hovered || rating) ? '#d4a017' : '#d1d5db' }}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

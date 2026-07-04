import { Star } from 'lucide-react';
import { useState } from 'react';

export default function RatingStars({ rating = 0, onRate, size = 18, interactive = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`rating-star ${(hover || rating) >= star ? 'filled' : ''}`}
          fill={(hover || rating) >= star ? 'var(--accent)' : 'none'}
          color={(hover || rating) >= star ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(star)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        />
      ))}
    </div>
  );
}

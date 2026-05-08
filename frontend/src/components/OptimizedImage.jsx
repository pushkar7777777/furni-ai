import React, { useState, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "", 
  aspectRatio = "aspect-square",
  fallback = "🪑"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${containerClassName} bg-white/5`}>
      {/* Shimmer/Placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
             style={{ backgroundSize: '200% 100%' }} />
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#A67B5B]/10">
          <span className="text-4xl opacity-50">{fallback}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${className}`}
        />
      )}
    </div>
  );
};

export default OptimizedImage;

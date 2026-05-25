import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Animated book icon */}
      <div className="relative">
        <div className="text-6xl animate-float">📖</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-pulse">✨</div>
        <div className="absolute -bottom-1 -left-2 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>
      
      {/* Loading bar */}
      <div className="mt-8 w-48 h-2 bg-lavender-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-lavender-400 to-lavender-600 rounded-full animate-loading-bar"></div>
      </div>
      
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0; }
          50% { width: 70%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

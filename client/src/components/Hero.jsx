import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 px-4">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">⭐</div>
        <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>🌙</div>
        <div className="absolute bottom-20 left-1/4 text-4xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-40 right-1/3 text-5xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>🧸</div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Logo/Icon */}
        <div className="mb-8">
          <span className="text-7xl md:text-8xl">📖</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-300 mb-6 leading-tight">
          Turn Your Baby's Photos Into{' '}
          <span className="font-display text-yellow-300 block mt-2">
            Magical Bedtime Storybooks
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Create a personalized storybook featuring your little one as the star. 
          Perfect for bedtime reading and treasured memories.
        </p>

        {/* CTA Button */}
        <Link to="/create" className="btn-primary inline-block text-lg">
          Create Your Storybook ✨
        </Link>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            <span>Beautiful Designs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>Ready in Minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💾</span>
            <span>Instant Download</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

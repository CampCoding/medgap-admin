"use client";


import React, { useState, useEffect, useRef } from 'react';

const PopularClassesAbout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredItem, setHoveredItem] = useState(null);
  const sectionRef = useRef(null);

  const learningFeatures = [
    { icon: "🌍", text: "Cultural Immersion Programs", delay: 0.1 },
    { icon: "📚", text: "Modern Standard Arabic (MSA)", delay: 0.2 },
    { icon: "💻", text: "Flexible Online Learning Options", delay: 0.3 },
    { icon: "💬", text: "Conversational Arabic Training", delay: 0.4 },
    { icon: "👥", text: "Group Arabic Classes", delay: 0.5 },
    { icon: "✈️", text: "Arabic for Travelers & Expats", delay: 0.6 },
    { icon: "👨‍🏫", text: "Personalized One-to-One Lessons", delay: 0.7 },
    { icon: "🏛️", text: "Egyptian Colloquial Arabic (ECA)", delay: 0.8 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Floating Circles */}
        <div 
          className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-red-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-teal-200/25 to-cyan-300/15 rounded-full blur-2xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`,
            animationDuration: '3s',
            animationDelay: '1s'
          }}
        />
        
        {/* Geometric Shapes */}
        <div 
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-lg rotate-45 animate-spin"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-32 right-32 w-12 h-12 bg-gradient-to-l from-blue-300/25 to-indigo-300/15 rounded-full animate-bounce"
          style={{ animationDuration: '3s' }}
        />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Image Section */}
          <div className="relative">
            {/* Image Container with Advanced Effects */}
            <div 
              className={`relative transform transition-all duration-1500 ease-out ${
                isVisible 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-16 opacity-0 scale-95'
              }`}
            >
              {/* Main Image Placeholder with Gradient */}
              <img src="https://egyptianinstitute.com/wp-content/uploads/2025/01/img_4.png" alt="" />

              {/* Decorative Elements */}
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-orange-200/50 to-teal-200/50 rounded-3xl blur-xl"></div>
            </div>

            {/* Bottom Colored Bars */}
            <div 
              className={`flex mt-8 space-x-4 transform transition-all duration-1200 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="h-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex-1 animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex-1 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-4 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex-1 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            
            {/* Tag */}
            <div 
              className={`transform transition-all duration-1000 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold rounded-full shadow-lg animate-glow">
                OUR POPULAR CLASSES
              </span>
            </div>

            {/* Main Title */}
            <h2 
              className={`text-4xl md:text-5xl lg:text-6xl font-black text-gray-800 leading-tight transform transition-all duration-1200 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              Learn Arabic the{' '}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Right Way
              </span>
              , with the{' '}
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Right Approach
              </span>
            </h2>

            {/* Description */}
            <p 
              className={`text-xl text-gray-600 leading-relaxed transform transition-all duration-1400 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              We offer a unique learning experience that combines modern techniques with cultural 
              immersion, making Arabic learning easy and enjoyable.
            </p>

            {/* Features List */}
            <div className="grid md:grid-cols-2 gap-4">
              {learningFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group flex items-center space-x-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg hover:shadow-xl transform transition-all duration-500 cursor-pointer ${
                    isVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${600 + feature.delay * 1000}ms`,
                    transform: hoveredItem === index ? 'scale(1.02) translateY(-2px)' : ''
                  }}
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full group-hover:animate-ping"></div>
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                        {feature.text}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
         <section className= 'mt-10 '>
          <img src="/images/5393410-2048x1152.jpg" className='mx-auto rounded-2xl shadow-2xl' alt="" />
        </section>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.4); }
          50% { box-shadow: 0 0 30px rgba(20, 184, 166, 0.7); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default PopularClassesAbout;
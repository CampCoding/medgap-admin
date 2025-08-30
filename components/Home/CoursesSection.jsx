"use client";


import React, { useState, useEffect } from 'react';

const CoursesSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const courses = [
    {
      id: 1,
      title: "Egyptian Arabic Courses",
      description: "Learn the vibrant dialect of Egypt and immerse yourself in the local culture and daily conversations.",
      bgColor: "bg-white",
      textColor: "text-gray-800",
      accent: "bg-teal-500",
      hoverBg: "hover:bg-gray-50"
    },
    {
      id: 2,
      title: "Modern Standard Arabic Courses",
      description: "Master the universal Arabic language used in media, literature, and formal communication worldwide.",
      bgColor: "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600",
      textColor: "text-white",
      accent: "bg-white",
      hoverBg: "hover:from-teal-500 hover:via-teal-600 hover:to-teal-700",
      featured: true
    },
    {
      id: 3,
      title: "Kids Classes",
      description: "Fun, interactive, and engaging lessons designed to make learning Arabic enjoyable for young learners.",
      bgColor: "bg-white",
      textColor: "text-gray-800",
      accent: "bg-teal-500",
      hoverBg: "hover:bg-gray-50"
    },
    {
      id: 4,
      title: "One-to-One Classes",
      description: "Personalized lessons tailored to fit your pace, goals, and learning preferences for maximum progress.",
      bgColor: "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600",
      textColor: "text-white",
      accent: "bg-white",
      hoverBg: "hover:from-teal-500 hover:via-teal-600 hover:to-teal-700"
    }
  ];

  const CourseCard = ({ course, index }) => {
    const isHovered = hoveredCard === course.id;
    const delay = index * 150;

    return (
      <div
        className={`
          relative overflow-hidden h-full rounded-2xl shadow-lg transition-all duration-700 ease-out transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          ${course.hoverBg}
          ${isHovered ? 'scale-105 shadow-2xl -translate-y-2' : 'scale-100'}
          ${course.bgColor}
          group cursor-pointer
        `}
        style={{ 
          transitionDelay: isVisible ? `${delay}ms` : '0ms',
          backgroundImage: course.bgColor.includes('gradient') ? '' : 'radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.08) 0%, transparent 50%)'
        }}
        onMouseEnter={() => setHoveredCard(course.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-4 right-4 w-20 h-20 rounded-full ${course.accent} transform transition-transform duration-700 ${isHovered ? 'scale-150 rotate-180' : 'scale-100'}`}></div>
          <div className={`absolute bottom-8 left-8 w-12 h-12 rounded-full ${course.accent} transform transition-transform duration-500 ${isHovered ? 'scale-125 -rotate-90' : 'scale-100'}`}></div>
          <div className={`absolute top-1/2 left-4 w-6 h-6 rounded-full ${course.accent} transform transition-transform duration-600 ${isHovered ? 'scale-110 rotate-45' : 'scale-100'}`}></div>
        </div>

        {/* Content */}
        <div className="relative p-8 h-full flex flex-col">
          {/* Course number */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-all duration-500
            ${course.accent} ${course.id === 2 || course.id === 4 ? 'text-teal-600' : 'text-white'}
            ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}
          `}>
            <span className="text-lg font-bold">{course.id}</span>
          </div>

          {/* Title */}
          <h3 className={`
            text-2xl font-bold mb-4 transition-all duration-300
            ${course.textColor}
            ${isHovered ? 'transform translate-x-2' : ''}
          `}>
            {course.title}
          </h3>

          {/* Description */}
          <p className={`
            text-base leading-relaxed mb-8 flex-grow transition-all duration-300
            ${course.textColor} ${course.textColor === 'text-white' ? 'opacity-90' : 'opacity-75'}
            ${isHovered ? 'opacity-100' : ''}
          `}>
            {course.description}
          </p>

          {/* Learn More Button */}
          <button className={`
            px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wide
            transition-all duration-300 transform
            ${course.id === 2 || course.id === 4 
              ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30' 
              : 'bg-teal-500 text-white hover:bg-teal-600'
            }
            ${isHovered ? 'scale-105 shadow-lg' : 'scale-100'}
            backdrop-blur-sm
          `}>
            <span className="flex items-center justify-center">
              Learn More
              <svg 
                className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Hover glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
          bg-gradient-to-r from-transparent via-white/5 to-transparent
        `}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`
          text-center mb-16 transition-all duration-1000 transform
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        `}>
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-600 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            Featured Courses
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-gray-800 via-teal-600 to-gray-800 bg-clip-text text-transparent">
            Featured Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore a variety of Arabic language programs designed to suit learners of all ages and levels, from beginners to advanced speakers.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8  mx-auto">
          {courses.map((course, index) => (
            <div 
              key={course.id}
              className={`h-full
                ${course.id === 2 ? 'lg:col-span-1 lg:row-span-1' : ''}
                ${course.id === 4 ? 'lg:col-span-1' : ''}
              `}
            >
              <CourseCard course={course} index={index} />
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-teal-300 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-1 h-1 bg-blue-300 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default CoursesSection;
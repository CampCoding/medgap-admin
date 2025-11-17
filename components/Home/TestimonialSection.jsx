"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
  Play,
  Pause,
} from "lucide-react";

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [animationDirection, setAnimationDirection] = useState("next");

  const autoPlayRef = useRef(null);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Ahmed",
      role: "Business Professional",
      company: "Tech Solutions Inc.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The Arabic learning experience has been absolutely transformative. The cultural immersion programs and personalized approach helped me achieve fluency faster than I ever imagined possible. I can now confidently conduct business meetings in Arabic!",
      accent: "from-rose-400 to-pink-500",
      bgAccent: "from-rose-50 to-pink-50",
      location: "Dubai, UAE",
      courseCompleted: "Advanced Business Arabic",
      testimonialDate: "March 2024",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Travel Enthusiast & Blogger",
      company: "Wanderlust Adventures",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. The teaching methodology is exceptional and results-driven. I've traveled to 15 Arabic-speaking countries with confidence!",
      accent: "from-blue-400 to-indigo-500",
      bgAccent: "from-blue-50 to-indigo-50",
      location: "London, UK",
      courseCompleted: "Travel Arabic Intensive",
      testimonialDate: "February 2024",
    },
    {
      id: 3,
      name: "Layla Hassan",
      role: "University Student",
      company: "Cairo University",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The flexible learning paths and tailored curriculum made it possible for me to balance my studies while mastering Arabic. The instructors are incredibly supportive and knowledgeable. I achieved my dream of studying Arabic literature!",
      accent: "from-emerald-400 to-teal-500",
      bgAccent: "from-emerald-50 to-teal-50",
      location: "New York, USA",
      courseCompleted: "Academic Arabic Program",
      testimonialDate: "January 2024",
    },
    {
      id: 4,
      name: "Ahmed Al-Rashid",
      role: "Medical Professional",
      company: "International Hospital",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a healthcare professional working in diverse communities, mastering Arabic has been crucial. The medical Arabic specialization program exceeded my expectations. Now I can provide better care to Arabic-speaking patients with cultural sensitivity.",
      accent: "from-purple-400 to-violet-500",
      bgAccent: "from-purple-50 to-violet-50",
      location: "Toronto, Canada",
      courseCompleted: "Medical Arabic Certification",
      testimonialDate: "April 2024",
    },
  ];

  // Auto-play logic
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (isAutoPlaying && !isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
  }, [isAutoPlaying, isPaused]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // Initialize visibility and auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      stopAutoPlay();
    };
  }, [startAutoPlay, stopAutoPlay]);

  // Restart auto-play when settings change
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [
    currentTestimonial,
    isAutoPlaying,
    isPaused,
    startAutoPlay,
    stopAutoPlay,
  ]);

  // Navigation functions with enhanced logic
  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    setAnimationDirection("next");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  }, [isAnimating, testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (isAnimating) return;
    setAnimationDirection("prev");
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentTestimonial(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
      setTimeout(() => setIsAnimating(false), 100);
    }, 300);
  }, [isAnimating, testimonials.length]);

  const goToTestimonial = useCallback(
    (index) => {
      if (isAnimating || index === currentTestimonial) return;

      setAnimationDirection(index > currentTestimonial ? "next" : "prev");
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentTestimonial(index);
        setTimeout(() => setIsAnimating(false), 100);
      }, 300);
    },
    [isAnimating, currentTestimonial]
  );

  // Touch/Swipe logic
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    } else if (isRightSwipe) {
      prevTestimonial();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isVisible) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevTestimonial();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextTestimonial();
          break;
        case " ":
          e.preventDefault();
          toggleAutoPlay();
          break;
        case "Escape":
          setIsPaused(!isPaused);
          break;
        default:
          if (e.key >= "1" && e.key <= testimonials.length.toString()) {
            goToTestimonial(parseInt(e.key) - 1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isVisible,
    nextTestimonial,
    prevTestimonial,
    goToTestimonial,
    isPaused,
    testimonials.length,
  ]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Progress calculation
  const progress = ((currentTestimonial + 1) / testimonials.length) * 100;
  const current = testimonials[currentTestimonial];

  return (
    <div
      ref={sectionRef}
      className="min-h-screen relative bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-20 px-4  overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress Bar */}

      {/* Controls Panel */}
      <div className="absolute top-4 right-4 z-40 flex items-center space-x-2">
        <button
          onClick={toggleAutoPlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isAutoPlaying
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-600"
          } hover:scale-110 shadow-lg`}
          title={isAutoPlaying ? "Disable Auto-play" : "Enable Auto-play"}
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          {currentTestimonial + 1} / {testimonials.length}
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-xl animate-bounce-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Quote Mark */}
        <div
          className={`absolute top-0 right-8 md:right-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center shadow-2xl">
            <Quote className="w-10 h-10 md:w-12 md:h-12 text-white transform rotate-180" />
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`text-center pt-16 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Profile Section */}
          <div className="relative mb-12">
            <div
              className={`inline-block relative transform transition-all duration-500 ${
                isAnimating
                  ? animationDirection === "next"
                    ? "scale-95 opacity-70 translate-x-4"
                    : "scale-95 opacity-70 -translate-x-4"
                  : "scale-100 opacity-100 translate-x-0"
              }`}
            >
              {/* Animated Ring */}
              <div
                className={`absolute inset-0 w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${current.accent} animate-spin-slow opacity-20`}
              ></div>
              <div
                className={`absolute inset-2 w-28 h-28 mx-auto rounded-full bg-gradient-to-r ${current.accent} animate-pulse`}
              ></div>

              {/* Profile Image */}
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl"
                  loading="eager"
                />

                {/* Floating Heart */}
                <div className="absolute -top-2 -right-2">
                  <div
                    className={`w-8 h-8 bg-gradient-to-r ${current.accent} rounded-full flex items-center justify-center shadow-lg animate-bounce`}
                  >
                    <Heart className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute -bottom-2 -left-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

         

          {/* Star Rating */}
          <div
            className={`flex justify-center mb-8 transform transition-all duration-500 delay-200 ${
              isAnimating
                ? "translate-y-5 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {[...Array(current.rating)].map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 text-yellow-400 fill-current mx-1 transform transition-all duration-300 hover:scale-125 cursor-pointer`}
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => console.log(`Rated ${i + 1} stars`)}
              />
            ))}
            <span className="ml-3 text-slate-600 font-semibold">
              {current.rating}.0
            </span>
          </div>
          <div
            className={`mb-12 transform transition-all duration-500 delay-400 ${
              isAnimating
                ? "translate-y-5 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {current.name}
            </h3>
            <p className="text-slate-600 text-lg mb-1">{current.role}</p>
            <p className="text-slate-500 text-sm mb-2">{current.company}</p>
            <p className="text-slate-400 text-sm">
              Completed: {current.courseCompleted}
            </p>
          </div>

          {/* Testimonial Text */}
          <div
            className={`max-w-4xl mx-auto mb-12 transform transition-all duration-500 delay-300 ${
              isAnimating
                ? "translate-y-5 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-700 leading-relaxed font-light italic">
              "{current.text}"
            </p>
          </div>

          {/* Client Details */}

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            {/* Previous Button */}
            <button
              onClick={prevTestimonial}
              disabled={isAnimating}
              className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Previous testimonial (←)"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  onClick={() => goToTestimonial(index)}
                  disabled={isAnimating}
                  className={`transition-all duration-300 rounded-full relative group ${
                    index === currentTestimonial
                      ? `w-12 h-3 bg-gradient-to-r ${current.accent} shadow-lg`
                      : "w-3 h-3 bg-slate-300 hover:bg-slate-400 hover:scale-125"
                  }`}
                  title={`Go to ${testimonial.name}'s testimonial (${
                    index + 1
                  })`}
                >
                  {index === currentTestimonial && (
                    <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextTestimonial}
              disabled={isAnimating}
              className="w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed group"
              title="Next testimonial (→)"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-8 opacity-10">
          <User className="w-16 h-16 text-slate-400 animate-float" />
        </div>
        <div className="absolute bottom-1/4 right-8 opacity-10">
          <Star className="w-12 h-12 text-yellow-400 animate-spin-slow" />
        </div>

        {/* Background Pattern */}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TestimonialSection;

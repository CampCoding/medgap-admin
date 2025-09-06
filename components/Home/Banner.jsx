"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Download,
  Sparkles,
  Zap,
  Brain,
  Smartphone,
  ArrowRight,
  Star,
  Users,
  BarChart3,
} from "lucide-react";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Build Dynamic Question Banks",
      subtitle: "in Minutes",
      description:
        "Mix MCQs, essays & media—tag by topic, difficulty or unit with our intelligent system.",
      buttonText: "Start Building Free",
      features: [
        "AI-Powered Tagging",
        "Multi-Format Support",
        "Instant Preview",
      ],
      icon: Brain,
      stats: { number: "50K+", label: "Questions Created" },
      color: "primary",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Unlock Instant Insights",
      subtitle: "Real-Time Analytics",
      description:
        "Spot strengths & gaps instantly—drill down by class, student, or topic with precision.",
      buttonText: "See Live Demo",
      features: [
        "Live Performance Tracking",
        "Detailed Reports",
        "Smart Recommendations",
      ],
      icon: Zap,
      stats: { number: "94%", label: "Accuracy Rate" },
      color: "accent",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "Learn Anywhere",
      subtitle: "Anytime Access",
      description:
        "Web, iOS & Android apps with offline support for seamless learning on-the-go.",
      buttonText: "Download Apps",
      features: ["Cross-Platform Sync", "Offline Mode", "Progressive Learning"],
      icon: Smartphone,
      stats: { number: "1M+", label: "Active Learners" },
      color: "secondary",
    },
  ];

  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C",
    accent: "#8B5CF6",
    background: "#F9FAFC",
    text: "#202938",
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleSlideChange((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSlideChange = (newSlide) => {
    if (typeof newSlide === "function") {
      newSlide = newSlide(currentSlide);
    }
    if (newSlide !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(newSlide);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const nextSlide = () => handleSlideChange((currentSlide + 1) % slides.length);
  const prevSlide = () =>
    handleSlideChange((currentSlide - 1 + slides.length) % slides.length);

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;

  return (
    <div
      className="relative h-screen overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="mesh1" cx="50%" cy="50%" r="50%">
                <stop
                  offset="0%"
                  stopColor={colors.primary}
                  stopOpacity="0.3"
                />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="mesh2" cx="80%" cy="20%" r="60%">
                <stop offset="0%" stopColor={colors.accent} stopOpacity="0.2" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="mesh3" cx="20%" cy="80%" r="40%">
                <stop
                  offset="0%"
                  stopColor={colors.secondary}
                  stopOpacity="0.25"
                />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#mesh1)" />
            <rect width="100" height="100" fill="url(#mesh2)" />
            <rect width="100" height="100" fill="url(#mesh3)" />
          </svg>
        </div>
      </div>

      {/* Main Layout - Split Screen */}
      <div className="relative z-10 h-full flex">
        {/* Left Content Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 relative">
          {/* Floating Icon */}
          <div
            className={`absolute -top-4 -right-4 transition-all duration-700 ${
              isTransitioning ? "scale-0 rotate-180" : "scale-100 rotate-0"
            }`}
          >
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12"
              style={{
                background: `linear-gradient(135deg, ${
                  colors[currentSlideData.color]
                }, ${colors.accent})`,
              }}
            >
              <IconComponent className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Stats Badge */}
          <div
            className={`mb-6 transition-all duration-700 delay-100 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl shadow-lg"
              style={{
                background: `${colors[currentSlideData.color]}15`,
                border: `1px solid ${colors[currentSlideData.color]}30`,
              }}
            >
              <Star
                className="w-5 h-5"
                style={{ color: colors[currentSlideData.color] }}
              />
              <span
                className="font-bold text-2xl"
                style={{ color: colors[currentSlideData.color] }}
              >
                {currentSlideData.stats.number}
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {currentSlideData.stats.label}
              </span>
            </div>
          </div>

          {/* Main Title */}
          <div
            className={`mb-12 transform transition-all duration-700 ease-out ${
              isTransitioning
                ? "opacity-0 translate-y-8"
                : "opacity-100 translate-y-0"
            }`}
          >
            <h1
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight"
              style={{ color: colors.text }}
            >
              {currentSlideData.title}
            </h1>

            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-snug ">
              {currentSlideData.subtitle}
            </h2>
          </div>

          {/* Description */}
          <p
            className={`text-xl lg:text-2xl mb-8 max-w-2xl leading-relaxed transition-all duration-700 delay-300 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
            style={{ color: `${colors.text}CC` }}
          >
            {currentSlideData.description}
          </p>

          {/* Features List */}
          <div
            className={`mb-10 transition-all duration-700 delay-400 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentSlideData.features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  style={{
                    background: `${colors.background}80`,
                    border: `1px solid ${colors[currentSlideData.color]}20`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors[currentSlideData.color] }}
                  />
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.text }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div
            className={`transition-all flex flex-col space-y-3 md:space-y-0 md:flex-row items-center duration-700 delay-500 ${
              isTransitioning
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            <button
              className="group relative px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${
                  colors[currentSlideData.color]
                }, ${colors.accent})`,
                color: colors.background,
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {/* {currentSlideData.buttonText} */}
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                }}
              />
            </button>
            <button
              className="group ml-3 relative px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${
                  colors[currentSlideData.color]
                }, ${colors.accent})`,
                color: colors.background,
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play />
                Watch Demo
              </span>
              <div
                className="absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                }}
              />
            </button>
          </div>
        </div>

        {/* Right Visual Panel */}
        <div className="hidden lg:flex w-1/2 items-center justify-center p-8 relative">
          {/* Floating Cards */}
          <div className="relative w-full max-w-md">
            {/* Main Image Card */}
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-1000 ${
                isTransitioning
                  ? "scale-95 rotate-3 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }`}
              style={{
                background: `linear-gradient(135deg, ${
                  colors[currentSlideData.color]
                }20, ${colors.accent}10)`,
              }}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={currentSlideData.image}
                  alt={currentSlideData.title}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${
                      colors[currentSlideData.color]
                    }40, transparent 60%)`,
                  }}
                />
              </div>
            </div>

            {/* Floating Mini Cards */}
            <div
              className={`absolute -top-6 -right-6 transition-all duration-1000 delay-200 ${
                isTransitioning
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <div
                className="w-20 h-20 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-center"
                style={{
                  background: `${colors.background}90`,
                  border: `2px solid ${colors[currentSlideData.color]}30`,
                }}
              >
                <Users
                  className="w-8 h-8"
                  style={{ color: colors[currentSlideData.color] }}
                />
              </div>
            </div>

            <div
              className={`absolute -bottom-4 -left-6 transition-all duration-1000 delay-300 ${
                isTransitioning
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <div
                className="w-24 h-16 rounded-2xl backdrop-blur-xl shadow-xl flex items-center justify-center"
                style={{
                  background: `${colors.background}90`,
                  border: `2px solid ${colors.accent}30`,
                }}
              >
                <BarChart3
                  className="w-8 h-8"
                  style={{ color: colors.accent }}
                />
              </div>
            </div>

            {/* Orbiting Elements */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 rounded-full transition-all duration-1000 ${
                  isTransitioning ? "opacity-0" : "opacity-60"
                }`}
                style={{
                  background:
                    colors[
                      i === 0 ? "primary" : i === 1 ? "accent" : "secondary"
                    ],
                  left: `${30 + i * 25}%`,
                  top: `${20 + i * 30}%`,
                  animation: `orbit${i} ${4 + i}s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="p-4 rounded-full backdrop-blur-xl shadow-xl transform hover:scale-110 transition-all duration-300"
          style={{
            background: `${colors.background}80`,
            border: `1px solid ${colors.primary}30`,
            color: colors.primary,
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="relative overflow-hidden rounded-full transition-all duration-300"
            >
              <div
                className={`h-3 transition-all duration-300 ${
                  index === currentSlide ? "w-12" : "w-3"
                }`}
                style={{
                  background:
                    index === currentSlide
                      ? `linear-gradient(90deg, ${
                          colors[slides[index].color]
                        }, ${colors.accent})`
                      : `${colors.text}30`,
                }}
              />
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="p-4 rounded-full backdrop-blur-xl shadow-xl transform hover:scale-110 transition-all duration-300"
          style={{
            background: `${colors.background}80`,
            border: `1px solid ${colors.primary}30`,
            color: colors.primary,
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <style jsx>{`
        @keyframes orbit0 {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(50px) rotate(-360deg);
          }
        }
        @keyframes orbit1 {
          0% {
            transform: rotate(0deg) translateX(70px) rotate(0deg);
          }
          100% {
            transform: rotate(-360deg) translateX(70px) rotate(360deg);
          }
        }
        @keyframes orbit2 {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(40px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Banner;

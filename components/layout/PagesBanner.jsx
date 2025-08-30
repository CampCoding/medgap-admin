"use client";

import React, { useState, useEffect, useRef } from "react";

const PagesBanner = ({ title, subTitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
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

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Typewriter effect for subtitle
  const [displayedText, setDisplayedText] = useState("");
  const fullText = subTitle ||
    "Join our community of learners and start your journey towards success.";

  useEffect(() => {
    if (isVisible) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isVisible, fullText]);

  return (
    <div
      ref={sectionRef}
      className="relative py-[100px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50"
    >
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Circle - Top Right */}
        <div
          className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-teal-300/20 rounded-full blur-3xl transform transition-transform duration-[3000ms] ease-in-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px) scale(${isVisible ? 1 : 0.5})`,
            opacity: isVisible ? 1 : 0,
          }}
        />

        {/* Medium Circle - Bottom Left */}
        <div
          className="absolute -bottom-1/4 -left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-200/25 to-cyan-200/15 rounded-full blur-2xl transform transition-all duration-[4000ms] ease-out"
          style={{
            transform: `translate(${-mousePosition.x * 0.015}px, ${
              -mousePosition.y * 0.015
            }px) scale(${isVisible ? 1 : 0.3})`,
            opacity: isVisible ? 1 : 0,
          }}
        />

        {/* Small Circle - Top Left */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-bl from-teal-200/20 to-emerald-200/10 rounded-full blur-xl transform transition-all duration-[2500ms] ease-in-out"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px) rotate(${mousePosition.x * 0.1}deg) scale(${
              isVisible ? 1 : 0.8
            })`,
            opacity: isVisible ? 1 : 0,
          }}
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-30 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transform: isVisible ? "scale(1)" : "scale(0)",
              transition: `transform ${1000 + i * 100}ms ease-out`,
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div
          className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 transform rotate-45 rounded-lg blur-sm transition-all duration-3000 ease-out"
          style={{
            transform: `rotate(${45 + mousePosition.x * 0.1}deg) scale(${
              isVisible ? 1 : 0
            })`,
            opacity: isVisible ? 1 : 0,
          }}
        />

        <div
          className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-l from-teal-300/25 to-emerald-300/15 rounded-full blur-sm transition-all duration-2000 ease-in-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${
              mousePosition.y * 0.02
            }px) scale(${isVisible ? 1 : 0})`,
            opacity: isVisible ? 1 : 0,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Title */}
        <h1
          ref={titleRef}
          className={`text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-gradient-to-r from-slate-800 via-blue-900 to-cyan-800 bg-clip-text text-transparent transform transition-all duration-1000 ease-out ${
            isVisible
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-12 opacity-0 scale-95"
          }`}
          style={{
            textShadow: "0 4px 20px rgba(0,0,0,0.1)",
            filter: isVisible ? "blur(0px)" : "blur(2px)",
          }}
        >
          {title?.split("").map((char, index) =>
            char === " " ? (
              <span className="inline-block w-4" key={index}></span>
            ) : (
              <span
                className="inline-block hover:scale-110 transition-transform duration-300 cursor-default"
                style={{
                  animationDelay: index == 0 ? "0s" : `${index * 0.05}s`,
                }}
                key={index}
              >
                {char}
              </span>
            )
          )}
         
        </h1>

        {/* Subtitle with Typewriter Effect */}
        <div
          ref={subtitleRef}
          className={`text-xl md:text-2xl lg:text-3xl text-slate-600 leading-relaxed font-medium transform transition-all duration-1200 delay-300 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="relative">
            {displayedText}
            {isVisible && displayedText.length < fullText.length && (
              <span className="animate-pulse bg-slate-600 w-0.5 h-6 ml-1 inline-block" />
            )}
          </span>
        </div>

        {/* Decorative Elements */}
        <div
          className={`mt-12 flex justify-center items-center space-x-4 transform transition-all duration-1500 delay-500 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s`, animationDuration: "2s" }}
            />
          ))}
        </div>

        {/* Interactive Glow Effect */}
        <div
          className="absolute inset-0 -z-10 bg-gradient-radial from-cyan-100/50 via-transparent to-transparent rounded-full blur-3xl transition-all duration-1000"
          style={{
            transform: `scale(${isVisible ? 1.2 : 0.8})`,
            opacity: isVisible ? 0.6 : 0,
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-2000 delay-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PagesBanner;

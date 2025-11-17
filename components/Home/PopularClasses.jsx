"use client";

import React, { useState, useEffect } from "react";

const ArabicProgramsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Auto-check items with staggered animation
  useEffect(() => {
    if (!isVisible) return;

    const programs = [1, 2, 3, 4, 5, 6, 7, 8];
    programs.forEach((id, index) => {
      setTimeout(() => {
        setCheckedItems((prev) => new Set([...prev, id]));
      }, 1000 + index * 200);
    });
  }, [isVisible]);

  const programs = [
    { id: 1, title: "Arabic for Business", side: "left" },
    { id: 2, title: "Arabic Conversation Skills", side: "left" },
    { id: 3, title: "Arabic Grammar Made Easy", side: "left" },
    { id: 4, title: "Cultural Insights Workshops", side: "left" },
    { id: 5, title: "Kids Arabic Classes", side: "right" },
    { id: 6, title: "Egyptian Arabic Dialect", side: "right" },
    { id: 7, title: "Modern Standard Arabic", side: "right" },
    { id: 8, title: "One-to-One Arabic Lessons", side: "right" },
  ];

  const ProgramItem = ({ program, index }) => {
    const isHovered = hoveredItem === program.id;
    const isChecked = checkedItems.has(program.id);
    const delay = index * 150;
    const isLeft = program.side === "left";

    return (
      <div
      
        className={`
          flex items-center group cursor-pointer transform transition-all duration-700 ease-out
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}
          ${
            isHovered
              ? isLeft
                ? "translate-x-4"
                : "-translate-x-4"
              : "translate-x-0"
          }
          ${isLeft ? "justify-start" : "justify-end"}
        `}
        style={{ transitionDelay: `${delay}ms` }}
        onMouseEnter={() => setHoveredItem(program.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Left side content */}
        {isLeft && (
          <>
            {/* Animated checkmark */}
            <div
              className={`
              relative w-6 h-6 mr-4 flex-shrink-0 transition-all duration-500
              ${isHovered ? "scale-110" : "scale-100"}
            `}
            >
              {/* Background circle */}
              <div
                className={`
                absolute inset-0 rounded-full transition-all duration-500
                ${
                  isChecked
                    ? "bg-gradient-to-r from-teal-400 to-teal-500 scale-100"
                    : "bg-gray-200 scale-90"
                }
              `}
              >
                {/* Glow effect */}
                <div
                  className={`
                  absolute inset-0 rounded-full transition-all duration-500
                  ${
                    isChecked && isHovered
                      ? "bg-teal-400 blur-md scale-150 opacity-30"
                      : "opacity-0"
                  }
                `}
                ></div>
              </div>

              {/* Checkmark icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className={`
                    w-3 h-3 text-white transition-all duration-300
                    ${
                      isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    className={`
                      ${
                        isChecked
                          ? "animate-[checkmark_0.5s_ease-out_forwards]"
                          : ""
                      }
                    `}
                  />
                </svg>
              </div>
            </div>

            {/* Program title */}
            <div className="relative overflow-hidden">
              <h3
                className={`
                text-lg font-semibold text-gray-700 transition-all duration-300
                ${isHovered ? "text-teal-600" : ""}
              `}
              >
                {program.title}
              </h3>

              {/* Animated underline */}
              <div
                className={`
                absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-teal-500
                transition-all duration-300 ease-out
                ${isHovered ? "w-full" : "w-0"}
              `}
              ></div>
            </div>

            {/* Hover arrow */}
            <div
              className={`
              ml-3 transform transition-all duration-300
              ${
                isHovered
                  ? "translate-x-2 opacity-100"
                  : "translate-x-0 opacity-0"
              }
            `}
            >
              <svg
                className="w-4 h-4 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </>
        )}

        {/* Right side content */}
        {!isLeft && (
          <>
            {/* Hover arrow */}
            <div
              className={`
              mr-3 transform transition-all duration-300
              ${
                isHovered
                  ? "-translate-x-2 opacity-100"
                  : "translate-x-0 opacity-0"
              }
            `}
            >
              <svg
                className="w-4 h-4 text-teal-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>

            {/* Program title */}
            <div className="relative overflow-hidden">
              <h3
                className={`
                text-lg font-semibold text-gray-700 transition-all duration-300 text-right
                ${isHovered ? "text-teal-600" : ""}
              `}
              >
                {program.title}
              </h3>

              {/* Animated underline */}
              <div
                className={`
                absolute bottom-0 right-0 h-0.5 bg-gradient-to-l from-teal-400 to-teal-500
                transition-all duration-300 ease-out
                ${isHovered ? "w-full" : "w-0"}
              `}
              ></div>
            </div>

            {/* Animated checkmark */}
            <div
              className={`
              relative w-6 h-6 ml-4 flex-shrink-0 transition-all duration-500
              ${isHovered ? "scale-110" : "scale-100"}
            `}
            >
              {/* Background circle */}
              <div
                className={`
                absolute inset-0 rounded-full transition-all duration-500
                ${
                  isChecked
                    ? "bg-gradient-to-r from-teal-400 to-teal-500 scale-100"
                    : "bg-gray-200 scale-90"
                }
              `}
              >
                {/* Glow effect */}
                <div
                  className={`
                  absolute inset-0 rounded-full transition-all duration-500
                  ${
                    isChecked && isHovered
                      ? "bg-teal-400 blur-md scale-150 opacity-30"
                      : "opacity-0"
                  }
                `}
                ></div>
              </div>

              {/* Checkmark icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className={`
                    w-3 h-3 text-white transition-all duration-300
                    ${
                      isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }
                  `}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    className={`
                      ${
                        isChecked
                          ? "animate-[checkmark_0.5s_ease-out_forwards]"
                          : ""
                      }
                    `}
                  />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden"
       
        
      >
        <div className="absolute top-20 left-20 w-96 h-96 bg-teal-200 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200 rounded-full opacity-5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 rounded-full opacity-3 blur-2xl animate-bounce"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Header */}
        <div
          className={`
          mb-16 transform transition-all duration-1000
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
        >
          <div className="inline-block px-4 py-2 bg-teal-100 text-teal-600 rounded-full text-sm font-semibold uppercase tracking-wide mb-6">
            Our Popular Classes
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight max-w-4xl">
            <span className="bg-gradient-to-r from-gray-800 via-teal-600 to-gray-800 bg-clip-text text-transparent">
              Unlock the World of Arabic Through
            </span>
            <br />
            <span className="text-gray-700">These Engaging Programs</span>
          </h2>
        </div>

        {/* Programs List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column */}
          <div className="space-y-6">
            {programs
              .filter((p) => p.side === "left")
              .map((program, index) => (
                <ProgramItem key={program.id} program={program} index={index} />
              ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {programs
              .filter((p) => p.side === "right")
              .map((program, index) => (
                <ProgramItem
                  key={program.id}
                  program={program}
                  index={index + 4}
                />
              ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`
          text-center mt-16 transform transition-all duration-1000
          ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        `}
          style={{ transitionDelay: "2000ms" }}
        >
          <button className=" px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-teal-600 hover:to-teal-700 group relative overflow-hidden">
            <span className="relative z-10">Explore All Programs</span>
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-10 w-1 h-1 bg-teal-400 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes checkmark {
          0% {
            stroke-dasharray: 0 24;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 24 24;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ArabicProgramsSection;

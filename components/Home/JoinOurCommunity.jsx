"use client";

import React, { useState, useEffect } from "react";

const JoinOurCommunity = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    sessions: 0,
    courses: 0,
    parents: 0,
  });

  const finalStats = {
    sessions: 2000,
    courses: 15,
    parents: 2000,
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Animated counter effect
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      setCurrentStats({
        sessions: Math.floor(finalStats.sessions * easeOutCubic),
        courses: Math.floor(finalStats.courses * easeOutCubic),
        parents: Math.floor(finalStats.parents * easeOutCubic),
      });

      if (step >= steps) {
        clearInterval(interval);
        setCurrentStats(finalStats);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isVisible]);

  const StatCard = ({ value, label, delay, suffix = "+" }) => (
    <div
      className={`
        text-center transform transition-all duration-1000 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative">
        <div className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-2 relative">
          <span className="bg-gradient-to-r from-white via-teal-100 to-white bg-clip-text text-transparent">
            {value.toLocaleString()}
            {suffix}
          </span>
          {/* Glowing effect */}
          <div className="absolute inset-0 text-4xl md:text-5xl lg:text-7xl font-bold text-white/20 blur-sm">
            {value.toLocaleString()}
            {suffix}
          </div>
        </div>
        <div className="text-sm md:text-base font-semibold text-gray-200 uppercase tracking-wider">
          {label}
        </div>
        {/* Decorative line */}
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent mx-auto mt-3"></div>
      </div>
    </div>
  );

  return (
    <div className="relative  overflow-hidden">
      {/* Background with animated overlay */}
      <div
        style={{
          backgroundImage:
            "url('/images/happy-college-students-and-their-teacher-using-computer-in-the-classroom-.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backgroundBlendMode: "overlay",
        }}
        className="absolute inset-0 "
      >
        {/* Animated background patterns */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#F0FBFC"
            fillOpacity="1"
            d="M0,160L80,160C160,160,320,160,480,138.7C640,117,800,75,960,69.3C1120,64,1280,96,1360,112L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          ></path>
        </svg>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-teal-400 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-bounce"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(20, 184, 166, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      {/* Laptop mockup section */}

      <div>
        <div className="relative z-10 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Laptop container */}
            <div
              className={`
            relative mx-auto container transform transition-all duration-1500 ease-out
            ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-95"
            }
          `}
            >
              {/* Laptop base */}
              <div className="relative">
                {/* Screen bezel */}
                <div className=" ">
                  {/* Top bar with controls */}

                  {/* Screen content */}
                  <div className="relative rounded-lg overflow-hidden">
                    {/* Background image simulation */}

                    {/* Person silhouette */}

                    {/* Floating elements */}
                    <div className="absolute top-8 left-8 w-4 h-4 bg-teal-400 rounded-full animate-ping"></div>
                    <div className="absolute top-16 right-16 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>

                    {/* Main content overlay */}
                    <div className="relative z-10 flex flex-col items-center justify-center  text-center p-8 mt-40">
                      <h1
                        className={`
                      text-xl md:text-3xl lg:text-7xl font-bold text-white mb-4 leading-tight
                      transform transition-all duration-1000 ease-out
                      ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }
                    `}
                        style={{ transitionDelay: "600ms" }}
                      >
                        Join our community of learners and start your journey towards success

                        
                      </h1>


                      <button
                        className={`
                      px-8 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg
                      transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                      ${
                        isVisible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                      }
                      relative overflow-hidden group
                    `}
                        style={{ transitionDelay: "1000ms" }}
                      >
                        <span className="relative z-10">EXPLORE COURSE</span>
                        {/* Button glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Laptop keyboard */}
              </div>

             
            </div>
          </div>
        </div>

        {/* Statistics section */}
       
      
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div
          className="absolute top-1/4 left-10 w-1 h-1 bg-teal-400 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-1/3 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full"></div>
    </div>
  );
};

export default JoinOurCommunity;

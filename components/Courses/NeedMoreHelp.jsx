"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  Headphones,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function NeedMoreHelp() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      id: 1,
      icon: (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
              fill="#0A98B0"
              d="M9 11a7 7 0 1 1 14 0a1 1 0 1 0 2 0a9 9 0 1 0-14.385 7.212a9 9 0 0 0 3.558 1.602a2 2 0 1 0 .216-2A7 7 0 0 1 9 11m1 0a6 6 0 1 1 7.913 5.689A3 3 0 0 0 16 16c-.727 0-1.393.259-1.913.689A6 6 0 0 1 10 11m6-4a4 4 0 1 0 0 8a4 4 0 0 0 0-8M7.5 18h1.359a10 10 0 0 0 2.777 2H7.5A1.5 1.5 0 0 0 6 21.5v.5c0 1.473.94 2.949 2.759 4.106c1.807 1.15 4.364 1.894 7.24 1.894c2.878 0 5.435-.744 7.242-1.894C25.061 24.95 26 23.472 26 22v-.5a1.5 1.5 0 0 0-1.5-1.5h-5.67a3 3 0 0 0 0-2h5.67a3.5 3.5 0 0 1 3.5 3.5v.5c0 2.393-1.523 4.417-3.685 5.793C22.141 29.177 19.198 30 16 30s-6.14-.823-8.315-2.207C5.523 26.417 4 24.393 4 22v-.5A3.5 3.5 0 0 1 7.5 18"
              strokeWidth={1}
              stroke="#0A98B0"
            ></path>
          </svg>
        </>
      ),
      title: "Sales Support",
      description:
        "Discover the perfect program for your goals and budget. Our sales team is ready to assist with course selection and enrollment details.",
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50",
      iconBg: "from-teal-100 to-cyan-100",
      delay: 0,
      button: (
        <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
          <span className="relative z-10 flex items-center space-x-2">
            <span>Chat Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      ),
    },
    {
      id: 2,
      icon: (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="#0A98B0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="m2.357 7.714l6.98 4.654c.963.641 1.444.962 1.964 1.087c.46.11.939.11 1.398 0c.52-.125 1.001-.446 1.964-1.087l6.98-4.654M7.157 19.5h9.686c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.31-1.311c.328-.642.328-1.482.328-3.162V9.3c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311c-.642-.327-1.482-.327-3.162-.327H7.157c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.31 1.311c-.328.642-.328 1.482-.328 3.162v5.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327"
            ></path>
          </svg>
        </>
      ),
      title: "Cultural Immersion",
      description:
        "Our courses go beyond language by introducing you to the rich culture of the Arab world. Learn the traditions, customs, and expressions that make Arabic unique",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
      iconBg: "from-emerald-100 to-teal-100",
      delay: 200,
      button: (
        <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
          <span className="relative z-10 flex items-center space-x-2">
            <span>Send Mail</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      ),
    },
    {
      id: 3,
      icon: (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="#0A98B0"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 8h2m-2 4h2m0 4H7m0-8v4h4V8zM5 20h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"
            ></path>
          </svg>
        </>
      ),
      title: "Interactive Teaching Methods",
      description:
        "Our lessons are dynamic and engaging, incorporating real-life scenarios, multimedia tools, and cultural insights to make learning fun and effective",
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
      iconBg: "from-cyan-100 to-blue-100",
      delay: 400,
      button: (
        <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
          <span className="relative z-10 flex items-center space-x-2">
            <span>Read Article</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      ),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      features.forEach((feature, index) => {
        setTimeout(() => {
          setVisibleCards((prev) => [...prev, feature.id]);
        }, feature.delay);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 py-20 px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-emerald-200/25 to-teal-200/25 rounded-full blur-2xl animate-bounce delay-500"></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-slide-up">
            Need More{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              help?
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">
            We're here to assist you with anything you need. Reach out anytime
            and we'll get back to you as soon as possible.{" "}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = () => feature.icon;
            const isVisible = visibleCards.includes(feature.id);
            const isHovered = hoveredCard === feature.id;

            return (
              <div
                key={feature.id}
                className={`group relative transform transition-all duration-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Background Glow Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform scale-110`}
                ></div>

                {/* Main Card */}
                <div
                  className={`relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 h-full shadow-lg border border-white/50 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2`}
                >
                  {/* Animated Border */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{ padding: "2px" }}
                  >
                    <div className="bg-white rounded-3xl h-full w-full"></div>
                  </div>

                  <div className="relative z-10">
                    {/* Icon Section */}
                    <div className="mb-6 relative">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                      >
                        {/* Icon Background Animation */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                        ></div>
                        <Icon
                          className={`w-8 h-8 text-primary bg-gradient-to-r ${feature.color} bg-clip-text relative z-10 group-hover:animate-bounce`}
                        />

                        {/* Floating Elements */}
                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:animate-ping">
                          <Star className="w-4 h-4 text-yellow-400" />
                        </div>
                      </div>

                      {/* Progress Indicator */}
                      <div className="flex space-x-1">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${
                              i <= index
                                ? `bg-gradient-to-r ${feature.color}`
                                : "bg-gray-200"
                            }`}
                            style={{
                              width: i === index ? "24px" : "8px",
                              transitionDelay: `${i * 100}ms`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 h-full flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-teal-600 group-hover:to-cyan-600 transition-all duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>

                      <div className="mt-auto">{feature.button}</div>
                    </div>

                    {/* Hover Overlay Effects */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute top-4 right-4">
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full animate-ping`}
                        ></div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div
                          className={`w-1 h-1 bg-gradient-to-r ${feature.color} rounded-full animate-pulse delay-300`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Number Badge */}
                <div
                  className={`absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r ${
                    feature.color
                  } rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transform transition-all duration-500 ${
                    isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-20 animate-fade-in-delay-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Start Your Arabic Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of students who have transformed their language
              skills with our innovative methods
            </p>
            <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10 flex items-center space-x-2">
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
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

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 1s ease-out 0.3s both;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 1s ease-out 1s both;
        }

        .animate-slide-up {
          animation: slideUp 1s ease-out 0.2s both;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

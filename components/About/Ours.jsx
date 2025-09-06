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
  Eye,
  Target,
  Scale,
} from "lucide-react";

export default function Ours() {
  const [visibleCards, setVisibleCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(2);

  const features = [
    {
      id: 1,
      icon: Eye,
      title: "Our vision",
      description:
        "At the Egyptian Institute of Arabic Language, we dream of a world where the Arabic language connects cultures, bridges gaps, and inspires communication. Our vision is to make Arabic a global language, accessible to everyone, everywhere. We aspire to lead this movement by combining cultural immersion with innovative teaching methods, empowering learners to embrace Arabic with confidence and joy.",
      color: "from-teal-500 to-cyan-500",
      bgColor: "from-teal-50 to-cyan-50",
      iconBg: "from-teal-100 to-cyan-100",
      delay: 0,
    },
    {
      id: 2,
      icon: Target,
      title: "Our mission",
      description:
        "Our mission is to redefine how Arabic is taught and learned. We harness the power of modern technology, interactive methods, and cultural insights to deliver a personalized learning experience that fits your goals and lifestyle. Whether you want to explore Modern Standard Arabic or dive into the vibrant Egyptian dialect, we are here to guide you step by step on your journey to mastering Arabic – easily, flexibly, and effectively.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50",
      iconBg: "from-emerald-100 to-teal-100",
      delay: 200,
    },
    {
      id: 3,
      icon: Scale,
      title: "Our values",
      description:
        "At the Egyptian Institute of Arabic Language, we believe in Arabic as a cultural bridge connecting people and fostering understanding. Our core value is providing innovative and flexible education that helps learners master Arabic in an easy and enjoyable way. We focus on using modern technology and interactive methods to create a positive impact in Arabic learning.",
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
      iconBg: "from-cyan-100 to-blue-100",
      delay: 400,
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
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full px-6 py-3 mb-8 animate-fade-in">
            <Sparkles className="w-5 h-5 text-teal-600 animate-spin-slow" />
            <span className="text-teal-700 font-semibold">
              What Guides Our Institute
            </span>
            <Sparkles className="w-5 h-5 text-teal-600 animate-spin-slow" />
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-6 animate-slide-up">
            Rooted in{" "}
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Purpose
            </span>{" "}
            Driven by{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Vision
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">
            Discover how our values, mission, and vision shape a modern,
            meaningful approach to Arabic language education for learners
            worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
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
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-teal-600 group-hover:to-cyan-600 transition-all duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>

                      {/* Interactive Elements */}
                      {/* <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Proven Method</span>
                          </div>

                          <button
                            className={`p-2 rounded-full bg-gradient-to-r ${feature.color} text-white hover:shadow-lg transition-all duration-300 hover:scale-110`}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div> */}
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

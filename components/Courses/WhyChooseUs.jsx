"use client";

import React, { useState, useEffect } from "react";
import { Check, BookOpen, Users, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Tailored Approach",
      description:
        "We design customized learning paths that align with your unique goals. Experience focused support that accelerates your language mastery.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Experienced Mentors",
      description:
        "Learn from certified experts with years of proven teaching experience. Our dedicated team offers personalized guidance every step of the way.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Interactive Environment",
      description:
        "Engage in dynamic, hands-on lessons that build practical communication skills. Our immersive approach fosters confidence and measurable progress.",
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Why Choose Us
          </h1>
          <p className="text-xl text-slate-600 font-medium tracking-wider uppercase">
            Effective and Flexible Language Education
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500">
              {/* Background with gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/20 z-10"></div>

              {/* Simulated image content */}
              <div className="bg-gradient-to-br from-green-100 to-blue-100 aspect-[4/3] relative">
                <img
                  className="w-full h-full object-cover"
                  src="/images/student-connecting-with-his-smartphone.jpg"
                  alt=""
                />
              </div>

              {/* Floating elements */}
              <div className="absolute top-8 right-8 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="absolute top-16 right-16 w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100"></div>
              <div className="absolute top-12 right-24 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;

              return (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-700 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8"
                  } ${isActive ? "scale-105" : "hover:scale-102"}`}
                  style={{ transitionDelay: `${400 + index * 200}ms` }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`relative p-8 rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "bg-white shadow-2xl shadow-blue-500/20 border border-blue-200"
                        : "bg-white/70 hover:bg-white shadow-lg hover:shadow-xl border border-slate-200"
                    }`}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${
                        feature.color
                      } opacity-0 group-hover:opacity-5 ${
                        isActive ? "opacity-10" : ""
                      } rounded-2xl transition-opacity duration-500`}
                    ></div>

                    <div className="relative flex items-start space-x-6">
                      {/* Icon */}
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${
                          feature.color
                        } p-4 transform transition-all duration-500 ${
                          isActive
                            ? "rotate-6 scale-110"
                            : "group-hover:rotate-3 group-hover:scale-105"
                        }`}
                      >
                        <Icon className="w-full h-full text-white" />
                      </div>

                      {/* Check mark */}
                      <div
                        className={`absolute -top-2 -left-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                          isActive
                            ? "scale-110 rotate-12"
                            : "group-hover:scale-105"
                        }`}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3
                          className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                            isActive
                              ? "text-slate-800"
                              : "text-slate-700 group-hover:text-slate-800"
                          }`}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Animated border */}
                    <div
                      className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                        isActive ? "ring-2 ring-blue-400 ring-opacity-50" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-20 flex justify-center space-x-4">
          {features.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                activeFeature === index
                  ? "bg-blue-500 scale-125"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={() => setActiveFeature(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

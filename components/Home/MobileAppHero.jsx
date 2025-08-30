"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Star,
  Play,
  Apple,
  Smartphone,
  Stethoscope,
  Brain,
  Heart,
  Activity,
} from "lucide-react";

const MobileAppHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [phoneRotation, setPhoneRotation] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setPhoneRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const floatingElements = [
    { icon: Stethoscope, delay: 0, x: 10, y: 20 },
    { icon: Brain, delay: 1000, x: 80, y: 10 },
    { icon: Heart, delay: 2000, x: 15, y: 70 },
    { icon: Activity, delay: 1500, x: 85, y: 80 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFC] via-[#E0F7FA] to-[#F3E5F5] overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute transition-all duration-2000 ease-in-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}ms`,
            }}
          >
            <div className="animate-bounce">
              <element.icon className="w-8 h-8 text-[#0F7490] opacity-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-[#8B5CF6] to-[#0F7490] rounded-full opacity-10 animate-pulse blur-3xl"></div>
      <div
        className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-[#C9AE6C] to-[#8B5CF6] rounded-full opacity-10 animate-pulse blur-3xl"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            {/* Main Heading with Gradient Text */}
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#0F7490] via-[#8B5CF6] to-[#C9AE6C] bg-clip-text text-transparent animate-pulse">
                  All the answers,
                </span>
                <br />
                <span className="text-[#202938] relative">
                  right here.
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#0F7490] to-[#8B5CF6] rounded-full transform scale-x-0 animate-[scaleX_2s_ease-out_0.5s_forwards] origin-left"></div>
                </span>
              </h1>
            </div>

            {/* Description */}
            <div
              className={`transition-all duration-1000 ease-out delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <p className="text-xl text-[#202938] opacity-80 leading-relaxed max-w-lg">
                Make the right call in every clinical scenario. The{" "}
                <span className="font-semibold text-[#0F7490]">
                  Med Gap Knowledge
                </span>{" "}
                and{" "}
                <span className="font-semibold text-[#8B5CF6]">Qbank apps</span>{" "}
                give you instant and on-the-go medical knowledge and guidance.
              </p>
            </div>

            {/* CTA Section */}
            <div
              className={`space-y-6 transition-all duration-1000 ease-out delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h3 className="text-2xl font-semibold text-[#202938]">
                Download the apps for free.
              </h3>

              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group relative overflow-hidden bg-black text-white px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F7490] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Apple className="w-8 h-8 relative z-10" />
                  <div className="relative z-10">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-lg font-semibold">App Store</div>
                  </div>
                </button>

                <button className="group relative overflow-hidden bg-black text-white px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#C9AE6C] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Play className="w-8 h-8 relative z-10" />
                  <div className="relative z-10">
                    <div className="text-xs opacity-80">GET IT ON</div>
                    <div className="text-lg font-semibold">Google Play</div>
                  </div>
                </button>
              </div>

              {/* Ratings */}
              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#C9AE6C]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-[#202938] font-semibold">4.9</span>
                  <span className="text-[#202938] opacity-60">
                    15.4K Ratings
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-[#C9AE6C]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current animate-pulse"
                        style={{ animationDelay: `${i * 100 + 500}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-[#202938] font-semibold">4.7</span>
                  <span className="text-[#202938] opacity-60">
                    14.8K Ratings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Phone Mockup */}
          <div
            className={`relative transition-all duration-1500 ease-out delay-700 ${
              isVisible
                ? "opacity-100 translate-x-0 rotate-0"
                : "opacity-0 translate-x-20 rotate-12"
            }`}
          >
            {/* Phone Container with 3D Effect */}
            <div className="relative transform  flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
              {/* Phone Shadow */}
              <div className="absolute inset-0 bg-black opacity-20 blur-3xl transform translate-x-8 translate-y-8 rounded-[3rem] scale-105"></div>

              {/* Phone Body */}
           <img className="max-w-[500px] " src="https://cdn.prod.website-files.com/64f59b196c6b3f1ee358eb8c/652e96d016f63b469c3b3885_Amboss-Mobile-App-Qbank-Knowledge-2020-960x1084_qlujox.png" alt="" />
            </div>

            {/* Floating UI Elements */}
            <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#C9AE6C] rounded-full animate-pulse"></div>
                <div className="text-[#202938] text-sm font-medium">
                  Knowledge Base
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#8B5CF6] rounded-full animate-pulse"></div>
                <div className="text-[#202938] text-sm font-medium">Qbank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes scaleX {
          to {
            transform: scaleX(1);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MobileAppHero;

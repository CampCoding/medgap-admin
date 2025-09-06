"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  XCircle,
  CreditCard,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const FlashCard = ({ data, params }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardResults, setCardResults] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);
  const [flipDirection, setFlipDirection] = useState("right");

  const course = {
    id: 1,
    title: "Medical English for Beginners",
  };

  useEffect(() => {
    if (isFlipped && !isAnimating) {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 3 + 1,
        angle: Math.random() * 360,
        color: ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"][
          Math.floor(Math.random() * 5)
        ],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, isAnimating]);

  const handleFlip = () => {
    if (isAnimating) return;

    setFlipDirection(Math.random() > 0.5 ? "right" : "left");

    setTimeout(() => {
      setIsFlipped(!isFlipped);
    }, 100);

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };


  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "mcq":
        return "bg-blue-100 text-blue-800";
      case "definition":
        return "bg-purple-100 text-purple-800";
      case "essay":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className=" rounded-2xl shadow-sm ">
        <div className="mx-auto">
          {/* Advanced Flip Card Container */}
          <div className="relative h-96 mb-8 perspective-1500">
            {/* Particle Effects */}
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute animate-ping"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  borderRadius: "50%",
                  animationDelay: `${particle.id * 0.05}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}

            <div
              className={`relative w-full h-full transition-all duration-2000 transform-style-preserve-3d ${
                isFlipped
                  ? `rotate-y-180 ${
                      flipDirection === "left" ? "rotate-y-180" : ""
                    }`
                  : ""
              } ${isAnimating ? "animate-pulse" : ""}`}
              onClick={handleFlip}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                {/* Tags */}
                <div className="w-full h-full bg-gradient-to-br from-purple-500 via-blue-600 to-purple-700 rounded-2xl shadow-2xl flex items-center justify-center p-8 cursor-pointer hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full animate-spin"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full animate-bounce"></div>
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
              
              {/* Tags */}
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(data.type)}`}>
                    {data.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(data.difficulty)}`}>
                    {data.difficulty}
                  </span>
                </div>


                  <div className="text-center relative z-10">
                    <div className="text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
                      {data.front}
                    </div>
                    <div className="text-white/90 text-lg font-medium animate-pulse">
                      <Sparkles className="w-5 h-5 inline mr-2" />
                      Click to flip
                    </div>
                    <div className="text-white/70 text-sm mt-2 animate-fade-in">
                      Tap or click to reveal answer
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="w-full h-full bg-gradient-to-br from-green-500 via-teal-600 to-green-700 rounded-2xl shadow-2xl flex items-center justify-center p-8 cursor-pointer hover:shadow-3xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white rounded-full animate-spin"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-2 border-white rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white rounded-full animate-bounce"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>

                  <div className="text-center relative z-10">
                    <div className="text-3xl font-bold text-white mb-4 animate-fade-in">
                      {data.back}
                    </div>
                    <div className="text-white/90 text-lg mb-4 font-medium animate-pulse">
                      {data.pronunciation}
                    </div>
                    <div className="text-white/95 text-sm space-y-3">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm animate-slide-up">
                        <div className="font-medium mb-1">Example:</div>
                        <div className="text-white/90">{data.example}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm animate-slide-up">
                        <div className="font-medium mb-1">Translation:</div>
                        <div className="text-white/90">
                          {data.exampleTranslation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1500 {
          perspective: 1500px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-ping {
          animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </>
  );
};

export default FlashCard;


"use client";

import React, { useState, useEffect } from 'react';
import { Star, BookOpen, Users, Award, Clock, Target, Zap, Crown } from 'lucide-react';

const ArabicLearningLanding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      id: 'basic',
      title: 'Start with a Free Consultation',
      subtitle: 'Begin learning Arabic with simple and engaging steps.',
      buttonText: 'LEARN EASILY',
      buttonStyle: 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50',
      features: [
        { icon: BookOpen, text: 'Free learning materials' },
        { icon: Users, text: 'Personalized learner support' },
        { icon: Clock, text: 'Flexible and convenient schedule' },
        { icon: Target, text: 'Daily practical exercises' },
        { icon: Star, text: 'Interactive beginner lessons' }
      ],
      gradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-500'
    },
    {
      id: 'elite',
      title: 'Start with a Free Consultation',
      subtitle: 'Enjoy an advanced learning experience tailored to your needs.',
      buttonText: 'ADVANCE FASTER',
      buttonStyle: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl',
      isElite: true,
      features: [
        { icon: Users, text: 'Ongoing professional support' },
        { icon: Award, text: 'Regular progress assessments' },
        { icon: Zap, text: 'Live advanced classes' },
        { icon: Crown, text: 'Access to exclusive content' },
        { icon: Target, text: 'Pronunciation & interaction exercises' }
      ],
      gradient: 'from-teal-50 to-emerald-50',
      iconColor: 'text-teal-600'
    },
    {
      id: 'master',
      title: 'Contact Us form More Details',
      subtitle: 'Master Arabic with specialized courses and certified trainers',
      buttonText: 'MASTER ARABIC',
      buttonStyle: 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50',
      features: [
        { icon: Award, text: 'Professional skill enhancement' },
        { icon: Users, text: 'Intensive language support' },
        { icon: BookOpen, text: 'Advanced research materials' },
        { icon: Crown, text: 'One-on-one consultation sessions' },
        { icon: Target, text: 'Customized learning plans' }
      ],
      gradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-teal-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-teal-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-teal-600 font-semibold text-sm tracking-wider uppercase mb-4 animate-fade-in">
            YOUR LEARNING JOURNEY STARTS HERE
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-8 leading-tight">
            Step Up Your{' '}
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              Arabic Skills
            </span>{' '}
            Today
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative transform transition-all duration-700 hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Elite Badge */}
              {plan.isElite && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                    ELITE LEARNING
                  </div>
                </div>
              )}

              <div className={`relative h-full bg-gradient-to-br ${plan.gradient} backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group ${
                plan.isElite ? 'ring-2 ring-teal-500/30 mt-4' : ''
              }`}>
                {/* Animated Border Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight">
                      {plan.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mb-8">
                    <button className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${plan.buttonStyle}`}>
                      {plan.buttonText}
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className={`flex items-center space-x-3 p-3 rounded-xl bg-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/60 hover:transform hover:translate-x-2 ${
                          hoveredCard === plan.id ? 'animate-slide-in' : ''
                        }`}
                        style={{ animationDelay: `${featureIndex * 100}ms` }}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center ${plan.iconColor}`}>
                          <feature.icon size={16} />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                {hoveredCard === plan.id && (
                  <>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-teal-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
                    <div className="absolute top-1/2 right-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-700"></div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <div className={`text-center mt-16 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
            <Star className="w-5 h-5 animate-spin" />
            <span className="font-semibold">Start Your Arabic Journey Today</span>
            <Star className="w-5 h-5 animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ArabicLearningLanding;
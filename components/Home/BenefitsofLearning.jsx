
"use client";


import React, { useState, useEffect, useRef } from 'react';
import { Presentation, Users, Smile, FileText, ChevronRight, Sparkles, Globe, Trophy, Target } from 'lucide-react';

const ArabicBenefitsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    {
      id: 'cultural',
      icon: Presentation,
      title: 'Cultural Immersion Programs',
      description: 'Experience the richness of Arabic culture through interactive activities and practical class',
      gradient: 'from-amber-400 via-orange-400 to-yellow-500',
      bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
      glowColor: 'shadow-amber-200/50',
      accentIcon: Globe,
      delay: 0
    },
    {
      id: 'flexible',
      icon: Users,
      title: 'Flexible Learning Paths',
      description: 'Choose from group classes, one-on-one sessions, or self-paced courses to match your schedule and goals',
      gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
      bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
      glowColor: 'shadow-emerald-200/50',
      accentIcon: Target,
      delay: 200
    },
    {
      id: 'proven',
      icon: Smile,
      title: 'Proven Track Record',
      description: 'Join thousands of successful learners who have achieved fluency and confidence through our programs.',
      gradient: 'from-blue-400 via-indigo-400 to-purple-500',
      bgGradient: 'from-blue-50 via-indigo-50 to-purple-50',
      glowColor: 'shadow-blue-200/50',
      accentIcon: Trophy,
      delay: 400
    },
    {
      id: 'tailored',
      icon: FileText,
      title: 'Tailored Curriculum',
      description: 'Our lessons are customized to your specific needs, whether you\'re learning for travel, work, or personal growth.',
      gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
      bgGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
      glowColor: 'shadow-rose-200/50',
      accentIcon: Sparkles,
      delay: 600
    }
  ];

  const handleMouseMove = (e, cardId) => {
    if (hoveredCard === cardId) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-20 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-rose-200/20 to-pink-200/20 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={sectionRef}>
        {/* Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg animate-bounce-subtle">
            <Sparkles className="w-4 h-4" />
            <span>Premium Learning Experience</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Top Benefits of Learning with{' '}
            <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
              Egyptian Institute
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl">of Arabic Language</span>
          </h2>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`group relative transform transition-all duration-700 hover:scale-105 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${benefit.delay}ms` }}
              onMouseEnter={() => setHoveredCard(benefit.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => handleMouseMove(e, benefit.id)}
            >
              {/* Card Container */}
              <div className={`relative h-full bg-gradient-to-br ${benefit.bgGradient} border border-white/30 rounded-3xl p-8 shadow-xl hover:shadow-2xl ${benefit.glowColor} transition-all duration-500 overflow-hidden`}>
                
                {/* Mouse Follow Gradient */}
                {hoveredCard === benefit.id && (
                  <div 
                    className="absolute w-64 h-64 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-300"
                    style={{
                      left: mousePosition.x - 128,
                      top: mousePosition.y - 128,
                    }}
                  />
                )}

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-20 h-20 border-2 border-current rounded-full animate-spin-slow"></div>
                  <div className="absolute bottom-8 left-8 w-12 h-12 border border-current rounded-lg rotate-45 animate-pulse"></div>
                  <div className="absolute top-1/2 right-8 w-6 h-6 bg-current rounded-full animate-bounce"></div>
                </div>

                <div className="relative z-10">
                  {/* Icon Section */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Accent Icon */}
                    <div className={`w-10 h-10 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500`}>
                      <benefit.accentIcon className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors duration-300">
                      {benefit.description}
                    </p>
                  </div>

                  {/* Interactive Elements */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.gradient} opacity-60 animate-pulse`}
                          style={{ animationDelay: `${i * 200}ms` }}
                        />
                      ))}
                    </div>
                    
                    <div className={`opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100`}>
                      <ChevronRight className="w-6 h-6 text-slate-500 animate-bounce-horizontal" />
                    </div>
                  </div>
                </div>

                {/* Floating Particles */}
                {hoveredCard === benefit.id && (
                  <>
                    <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute top-12 right-12 w-1.5 h-1.5 bg-white/80 rounded-full animate-ping delay-300"></div>
                    <div className="absolute top-20 right-8 w-0.5 h-0.5 bg-white/60 rounded-full animate-ping delay-700"></div>
                  </>
                )}
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <span className="font-semibold text-lg">Ready to Begin Your Arabic Journey?</span>
            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        <img className='mt-[30px]' src="/images/onlin-learning-arabic.png" alt="" />


      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(4px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 4s ease infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ArabicBenefitsSection;
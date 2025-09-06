"use client"
import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  BarChart2,
  Smartphone,
  Calendar,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';

const BenefitsSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const sectionRef = useRef(null);

  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C", 
    accent: "#8B5CF6",
    background: "#F9FAFC",
    text: "#202938",
  };

  const benefits = [
    {
      id: 1,
      icon: BookOpen,
      title: "Dynamic Question Bank",
      description: "Create MCQs, True/False, and essay questions in seconds. Embed hints, images or videos, and tag by topic, unit, or difficulty for lightning-fast filtering.",
      color: colors.primary,
      features: ["Multi-format Questions", "Rich Media Support", "Smart Tagging"],
      gradient: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`
    },
    {
      id: 2,
      icon: BarChart2,
      title: "Real‑Time Analytics",
      description: "View instant charts of class averages, score distributions, and question-level breakdowns. Drill down to individual performance and get automated insights.",
      color: colors.accent,
      features: ["Live Performance Data", "Detailed Breakdowns", "AI Insights"],
      gradient: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`
    },
    {
      id: 3,
      icon: Smartphone,
      title: "Learn Anywhere",
      description: "Fully responsive web portal plus native iOS & Android apps. Offline practice mode ensures students can study even without a connection.",
      color: colors.secondary,
      features: ["Cross-Platform", "Offline Mode", "Cloud Sync"],
      gradient: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`
    },
    {
      id: 4,
      icon: Calendar,
      title: "Effortless Scheduling",
      description: "Plan quizzes and drills with a drag‑and‑drop calendar. Auto‑email and in‑app notifications keep learners on track with recurring assignments.",
      color: colors.primary,
      features: ["Drag & Drop", "Auto Notifications", "Recurring Tasks"],
      gradient: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
    },
    {
      id: 5,
      icon: Shield,
      title: "Enterprise‑Grade Security",
      description: "End‑to‑end encryption, GDPR‑compliant hosting with hourly backups, and role‑based access controls for teachers, admins, and reviewers.",
      color: colors.accent,
      features: ["End-to-End Encryption", "GDPR Compliant", "Role-Based Access"],
      gradient: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.dataset.cardId);
            setVisibleCards(prev => new Set([...prev, cardId]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll('[data-card-id]');
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{background: `linear-gradient(135deg, ${colors.background} 0%, #ffffff 100%)`}}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="bg1" cx="20%" cy="20%" r="40%">
                <stop offset="0%" stopColor={colors.primary} stopOpacity="0.1"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
              <radialGradient id="bg2" cx="80%" cy="60%" r="50%">
                <stop offset="0%" stopColor={colors.accent} stopOpacity="0.1"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
              <radialGradient id="bg3" cx="40%" cy="80%" r="30%">
                <stop offset="0%" stopColor={colors.secondary} stopOpacity="0.1"/>
                <stop offset="100%" stopColor="transparent"/>
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bg1)"/>
            <rect width="100" height="100" fill="url(#bg2)"/>
            <rect width="100" height="100" fill="url(#bg3)"/>
          </svg>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${4 + (i % 3) * 2}px`,
              height: `${4 + (i % 3) * 2}px`,
              background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.accent : colors.secondary,
              left: `${10 + (i * 7)}%`,
              top: `${15 + (i * 6)}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
            background: `${colors.primary}15`,
            border: `1px solid ${colors.primary}30`
          }}>
            <Sparkles className="w-5 h-5" style={{color: colors.primary}} />
            <span className="text-sm font-semibold" style={{color: colors.primary}}>
              Why Choose MedGap
            </span>
          </div>
          
          <h2 
            className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            style={{color: colors.text}}
          >
            Transform Your
            <span 
              className="block"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Learning Experience
            </span>
          </h2>
          
          <p 
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{color: `${colors.text}CC`}}
          >
            Discover the powerful features that make MedGap the ultimate learning platform
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            const isVisible = visibleCards.has(benefit.id);
            const isHovered = hoveredCard === benefit.id;
            
            return (
              <div
                key={benefit.id}
                data-card-id={benefit.id}
                className={`group relative transition-all duration-700 ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
                onMouseEnter={() => setHoveredCard(benefit.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Background */}
                <div 
                  className={`relative p-8 rounded-3xl backdrop-blur-xl shadow-xl border transition-all duration-500 h-full ${
                    isHovered ? 'shadow-2xl transform scale-105' : ''
                  }`}
                  style={{
                    background: isHovered 
                      ? `${colors.background}F0`
                      : `${colors.background}E5`,
                    borderColor: isHovered 
                      ? `${benefit.color}40`
                      : `${benefit.color}20`,
                    borderWidth: '2px'
                  }}
                >
                  {/* Floating Icon */}
                  <div className="relative mb-6">
                    <div 
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                        isHovered ? 'scale-110 rotate-6' : ''
                      }`}
                      style={{
                        background: benefit.gradient,
                      }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Pulsing Ring */}
                    <div 
                      className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                        isHovered ? 'scale-125 opacity-30' : 'scale-100 opacity-0'
                      }`}
                      style={{
                        background: benefit.gradient,
                        animation: isHovered ? 'pulse 2s infinite' : 'none'
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 
                      className="text-2xl font-bold transition-colors duration-300"
                      style={{
                        color: isHovered ? benefit.color : colors.text
                      }}
                    >
                      {benefit.title}
                    </h3>
                    
                    <p 
                      className="leading-relaxed"
                      style={{color: `${colors.text}DD`}}
                    >
                      {benefit.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 pt-2">
                      {benefit.features.map((feature, idx) => (
                        <div 
                          key={feature}
                          className={`flex items-center gap-3 transition-all duration-300 ${
                            isHovered ? 'translate-x-2' : ''
                          }`}
                          style={{
                            transitionDelay: `${idx * 50}ms`
                          }}
                        >
                          <CheckCircle 
                            className="w-4 h-4 flex-shrink-0" 
                            style={{color: benefit.color}} 
                          />
                          <span 
                            className="text-sm font-medium"
                            style={{color: `${colors.text}CC`}}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Learn More Button */}
                    <div className={`pt-4 transition-all duration-300 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                      <button 
                        className="group/btn flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300"
                        style={{
                          color: benefit.color,
                          background: `${benefit.color}10`,
                          border: `1px solid ${benefit.color}30`
                        }}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div 
                    className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 ${
                      isHovered ? 'opacity-20' : 'opacity-0'
                    }`}
                    style={{
                      background: benefit.gradient,
                      filter: 'blur(20px)',
                      transform: 'scale(1.1)'
                    }}
                  />
                </div>

                {/* Connection Line (for larger screens) */}
                {index < benefits.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 opacity-30" style={{
                    background: `linear-gradient(90deg, ${benefit.color}, transparent)`,
                    transform: 'translateY(-50%)'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105" style={{
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            color: colors.background
          }}>
            <Zap className="w-5 h-5" />
            <span className="font-bold text-lg">Experience All Features Free</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default BenefitsSection;


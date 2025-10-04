
"use client";
import React, { useState, useEffect } from 'react';
import { ClipboardList, Calendar, BarChart2, Users, BookOpen, TrendingUp, CheckCircle, Clock, Bell, Sparkles, Star, Zap } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: <ClipboardList className="w-12 h-12" />, 
    title: 'Build Your Question Bank',
    subtitle: 'Create & Organize Content',
    color: 'from-[#0F7490] to-[#8B5CF6]',
    bgColor: 'bg-gradient-to-br from-[#0F7490]/5 to-[#8B5CF6]/5',
    borderColor: 'border-[#0F7490]/20',
    teacher: [
      'Select MCQs, True/False, Essay or multimedia questions',
      'Import existing banks via CSV/API',
      'Add hints, explanations, and tags (topic, difficulty)'
    ],
    student: ['Browse available study materials and practice questions'],
    illustration: (
      <div className="relative w-full h-56 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0F7490]/10 to-[#8B5CF6]/10 flex items-center justify-center border border-[#0F7490]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F7490]/5 to-[#8B5CF6]/5"></div>
        {/* Floating elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-[#C9AE6C] rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-6 w-2 h-2 bg-[#8B5CF6] rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-6 left-8 w-4 h-4 bg-[#0F7490]/30 rounded-full animate-pulse delay-700"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl border border-[#0F7490]/10">
            <BookOpen className="w-10 h-10 text-[#0F7490]" />
          </div>
          <div className="flex space-x-3">
            <div className="w-12 h-3 bg-gradient-to-r from-[#0F7490] to-[#C9AE6C] rounded-full animate-pulse shadow-sm"></div>
            <div className="w-16 h-3 bg-gradient-to-r from-[#C9AE6C] to-[#8B5CF6] rounded-full animate-pulse delay-150 shadow-sm"></div>
            <div className="w-8 h-3 bg-gradient-to-r from-[#8B5CF6] to-[#0F7490] rounded-full animate-pulse delay-300 shadow-sm"></div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Sparkles className="w-4 h-4 text-[#C9AE6C] animate-pulse" />
            <span className="text-xs text-[#202938]/60 font-medium">Building Knowledge</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: <Calendar className="w-12 h-12" />, 
    title: 'Schedule & Assign Tests',
    subtitle: 'Smart Distribution & Timing',
    color: 'from-[#C9AE6C] to-[#0F7490]',
    bgColor: 'bg-gradient-to-br from-[#C9AE6C]/5 to-[#0F7490]/5',
    borderColor: 'border-[#C9AE6C]/20',
    teacher: [
      'Set dates, deadlines, and recurring schedules',
      'Configure time limits and randomize questions',
      'Enable auto-reminders via email and in-app notifications'
    ],
    student: [
      '"New Test Available" alert in dashboard',
      'Email and in-app notifications with countdown timers'
    ],
    illustration: (
      <div className="relative w-full h-56 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#C9AE6C]/10 to-[#0F7490]/10 flex items-center justify-center border border-[#C9AE6C]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9AE6C]/5 to-[#0F7490]/5"></div>
        {/* Floating calendar elements */}
        <div className="absolute top-6 right-4 w-6 h-6 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
        </div>
        <div className="absolute bottom-4 right-8 w-4 h-4 bg-[#0F7490]/20 rounded-lg animate-pulse delay-500"></div>
        <div className="absolute top-10 left-6 w-3 h-3 bg-[#C9AE6C] rounded-full animate-bounce delay-1000"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl border border-[#C9AE6C]/10">
            <Clock className="w-10 h-10 text-[#C9AE6C]" />
          </div>
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-[#0F7490] animate-bounce" />
            <div className="w-24 h-4 bg-gradient-to-r from-[#C9AE6C] to-[#0F7490] rounded-full relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
            </div>
            <Star className="w-4 h-4 text-[#8B5CF6] animate-pulse delay-300" />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Zap className="w-4 h-4 text-[#8B5CF6] animate-pulse" />
            <span className="text-xs text-[#202938]/60 font-medium">Smart Scheduling</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: <BarChart2 className="w-12 h-12" />, 
    title: 'Analyze & Improve',
    subtitle: 'Data-Driven Insights',
    color: 'from-[#8B5CF6] to-[#C9AE6C]',
    bgColor: 'bg-gradient-to-br from-[#8B5CF6]/5 to-[#C9AE6C]/5',
    borderColor: 'border-[#8B5CF6]/20',
    teacher: [
      'View visual dashboards: class averages and score distributions',
      'Drill down by student or specific question',
      'Export detailed PDF/CSV reports'
    ],
    student: [
      'Instant feedback on answers with explanations',
      'Personalized study tips & recommended practice drills'
    ],
    illustration: (
      <div className="relative w-full h-56 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-[#8B5CF6]/10 to-[#C9AE6C]/10 flex items-center justify-center border border-[#8B5CF6]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#C9AE6C]/5"></div>
        {/* Floating data elements */}
        <div className="absolute top-4 left-8 w-8 h-2 bg-[#0F7490]/30 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-4 w-6 h-2 bg-[#C9AE6C]/50 rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-8 left-4 w-10 h-2 bg-[#8B5CF6]/40 rounded-full animate-pulse delay-600"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl border border-[#8B5CF6]/10">
            <TrendingUp className="w-10 h-10 text-[#8B5CF6]" />
          </div>
          <div className="flex space-x-2">
            {[12, 20, 16, 28, 24, 32, 18].map((height, i) => (
              <div
                key={i}
                className={`w-3 bg-gradient-to-t rounded-full animate-pulse shadow-sm`}
                style={{ 
                  height: `${height}px`,
                  background: `linear-gradient(to top, #8B5CF6${Math.floor(70 + i * 5)}%, #C9AE6C${Math.floor(40 + i * 10)}%)`,
                  animationDelay: `${i * 0.15}s`
                }}
              ></div>
            ))}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Star className="w-4 h-4 text-[#C9AE6C] animate-pulse" />
            <span className="text-xs text-[#202938]/60 font-medium">Performance Analytics</span>
          </div>
        </div>
      </div>
    )
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-[#F9FAFC] relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-[#0F7490]/10 to-[#8B5CF6]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-br from-[#C9AE6C]/10 to-[#0F7490]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/5 to-[#C9AE6C]/5 rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-[#C9AE6C] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-[#8B5CF6]/50 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#0F7490] rounded-full animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-white/90 to-[#F9FAFC]/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#0F7490]/10 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0F7490] to-[#8B5CF6] rounded-full flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#202938] tracking-wide">SIMPLE • POWERFUL • EFFECTIVE</span>
            <Sparkles className="w-5 h-5 text-[#C9AE6C] ml-3 animate-pulse" />
          </div>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-[#202938] via-[#0F7490] to-[#8B5CF6] bg-clip-text text-transparent mb-6 leading-tight">
            How It Works
          </h2>
          <p className="text-xl text-[#202938]/70 max-w-3xl mx-auto leading-relaxed">
            Transform your teaching experience with our intuitive three-step process designed for modern educators
          </p>
        </div>

        {/* Enhanced Progress indicator */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-6 bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-xl border border-[#0F7490]/10">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 cursor-pointer group ${
                    index <= activeStep 
                      ? `bg-gradient-to-r ${step.color} text-white shadow-xl scale-110 rotate-3` 
                      : 'bg-[#F9FAFC] text-[#202938]/40 border-2 border-[#0F7490]/10 hover:border-[#0F7490]/30'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {index < activeStep ? (
                    <CheckCircle className="w-8 h-8 animate-pulse" />
                  ) : (
                    <span className="text-lg font-bold">{step.id}</span>
                  )}
                  {/* Glow effect */}
                  {index <= activeStep && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-30 -z-10 animate-pulse`}></div>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="relative">
                    <div className={`w-20 h-2 rounded-full transition-all duration-700 ${
                      index < activeStep 
                        ? 'bg-gradient-to-r from-[#0F7490] via-[#C9AE6C] to-[#8B5CF6] shadow-lg' 
                        : 'bg-[#202938]/10'
                    }`}></div>
                    {index < activeStep && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0F7490] via-[#C9AE6C] to-[#8B5CF6] rounded-full blur-sm opacity-50 animate-pulse"></div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`group relative transform transition-all duration-1000 hover:scale-105 hover:-rotate-1 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 300}ms` }}
            >
              {/* Enhanced Card */}
              <div className={`${step.bgColor} rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 p-10 border ${step.borderColor} backdrop-blur-sm relative overflow-hidden group-hover:border-opacity-40`}>
                {/* Enhanced glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl`}></div>
                <div className={`absolute -inset-1 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-3xl -z-10`}></div>
                
                {/* Enhanced Illustration */}
                {step.illustration}
                
                {/* Enhanced Header */}
                <div className="flex flex-col items-center mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center text-white shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 mb-6`}>
                    {step.icon}
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-white/20 rounded-3xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <span className={`text-sm font-bold px-4 py-2 bg-gradient-to-r ${step.color} text-white rounded-2xl shadow-lg`}>
                        Step {step.id}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#202938] mb-2 group-hover:text-[#0F7490] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-[#202938]/60 font-medium">{step.subtitle}</p>
                  </div>
                </div>
                
                {/* Enhanced Content */}
                <div className="space-y-6">
                  {/* Enhanced Teacher Section */}
                  <div className="bg-gradient-to-br from-white/90 to-[#F9FAFC]/90 backdrop-blur-sm rounded-2xl p-6 border border-[#0F7490]/10 shadow-lg group-hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#202938] to-[#0F7490] rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="ml-4 font-bold text-[#202938] text-lg">For Teachers</h4>
                    </div>
                    <ul className="space-y-4">
                      {step.teacher.map((item, idx) => (
                        <li key={idx} className="flex items-start group/item">
                          <div className={`w-6 h-6 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform duration-300`}>
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="ml-4 text-[#202938]/80 leading-relaxed font-medium group-hover/item:text-[#202938] transition-colors duration-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Enhanced Student Section */}
                  <div className="bg-gradient-to-br from-white/90 to-[#F9FAFC]/90 backdrop-blur-sm rounded-2xl p-6 border border-[#8B5CF6]/10 shadow-lg group-hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#C9AE6C] rounded-xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="ml-4 font-bold text-[#202938] text-lg">For Students</h4>
                    </div>
                    <ul className="space-y-4">
                      {step.student.map((item, idx) => (
                        <li key={idx} className="flex items-start group/item">
                          <div className="w-6 h-6 bg-gradient-to-r from-[#8B5CF6] to-[#C9AE6C] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md group-hover/item:scale-110 transition-transform duration-300">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="ml-4 text-[#202938]/80 leading-relaxed font-medium group-hover/item:text-[#202938] transition-colors duration-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#0F7490] via-[#C9AE6C] to-[#8B5CF6] text-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-rotate-1 transition-all duration-500 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#C9AE6C] to-[#0F7490] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
              <span className="text-xl font-bold mr-4">Ready to Transform Your Teaching?</span>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-180 transition-transform duration-500">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
          <p className="text-[#202938]/60 mt-6 text-lg">Join thousands of educators already using our platform</p>
        </div>
      </div>
    </section>
  );
}


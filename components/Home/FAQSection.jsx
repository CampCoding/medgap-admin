
"use client"


import React, { useState } from 'react';
import { ChevronDown, Upload, Settings, Shield, Users, CheckCircle, Lock, Globe, FileText } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(1);

  const faqs = [
    {
      id: 1,
      question: "Can I import my existing questions?",
      answer: "Yes—upload CSV or connect via our API to migrate your legacy content.",
      icon: <Upload className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      details: "Supported formats include CSV, Excel, and direct API integration. Our migration tool preserves question formatting, categories, and metadata."
    },
    {
      id: 2,
      question: "How do I cancel my subscription?",
      answer: "Jump into your Account Settings, click \"Cancel Plan,\" and you're all set—no hassle.",
      icon: <Settings className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      details: "Cancel anytime with just two clicks. Your data remains accessible during your billing period, and you can reactivate at any time."
    },
    {
      id: 3,
      question: "Is student data secure?",
      answer: "Absolutely. We use end‑to‑end encryption, regular audits, and comply with GDPR.",
      icon: <Shield className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
      details: "Bank-level encryption, SOC 2 Type II certified, regular third-party security audits, and full GDPR, FERPA, and COPPA compliance."
    },
    {
      id: 4,
      question: "Do you offer group discounts?",
      answer: "Yes—contact our sales team for volume pricing and academic licensing.",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      details: "Volume discounts start at 10+ licenses. Special academic pricing available for educational institutions with additional features."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const SecurityBadges = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {[
        { icon: <Lock className="w-4 h-4" />, text: "SSL Encrypted" },
        { icon: <Globe className="w-4 h-4" />, text: "GDPR Compliant" },
        { icon: <FileText className="w-4 h-4" />, text: "SOC 2 Certified" },
        { icon: <Shield className="w-4 h-4" />, text: "FERPA Ready" }
      ].map((badge, index) => (
        <div key={index} className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
          <span style={{ color: '#0F7490' }}>{badge.icon}</span>
          <span className="text-sm font-medium" style={{ color: '#202938' }}>{badge.text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-20 px-6" style={{ backgroundColor: '#F9FAFC' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
        
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#202938' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-xl opacity-70" style={{ color: '#202938' }}>
            Everything you need to know about our platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 columns-2">
          {faqs.map((faq, index) => (
            <div key={faq.id} 
                 className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                 style={{ 
                   animationDelay: `${index * 100}ms`,
                   animation: 'fadeInUp 0.6s ease-out forwards'
                 }}>
              
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${faq.color} text-white transform transition-transform duration-300 ${
                    openFAQ === faq.id ? 'scale-110 rotate-12' : ''
                  }`}>
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: '#202938' }}>
                    {faq.question}
                  </h3>
                </div>
                
                <ChevronDown 
                  className={`w-6 h-6 transition-transform duration-300 ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                  style={{ color: '#0F7490' }}
                />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="ml-16 pl-4 border-l-4" style={{ borderColor: '#C9AE6C' }}>
                    <p className="text-lg mb-4" style={{ color: '#202938' }}>
                      {faq.answer}
                    </p>
                    <p className="text-sm opacity-70 leading-relaxed" style={{ color: '#202938' }}>
                      {faq.details}
                    </p>
                    
                    <div className="mt-4 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" style={{ color: '#0F7490' }} />
                      <span className="text-sm font-medium" style={{ color: '#0F7490' }}>
                        Verified Answer
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badges */}
        <SecurityBadges />

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#202938' }}>
              Still have questions?
            </h3>
            <p className="text-lg mb-6 opacity-70" style={{ color: '#202938' }}>
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                      style={{ backgroundColor: '#0F7490' }}>
                Contact Support
              </button>
              <button className="px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                      style={{ 
                        borderColor: '#C9AE6C', 
                        color: '#C9AE6C',
                        backgroundColor: 'transparent'
                      }}>
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button className="w-14 h-14 rounded-full text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse hover:animate-none"
                  style={{ backgroundColor: '#8B5CF6' }}>
            <span className="text-xl">💬</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .8;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQSection;


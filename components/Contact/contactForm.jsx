"use client"


import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef(null);

  const socialIcons = [
    { name: 'Facebook', icon: Facebook, color: 'from-blue-500 to-blue-600', hoverColor: 'from-blue-600 to-blue-700' },
    { name: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', hoverColor: 'from-pink-600 to-purple-700' },
    { name: 'Twitter', icon: Twitter, color: 'from-blue-400 to-blue-500', hoverColor: 'from-blue-500 to-blue-600' },
    { name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-600', hoverColor: 'from-red-600 to-red-700' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 overflow-hidden py-20"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Floating Shapes */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-300/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/25 to-indigo-300/15 rounded-full blur-2xl animate-pulse"
          style={{
            transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`,
            animationDuration: '3s',
            animationDelay: '1s'
          }}
        />
        
        {/* Geometric Shapes */}
        <div 
          className="absolute top-32 left-32 w-20 h-20 bg-gradient-to-r from-teal-300/20 to-cyan-300/20 rounded-2xl rotate-45 animate-spin"
          style={{ animationDuration: '10s' }}
        />
        <div 
          className="absolute bottom-40 right-40 w-16 h-16 bg-gradient-to-l from-blue-300/25 to-indigo-300/15 rounded-full animate-bounce"
          style={{ animationDuration: '3s' }}
        />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          
          {/* Left Side - Contact Information */}
          <div className="space-y-12">
            
            {/* Get in Touch Section */}
            <div 
              className={`transform transition-all duration-1000 ease-out ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              <div className="mb-6">
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold rounded-full shadow-lg animate-glow">
                  GET IN TOUCH
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight mb-6">
                Get in touch and let us know how{' '}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent animate-gradient">
                  we can help.
                </span>
              </h2>
              
              <div className="space-y-2 text-gray-600 text-lg">
                <p>Have questions or ready to start your Arabic journey?</p>
                <p>Contact us today and let's make learning Arabic effortless!</p>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="space-y-8">
              
              {/* Email Support */}
              <div 
                className={`group flex items-start space-x-6 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/40 shadow-lg hover:shadow-xl transform transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                    Email Support
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p className="hover:text-teal-600 transition-colors duration-300 cursor-pointer">support@yourdomain.tld</p>
                    <p className="hover:text-teal-600 transition-colors duration-300 cursor-pointer">hello@yourdomain.tld</p>
                  </div>
                </div>
              </div>

              {/* Phone Support */}
              <div 
                className={`group flex items-start space-x-6 p-6 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/40 shadow-lg hover:shadow-xl transform transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                    Let's Talk
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>For inquiries and booking: <span className="hover:text-green-600 transition-colors duration-300 cursor-pointer">+201285393258</span></p>
                    <p><span className="hover:text-green-600 transition-colors duration-300 cursor-pointer">201270075031+</span> For complaints</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div 
              className={`transform transition-all duration-1000 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Follow our social network
              </h3>
              <div className="flex justify-center space-x-4">
                {socialIcons.map((social, index) => (
                  <div
                    key={social.name}
                    className={`w-14 h-14 bg-gradient-to-r ${social.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer animate-bounce`}
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      animationDuration: '2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.className = e.target.className.replace(social.color, social.hoverColor);
                    }}
                    onMouseLeave={(e) => {
                      e.target.className = e.target.className.replace(social.hoverColor, social.color);
                    }}
                  >
                    <social.icon/>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div 
            className={`transform transition-all duration-1200 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
              
              {/* Form Header */}
              <div className="mb-8">
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-full shadow-lg animate-glow">
                  SEND US MESSAGE
                </span>
                <h3 className="text-3xl font-black text-gray-800 mt-4 leading-tight">
                  Don't hesitate to{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    contact us
                  </span>
                  <br />
                  for more information
                </h3>
              </div>

              {/* Contact Form */}
              <div className="space-y-6">
                
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('firstName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="First Name"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        focusedField === 'firstName' 
                          ? 'border-teal-500 bg-white shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('lastName')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Last Name"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        focusedField === 'lastName' 
                          ? 'border-teal-500 bg-white shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Phone"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        focusedField === 'phone' 
                          ? 'border-teal-500 bg-white shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Email"
                      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        focusedField === 'email' 
                          ? 'border-teal-500 bg-white shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Subject"
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                      focusedField === 'subject' 
                        ? 'border-teal-500 bg-white shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Message"
                    rows={5}
                    className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                      focusedField === 'message' 
                        ? 'border-teal-500 bg-white shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-white text-lg shadow-lg transform transition-all duration-300 ${
                    isSubmitted 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 scale-105' 
                      : isSubmitting
                        ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {isSubmitted ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Message Sent!</span>
                    </span>
                  ) : isSubmitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </span>
                  ) : (
                    'SEND MESSAGE'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.4); }
          50% { box-shadow: 0 0 30px rgba(20, 184, 166, 0.7); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactSection;
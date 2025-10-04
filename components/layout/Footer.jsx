"use client";

import { useState, useEffect } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AnimatedFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const socialIcons = [
    { Icon: Facebook, color: "hover:bg-blue-600", delay: "delay-100" },
    {
      Icon: Instagram,
      color: "hover:bg-gradient-to-br from-purple-600 to-pink-600",
      delay: "delay-200",
    },
    { Icon: Twitter, color: "hover:bg-sky-500", delay: "delay-300" },
    { Icon: Youtube, color: "hover:bg-red-600", delay: "delay-400" },
  ];

  const supportLinks = [
    "Help Center",
    "My Account",
    "Ticket Support",
    "FAQs",
    "Contact us",
  ];

  const companyLinks = [
    "About us",
    "Instructors",
    "Careers",
    "Article & News",
    "Legal Notice",
  ];

  return (
    <footer className="relative bg-background ">
      {/* Animated Background Elements */}
   
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full opacity-30 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-ping delay-2000"></div>
        <div className="absolute top-20 right-1/3 w-8 h-8 bg-purple-200 rounded-full opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <Sparkles className="w-4 h-4 text-teal-500" />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Content */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-4 gap-12 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
              {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="group flex items-center space-x-4 transition-transform duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 transform group-hover:rotate-3">
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl opacity-20 group-hover:opacity-40 transition-all duration-300 blur-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl group-hover:from-white/30 transition-all duration-300"></div>
                </div>
                <div>
                  <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
                    MedGap
                  </span>
                  <div className="text-xs text-gray-500 font-medium tracking-wider uppercase">
                    Healthcare Solutions
                  </div>
                </div>
              </a>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                We help you learn Arabic in a fun and interactive way, no matter
                your level. Join us and experience a learning journey tailored
                just for you!
              </p>

              {/* Social Icons */}
              <div className="flex space-x-3">
                {socialIcons.map(({ Icon, color, delay }, index) => (
                  <div
                    key={index}
                    className={`relative group transition-all duration-500 transform hover:scale-110 ${delay}`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300`}
                    ></div>
                    <button
                      className={`relative w-12 h-12 bg-white rounded-xl shadow-md ${color} hover:text-white transition-all duration-300 flex items-center justify-center group-hover:shadow-xl`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div
            className={`transition-all duration-700 delay-300 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-2xl font-bold text-accent mb-6 relative">
              Support
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center text-gray-600 hover:text-accent transition-all duration-300"
                    onMouseEnter={() => setHoveredLink(`support-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <ArrowRight
                      className={`w-4 h-4 mr-2 transition-all duration-300 ${
                        hoveredLink === `support-${index}`
                          ? "translate-x-1 text-teal-500"
                          : "translate-x-0 opacity-0"
                      }`}
                    />
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {link}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div
            className={`transition-all duration-700 delay-500 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-2xl font-bold text-accent mb-6 relative">
              Company
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="group flex items-center text-gray-600 hover:text-accent transition-all duration-300"
                    onMouseEnter={() => setHoveredLink(`company-${index}`)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <ArrowRight
                      className={`w-4 h-4 mr-2 transition-all duration-300 ${
                        hoveredLink === `company-${index}`
                          ? "translate-x-1 text-teal-500"
                          : "translate-x-0 opacity-0"
                      }`}
                    />
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {link}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div
            className={`transition-all duration-700 delay-700 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="text-2xl font-bold text-accent mb-6 relative">
              Newsletter
              <div className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"></div>
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Sign up our newsletter to get update information, news and free
              insight.
            </p>

            <div className="space-y-4">
              <div
                className={`relative transition-all duration-500 ${
                  emailFocused ? "scale-105" : "scale-100"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl transition-all duration-300 ${
                    emailFocused ? "blur-md opacity-30" : "blur-sm opacity-0"
                  }`}
                ></div>
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                      emailFocused ? "text-teal-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-teal-400 focus:outline-none transition-all duration-300 shadow-lg focus:shadow-xl"
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                  />
                </div>
              </div>

              <button className="group relative w-full py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <span className="group-hover:scale-105 transition-transform duration-300">
                    SIGN UP
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`mt-16 pt-8 border-t border-teal-200 transition-all duration-1000 delay-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-center md:text-left">
              Copyright© {new Date().getFullYear()} MedGap, All rights reserved. Powered by{" "}
              <span className="font-semibold text-accent hover:text-teal-800 transition-colors duration-300 cursor-pointer">
                Camp Coding
              </span>
            </p>

            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              {["Term of use", "Privacy Policy", "Cookie Policy"].map(
                (item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-600 hover:text-accent transition-all duration-300 relative group"
                  >
                    {item}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300"></div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}

export function ArabicLearningBanner() {
  return (
    <div className="bg-teal-500 text-white py-6 px-4 md:px-12 shadow-md relative overflow-hidden">
      {/* Decorative arc */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-teal-400 rounded-l-full opacity-60">
        <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-dashed border-white rounded-full"></div>
      </div>

      <div className="relative z-10 text-center">
        <h2 className="text-xl md:text-2xl font-semibold tracking-wide">
          Speak Arabic with Confidence – Join Our Personalized Learning
          Experience
        </h2>
      </div>
    </div>
  );
}

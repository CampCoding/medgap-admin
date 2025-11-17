"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: Mail, text: "hello@medgap.com", href: "mailto:hello@medgap.com" },
    { icon: MapPin, text: "New York, NY", href: "#" },
    { icon: Clock, text: "Mon-Fri 9AM-6PM", href: "#" },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      {/* Top Contact Bar */}
      <div
        className={`bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white transition-all duration-500 relative overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div
            className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse`}
          ></div>
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between py-3 text-sm">
            {/* Contact Info - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {contactInfo.slice(0, 2).map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-2 hover:text-cyan-300 transition-all duration-300 group"
                >
                  <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                    <item.icon size={14} />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </a>
              ))}
            </div>

            {/* Additional Info - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {contactInfo.slice(2).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-purple-200 group"
                >
                  <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300">
                    <item.icon size={14} />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Mobile Contact - Just Phone */}
            <div className="md:hidden flex items-center justify-center w-full">
              <a
                href="tel:+15551234567"
                className="flex items-center space-x-3 hover:text-cyan-300 transition-all duration-300 group"
              >
                <div className="p-2 rounded-full bg-white/15 group-hover:bg-white/25 transition-all duration-300">
                  <Phone size={16} />
                </div>
                <span className="font-semibold text-base">
                  +1 (555) 123-4567
                </span>
              </a>
            </div>

            {/* Social Links - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-purple-200 text-sm font-medium">
                Follow us:
              </span>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white/95 backdrop-blur-md border-b py-3 border-gray-100/50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-22">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative px-5 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-all duration-300 group rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                >
                  {item.label}
                  <span className="absolute inset-x-5 bottom-2 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full"></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center space-x-4">
              <a
                href="/login"
                className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50"
              >
                Login
              </a>
              <a
                href="/signup"
                className="relative px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transform transition-all duration-300 text-gray-700 ${
                    mobileOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transform transition-all duration-300 text-gray-700 ${
                    mobileOpen ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="py-6 border-t border-gradient-to-r from-gray-100 to-gray-200">
              {/* Mobile Contact Info */}
              <div className="mb-6 mx-4 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <a
                    href="tel:+15551234567"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors duration-300 group"
                  >
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Phone size={16} className="text-purple-600" />
                    </div>
                    <span className="font-semibold">Call us</span>
                  </a>
                  <a
                    href="mailto:hello@medgap.com"
                    className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors duration-300 group"
                  >
                    <div className="p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Mail size={16} className="text-purple-600" />
                    </div>
                    <span className="font-semibold">Email us</span>
                  </a>
                </div>
              </div>
              <div className="py-4 border-t border-gray-100">
                {/* Mobile Contact Info */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <a
                      href="tel:+15551234567"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                    >
                      <Phone size={14} />
                      <span>Call us</span>
                    </a>
                    <a
                      href="mailto:hello@medgap.com"
                      className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                    >
                      <Mail size={14} />
                      <span>Email us</span>
                    </a>
                  </div>
                </div>

                <nav className="flex flex-col space-y-1">
                  {navItems.map((item, index) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 transform ${
                        mobileOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: mobileOpen ? `${index * 50}ms` : "0ms",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}

                  <div className="pt-4 space-y-3">
                    <a
                      href="/login"
                      className={`block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200 transform ${
                        mobileOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: mobileOpen
                          ? `${navItems.length * 50}ms`
                          : "0ms",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className={`block mx-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform ${
                        mobileOpen
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                      style={{
                        transitionDelay: mobileOpen
                          ? `${(navItems.length + 1) * 50}ms`
                          : "0ms",
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      Get Started
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

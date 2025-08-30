"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  PenTool,
  Image,
  Video,
  Music,
  Tag,
  TrendingDown,
  BookOpen,
  Layers,
  Calendar,
  Clock,
  Bell,
  RefreshCw,
  UserCheck,
  Edit3,
  Eye,
  AlertCircle,
  Sparkles,
  Star,
  Zap,
  ArrowRight,
  Play,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "Rich Question Types",
    subtitle: "Diverse Assessment Options",
    description:
      "MCQs, True/False, Essay with optional multimedia attachments.",
    color: "from-[#0F7490] to-[#8B5CF6]",
    bgColor: "bg-gradient-to-br from-[#0F7490]/5 to-[#8B5CF6]/5",
    borderColor: "border-[#0F7490]/20",
    icon: <FileText className="w-8 h-8" />,
    features: [
      {
        icon: <CheckCircle className="w-5 h-5" />,
        text: "Multiple Choice Questions",
      },
      {
        icon: <CheckCircle className="w-5 h-5" />,
        text: "True/False Questions",
      },
      { icon: <PenTool className="w-5 h-5" />, text: "Essay Questions" },
      { icon: <Image className="w-5 h-5" />, text: "Image Attachments" },
      { icon: <Video className="w-5 h-5" />, text: "Video Integration" },
      { icon: <Music className="w-5 h-5" />, text: "Audio Support" },
    ],
    illustration: (
      <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#0F7490]/10 to-[#8B5CF6]/10 flex items-center justify-center overflow-hidden border border-[#0F7490]/10">
        {/* Floating question type icons */}
        <div className="absolute top-4 left-6 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
          <CheckCircle className="w-6 h-6 text-[#0F7490]" />
        </div>
        <div className="absolute top-6 right-4 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center shadow-lg animate-bounce delay-300">
          <PenTool className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <div className="absolute bottom-6 left-4 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-700">
          <Image className="w-5 h-5 text-[#C9AE6C]" />
        </div>
        <div className="absolute bottom-8 right-6 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center shadow-lg animate-bounce delay-500">
          <Video className="w-4 h-4 text-[#0F7490]" />
        </div>

        {/* Central icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl">
          <FileText className="w-8 h-8 text-[#0F7490]" />
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Advanced Metadata",
    subtitle: "Smart Organization System",
    description:
      'Tag by difficulty, topic, unit—and surface "weak‑area" suggestions.',
    color: "from-[#C9AE6C] to-[#0F7490]",
    bgColor: "bg-gradient-to-br from-[#C9AE6C]/5 to-[#0F7490]/5",
    borderColor: "border-[#C9AE6C]/20",
    icon: <Tag className="w-8 h-8" />,
    features: [
      { icon: <Tag className="w-5 h-5" />, text: "Difficulty Tagging" },
      { icon: <BookOpen className="w-5 h-5" />, text: "Topic Classification" },
      { icon: <Layers className="w-5 h-5" />, text: "Unit Organization" },
      {
        icon: <TrendingDown className="w-5 h-5" />,
        text: "Weak Area Detection",
      },
      { icon: <Sparkles className="w-5 h-5" />, text: "Smart Suggestions" },
      { icon: <Star className="w-5 h-5" />, text: "Performance Insights" },
    ],
    illustration: (
      <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#C9AE6C]/10 to-[#0F7490]/10 flex items-center justify-center overflow-hidden border border-[#C9AE6C]/10">
        {/* Floating tags */}
        <div className="absolute top-3 left-4 px-3 py-1 bg-gradient-to-r from-[#0F7490] to-[#8B5CF6] text-white text-xs rounded-full animate-pulse">
          Easy
        </div>
        <div className="absolute top-8 right-6 px-3 py-1 bg-gradient-to-r from-[#C9AE6C] to-[#0F7490] text-white text-xs rounded-full animate-pulse delay-300">
          Math
        </div>
        <div className="absolute bottom-4 left-6 px-3 py-1 bg-gradient-to-r from-[#8B5CF6] to-[#C9AE6C] text-white text-xs rounded-full animate-pulse delay-600">
          Unit 1
        </div>
        <div className="absolute bottom-8 right-4 px-2 py-1 bg-red-400/80 text-white text-xs rounded-full animate-pulse delay-900">
          Weak
        </div>

        {/* Central icon with orbiting elements */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl">
            <Tag className="w-8 h-8 text-[#C9AE6C]" />
          </div>
          {/* Orbiting dots */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#8B5CF6] rounded-full animate-spin"></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#0F7490] rounded-full animate-spin delay-500"></div>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "Smart Scheduling",
    subtitle: "Automated Time Management",
    description:
      "Calendar view, deadline reminders and recurring test options.",
    color: "from-[#8B5CF6] to-[#C9AE6C]",
    bgColor: "bg-gradient-to-br from-[#8B5CF6]/5 to-[#C9AE6C]/5",
    borderColor: "border-[#8B5CF6]/20",
    icon: <Calendar className="w-8 h-8" />,
    features: [
      { icon: <Calendar className="w-5 h-5" />, text: "Calendar Integration" },
      { icon: <Clock className="w-5 h-5" />, text: "Deadline Tracking" },
      { icon: <Bell className="w-5 h-5" />, text: "Smart Reminders" },
      { icon: <RefreshCw className="w-5 h-5" />, text: "Recurring Tests" },
      { icon: <Zap className="w-5 h-5" />, text: "Auto-Scheduling" },
      { icon: <AlertCircle className="w-5 h-5" />, text: "Priority Alerts" },
    ],
    illustration: (
      <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#C9AE6C]/10 flex items-center justify-center overflow-hidden border border-[#8B5CF6]/10">
        {/* Calendar grid */}
        <div className="absolute top-4 left-4 grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded ${
                i === 4 ? "bg-[#8B5CF6] animate-pulse" : "bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Floating notification */}
        <div className="absolute top-6 right-4 flex items-center space-x-1 bg-white/90 rounded-lg px-2 py-1 shadow-lg animate-bounce">
          <Bell className="w-3 h-3 text-[#C9AE6C]" />
          <span className="text-xs text-[#202938]">Due</span>
        </div>

        {/* Recurring indicator */}
        <div className="absolute bottom-4 right-6 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
          <RefreshCw className="w-4 h-4 text-[#8B5CF6] animate-spin" />
        </div>

        {/* Central calendar icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl">
          <Calendar className="w-8 h-8 text-[#8B5CF6]" />
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "Reviewer Workflow",
    subtitle: "Quality Assurance System",
    description:
      'Reviewer role to mark questions as "Reviewed" or "Needs edits."',
    color: "from-[#0F7490] to-[#C9AE6C]",
    bgColor: "bg-gradient-to-br from-[#0F7490]/5 to-[#C9AE6C]/5",
    borderColor: "border-[#0F7490]/20",
    icon: <UserCheck className="w-8 h-8" />,
    features: [
      { icon: <UserCheck className="w-5 h-5" />, text: "Reviewer Roles" },
      { icon: <Eye className="w-5 h-5" />, text: "Review Process" },
      { icon: <CheckCircle className="w-5 h-5" />, text: "Approval System" },
      { icon: <Edit3 className="w-5 h-5" />, text: "Edit Requests" },
      { icon: <AlertCircle className="w-5 h-5" />, text: "Status Tracking" },
      { icon: <Star className="w-5 h-5" />, text: "Quality Control" },
    ],
    illustration: (
      <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-[#0F7490]/10 to-[#C9AE6C]/10 flex items-center justify-center overflow-hidden border border-[#0F7490]/10">
        {/* Review status indicators */}
        <div className="absolute top-4 left-4 flex items-center space-x-1 bg-green-100 rounded-lg px-2 py-1">
          <CheckCircle className="w-3 h-3 text-green-600" />
          <span className="text-xs text-green-700">Reviewed</span>
        </div>

        <div className="absolute top-4 right-4 flex items-center space-x-1 bg-orange-100 rounded-lg px-2 py-1">
          <Edit3 className="w-3 h-3 text-orange-600" />
          <span className="text-xs text-orange-700">Needs Edit</span>
        </div>

        {/* Workflow arrows */}
        <div className="absolute bottom-6 left-6 flex items-center space-x-2">
          <div className="w-4 h-4 bg-[#0F7490] rounded-full"></div>
          <ArrowRight className="w-4 h-4 text-[#C9AE6C] animate-pulse" />
          <div className="w-4 h-4 bg-[#C9AE6C] rounded-full"></div>
        </div>

        {/* Central reviewer icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-white to-[#F9FAFC] rounded-2xl flex items-center justify-center shadow-xl">
          <UserCheck className="w-8 h-8 text-[#0F7490]" />
        </div>
      </div>
    ),
  },
];

export default function FeatureHighlights() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24  bg-gradient-to-br from-[#F9FAFC] via-white to-[#F9FAFC] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#0F7490]/5 to-[#8B5CF6]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#C9AE6C]/5 to-[#0F7490]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#C9AE6C] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#8B5CF6]/50 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-white/90 to-[#F9FAFC]/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#0F7490]/10 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0F7490] to-[#8B5CF6] rounded-full flex items-center justify-center mr-3">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-[#202938] tracking-wide">
              POWERFUL FEATURES
            </span>
            <Sparkles className="w-5 h-5 text-[#C9AE6C] ml-3 animate-pulse" />
          </div>

          <h2 className="text-6xl font-bold bg-gradient-to-r from-[#202938] via-[#0F7490] to-[#8B5CF6] bg-clip-text text-transparent mb-6 leading-tight">
            Feature Highlights
          </h2>
          <p className="text-xl text-[#202938]/70 max-w-3xl mx-auto leading-relaxed">
            Discover the advanced capabilities that make our platform the
            perfect choice for modern education
          </p>
        </div>

        {/* Features Grid */}

            {/* Interactive Feature Navigator */}
        <div className=" flex justify-center mb-12">
          <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-[#0F7490]/10">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-500 ${
                  activeFeature === index
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg scale-105`
                    : "text-[#202938]/60 hover:text-[#202938] hover:bg-[#F9FAFC]"
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  {feature.icon}
                </div>
                <span className="font-semibold hidden sm:block">
                  {feature.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group rounded-3xl relative transform transition-all duration-1000 hover:scale-105 cursor-pointer ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              } ${
                activeFeature === index
                  ? "ring-2 ring-[#0F7490]/20 scale-105"
                  : ""
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onClick={() => setActiveFeature(index)}
            >
              {/* Card */}
              <div
                className={`${feature.bgColor} h-full rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 p-8 border ${feature.borderColor} backdrop-blur-sm relative overflow-hidden`}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl`}
                ></div>
                <div
                  className={`absolute -inset-1 h-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 rounded-3xl -z-10`}
                ></div>

                {/* Illustration */}
                {/* <div className="mb-8">{feature.illustration}</div> */}

                {/* Header */}
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div
                    className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-500`}
                  >
                    {feature.icon}
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-2xl font-bold text-[#202938] mb-2 group-hover:text-[#0F7490] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-[#202938]/60 font-medium mb-3">
                      {feature.subtitle}
                    </p>
                    <p className="text-[#202938]/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Feature List */}
                <div className="bg-gradient-to-br from-white/80 to-[#F9FAFC]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
                  <div className="grid grid-cols-1 sm:grid-cols-1  gap-4">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center group/item">
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover/item:scale-110 transition-transform duration-300`}
                        >
                          {React.cloneElement(item.icon, {
                            className: "w-4 h-4 text-white",
                          })}
                        </div>
                        <span className="ml-3 text-[#202938]/80 font-medium group-hover/item:text-[#202938] transition-colors duration-300">
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-[#0F7490] via-[#C9AE6C] to-[#8B5CF6] text-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] via-[#C9AE6C] to-[#0F7490] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex items-center">
              <Play className="w-6 h-6 mr-3 animate-pulse" />
              <span className="text-xl font-bold mr-4">
                Explore All Features
              </span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
          <p className="text-[#202938]/60 mt-6 text-lg">
            Discover how these features work together seamlessly
          </p>
        </div>
      </div>
    </section>
  );
}

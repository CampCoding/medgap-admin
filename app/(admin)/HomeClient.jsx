"use client";

import React, { useState } from "react";
import {
  Users,
  GraduationCap,
  HelpCircle,
  FileText,
  Bell,
  Settings,
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Plus,
  BookOpen,
} from "lucide-react";

const HomeClient = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [notifications, setNotifications] = useState(3);
  const [hoveredCard, setHoveredCard] = useState(null);

  const menuItems = [
    { name: "Overview", icon: BarChart3 },
    { name: "Teachers", icon: Users },
    { name: "Students", icon: GraduationCap },
    { name: "Questions", icon: HelpCircle },
    { name: "Exams", icon: FileText },
    { name: "Notifications", icon: Bell, badge: notifications },
    { name: "Settings", icon: Settings },
  ];

  const stats = [
    {
      title: "Teachers",
      value: "120",
      icon: Users,
      change: "+5%",
      trend: "up",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Students",
      value: "340",
      icon: GraduationCap,
      change: "+12%",
      trend: "up",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Questions",
      value: "1,230",
      icon: HelpCircle,
      change: "+8%",
      trend: "up",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Active Exams",
      value: "24",
      icon: Award,
      change: "+3%",
      trend: "up",
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
  ];

  const stats2 = [
    {
      id: 1,
      title: "Teachers",
      value: "120",
      icon: Users,
      color: "text-[#0F7490]",
      bgGradient: "from-[#0F7490]/10 to-[#0F7490]/5",
      borderColor: "border-[#0F7490]/20",
      trend: "+12 this week",
    },
    {
      id: 2,
      title: "Students",
      value: "340",
      icon: GraduationCap,
      color: "text-[#C9AE6C]",
      bgGradient: "from-[#C9AE6C]/10 to-[#C9AE6C]/5",
      borderColor: "border-[#C9AE6C]/20",
      trend: "+3 this month",
    },
    {
      id: 3,
      title: "Questions",
      value: "1,230",
      icon: HelpCircle,
      color: "text-[#8B5CF6]",
      bgGradient: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",
      borderColor: "border-[#8B5CF6]/20",
      trend: "+45 active today",
    },
    {
      id: 4,
      title: "Active Exams",
      value: "24",
      icon: Award,
      color: "text-[#8B5CF6]",
      color: "text-[#0F7490]",
      bgGradient: "from-[#0F7490]/10 to-[#0F7490]/5",
      borderColor: "border-[#0F7490]/20",
      trend: "+12 this week",
    },
  ];

  const actions = [
    {
      id: 1,
      title: "View My Modules",
      icon: BookOpen,
      bgColor: "bg-gradient-to-br from-[#0F7490] to-[#0F7490]/80",
      hoverColor: "hover:from-[#0F7490]/90 hover:to-[#0F7490]/70",
      description: "Create engaging questions for your students",
    },
    {
      id: 2,
      title: "Create New Exam",
      icon: FileText,
      bgColor: "bg-gradient-to-br from-[#C9AE6C] to-[#C9AE6C]/80",
      hoverColor: "hover:from-[#C9AE6C]/90 hover:to-[#C9AE6C]/70",
      description: "Build comprehensive assessments",
    },
    {
      id: 3,
      title: "View Student Reports",
      icon: BarChart3,
      bgColor: "bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/80",
      hoverColor: "hover:from-[#8B5CF6]/90 hover:to-[#8B5CF6]/70",
      description: "Analyze student performance data",
    },
  ];

  const recentActivities = [
    { action: "New teacher registered", time: "2 hours ago", type: "user" },
    { action: 'Exam "Math Final" created', time: "4 hours ago", type: "exam" },
    { action: "15 new questions added", time: "1 day ago", type: "question" },
    {
      action: "Student performance report generated",
      time: "2 days ago",
      type: "report",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#202938] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-[#202938]/60 text-lg">
                Welcome back! Here's what's happening with your system today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <Calendar className="w-6 h-6 text-[#0F7490]" />
              </div>
              <div className="text-right">
                <p className="text-sm text-[#202938]/60">Today</p>
                <p className="font-semibold text-[#202938]">August 2, 2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats2.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className={`bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105`}
                onMouseEnter={() => setHoveredCard(stat.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-white shadow-sm ${stat.color}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div
                    className={`transition-all duration-300 ${
                      hoveredCard === stat.id
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-2"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div>
                  <h3 className="text-[#202938]/70 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-[#202938] mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#202938]/50">{stat.trend}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* --------------------------------------------- */}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}

          <div className=" lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#202938]">
                Recent Activity
              </h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: "#F9FAFC" }}
                  >
                    {activity.type === "user" && (
                      <Users className="w-5 h-5" style={{ color: "#0F7490" }} />
                    )}
                    {activity.type === "exam" && (
                      <FileText
                        className="w-5 h-5"
                        style={{ color: "#C9AE6C" }}
                      />
                    )}
                    {activity.type === "question" && (
                      <HelpCircle
                        className="w-5 h-5"
                        style={{ color: "#8B5CF6" }}
                      />
                    )}
                    {activity.type === "report" && (
                      <BarChart3
                        className="w-5 h-5"
                        style={{ color: "#0F7490" }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium" style={{ color: "#202938" }}>
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className=" mb-6">
              <h3 className="text-xl font-bold text-[#202938]">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                <div className="flex items-center">
                  <Users
                    className="w-5 h-5 mr-3"
                    style={{ color: "#0F7490" }}
                  />
                  <span className="font-medium" style={{ color: "#202938" }}>
                    Add New Teacher
                  </span>
                </div>
              </button>

              <button className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                <div className="flex items-center">
                  <FileText
                    className="w-5 h-5 mr-3"
                    style={{ color: "#C9AE6C" }}
                  />
                  <span className="font-medium" style={{ color: "#202938" }}>
                    Create New Exam
                  </span>
                </div>
              </button>

              <button className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
                <div className="flex items-center">
                  <HelpCircle
                    className="w-5 h-5 mr-3"
                    style={{ color: "#8B5CF6" }}
                  />
                  <span className="font-medium" style={{ color: "#202938" }}>
                    Add Questions
                  </span>
                </div>
              </button>

              <button className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all">
                <div className="flex items-center">
                  <BarChart3
                    className="w-5 h-5 mr-3"
                    style={{ color: "#0F7490" }}
                  />
                  <span className="font-medium" style={{ color: "#202938" }}>
                    View Reports
                  </span>
                </div>
              </button>
            </div>

            {/* Upcoming Events */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-semibold mb-4" style={{ color: "#202938" }}>
                Upcoming Events
              </h4>

              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar
                    className="w-4 h-4 mr-2"
                    style={{ color: "#8B5CF6" }}
                  />
                  <span className="text-gray-600">Math Exam - Aug 5</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar
                    className="w-4 h-4 mr-2"
                    style={{ color: "#C9AE6C" }}
                  />
                  <span className="text-gray-600">Teacher Meeting - Aug 8</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar
                    className="w-4 h-4 mr-2"
                    style={{ color: "#0F7490" }}
                  />
                  <span className="text-gray-600">Report Due - Aug 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;

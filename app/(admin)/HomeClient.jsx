"use client";

import React, { useEffect, useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleGetHomeStatistics } from "../../features/homeStatistics";

const HomeClient = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { home_data, home_loading } = useSelector((state) => state?.home);

  useEffect(() => {
    dispatch(handleGetHomeStatistics());
  }, [dispatch]);

  const stats2 = [
    {
      id: 1,
      title: "Teachers",
      value: home_data?.data?.overview?.teachers ?? 0,
      icon: Users,
      color: "text-[#0F7490]",
      bgGradient: "from-[#0F7490]/10 to-[#0F7490]/5",
      borderColor: "border-[#0F7490]/20",
      trend: "",
    },
    {
      id: 2,
      title: "Students",
      value: home_data?.data?.overview?.students ?? 0,
      icon: GraduationCap,
      color: "text-[#C9AE6C]",
      bgGradient: "from-[#C9AE6C]/10 to-[#C9AE6C]/5",
      borderColor: "border-[#C9AE6C]/20",
      trend: "",
    },
    {
      id: 3,
      title: "Questions",
      value: home_data?.data?.overview?.questions ?? 0,
      icon: HelpCircle,
      color: "text-[#8B5CF6]",
      bgGradient: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",
      borderColor: "border-[#8B5CF6]/20",
      trend: "",
    },
    {
      id: 4,
      title: "Active Exams",
      value: home_data?.data?.overview?.active_exams ?? 0,
      icon: Award,
      color: "text-[#0F7490]",
      bgGradient: "from-[#0F7490]/10 to-[#0F7490]/5",
      borderColor: "border-[#0F7490]/20",
      trend: "",
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
                Welcome back! Here’s what’s happening with your system today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <Calendar className="w-6 h-6 text-[#0F7490]" />
              </div>
              <div className="text-right">
                <p className="text-sm text-[#202938]/60">Today</p>
                <p className="font-semibold text-[#202938]">
                  {new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
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
          {/* -------------------- Recent Activity -------------------- */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#202938]">
                Recent Activity
              </h3>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            {home_loading ? (
              <div className="text-center py-10 text-gray-500 animate-pulse">
                Loading recent activities...
              </div>
            ) : (
              <div className="space-y-4">
                {home_data?.data?.recentActivity?.length > 0 ? (
                  home_data.data.recentActivity.map((activity, index) => {
                    const { title, details, at } = activity;

                    // Detect icon/color dynamically
                    const lower = title.toLowerCase();
                    let IconComponent = Bell;
                    let color = "#0F7490";
                    if (lower.includes("teacher")) {
                      IconComponent = Users;
                      color = "#0F7490";
                    } else if (lower.includes("question")) {
                      IconComponent = HelpCircle;
                      color = "#8B5CF6";
                    } else if (lower.includes("exam")) {
                      IconComponent = FileText;
                      color = "#C9AE6C";
                    } else if (lower.includes("student")) {
                      IconComponent = GraduationCap;
                      color = "#02AAA0";
                    }

                    // Time formatting
                    const date = new Date(at);
                    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
                    const formatted =
                      diff < 60
                        ? "Just now"
                        : diff < 3600
                        ? `${Math.floor(diff / 60)} mins ago`
                        : diff < 86400
                        ? `${Math.floor(diff / 3600)} hours ago`
                        : `${Math.floor(diff / 86400)} days ago`;

                    return (
                      <div
                        key={index}
                        className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                          style={{ backgroundColor: "#F9FAFC" }}
                        >
                          <IconComponent
                            className="w-5 h-5"
                            style={{ color }}
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium text-[#202938]">{title}</p>
                          <p className="text-sm text-gray-600">{details}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatted}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-gray-500 italic">
                    No recent activities found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* -------------------- Quick Actions -------------------- */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#202938]">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/teachers`)}
                className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="flex items-center">
                  <Users
                    className="w-5 h-5 mr-3"
                    style={{ color: "#0F7490" }}
                  />
                  <span className="font-medium text-[#202938]">
                    Add New Teacher
                  </span>
                </div>
              </button>

              <button
                onClick={() => router.push(`/subjects`)}
                className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
              >
                <div className="flex items-center">
                  <FileText
                    className="w-5 h-5 mr-3"
                    style={{ color: "#C9AE6C" }}
                  />
                  <span className="font-medium text-[#202938]">
                    Create New Module
                  </span>
                </div>
              </button>

              <button
                onClick={() => router.push(`/reviewers`)}
                className="w-full text-left p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
              >
                <div className="flex items-center">
                  <HelpCircle
                    className="w-5 h-5 mr-3"
                    style={{ color: "#8B5CF6" }}
                  />
                  <span className="font-medium text-[#202938]">
                    Add Reviewer
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeClient;

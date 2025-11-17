"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Share2,
  Download,
  Users,
  Clock,
  Calendar,
  BookOpen,
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  MoreVertical,
  FileText,
  Target,
  PieChart,
  Activity,
  Plus,
  FileQuestionIcon,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import Link from "next/link";
import InteractiveQuestionsTab from "../../../../../components/Exams/InterActvieQuestionTab";


export default function ExamDetailView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchStudent, setSearchStudent] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C",
    accent: "#8B5CF6",
    background: "#F9FAFC",
    text: "#202938",
  };
  // Sample exam data
  const examData = {
    id: 1,
    title: "Algebra Midterm",
    subject: "Mathematics",
    difficulty: "Medium",
    status: "Published",
    date: "2025-07-28",
    duration: "90 minutes",
    totalQuestions: 15,
    totalStudents: 32,
    completedStudents: 28,
    averageScore: 78,
    highestScore: 95,
    lowestScore: 45,
    passingGrade: 60,
    passRate: 85,
    description:
      "Comprehensive midterm examination covering algebraic expressions, equations, and problem-solving techniques.",
    instructions:
      "Read all questions carefully. Show your work for partial credit. You have 90 minutes to complete this exam.",
    createdDate: "2025-07-15",
    lastModified: "2025-07-20",
  };

  // Sample questions data
  const questionsData = [
    {
      id: 1,
      question: "Solve for x: 2x + 5 = 17",
      type: "Multiple Choice",
      points: 5,
      difficulty: "Easy",
      correctAnswer: "x = 6",
      options: ["x = 4", "x = 6", "x = 8", "x = 10"],
      correctRate: 85,
    },
    {
      id: 2,
      question: "Factor the expression: x² - 9x + 14",
      type: "Short Answer",
      points: 8,
      difficulty: "Medium",
      correctAnswer: "(x - 2)(x - 7)",
      correctRate: 68,
    },
    {
      id: 3,
      question: "Graph the inequality: y ≤ 2x + 3",
      type: "Essay",
      points: 12,
      difficulty: "Hard",
      correctAnswer: "Graph with shaded region below the line",
      correctRate: 45,
    },
  ];

  // Sample student results
  const studentResults = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@school.com",
      score: 92,
      grade: "A",
      completedAt: "2025-07-28 10:45",
      timeSpent: "75 minutes",
      status: "Completed",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@school.com",
      score: 78,
      grade: "B+",
      completedAt: "2025-07-28 11:20",
      timeSpent: "85 minutes",
      status: "Completed",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@school.com",
      score: 65,
      grade: "C+",
      completedAt: "2025-07-28 09:30",
      timeSpent: "88 minutes",
      status: "Completed",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@school.com",
      score: 0,
      grade: "Incomplete",
      completedAt: null,
      timeSpent: null,
      status: "Pending",
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      Published: "bg-green-100 text-green-800 border-green-200",
      Draft: "bg-orange-100 text-orange-800 border-orange-200",
      Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
      >
        <CheckCircle className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      Easy: "bg-green-100 text-green-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Hard: "bg-red-100 text-red-800",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  const getGradeColor = (grade) => {
    if (grade === "A" || grade === "A+") return "text-green-600 bg-green-50";
    if (grade === "B" || grade === "B+") return "text-blue-600 bg-blue-50";
    if (grade === "C" || grade === "C+") return "text-yellow-600 bg-yellow-50";
    if (grade === "Incomplete") return "text-gray-600 bg-gray-50";
    return "text-red-600 bg-red-50";
  };

  const filteredResults = studentResults.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchStudent.toLowerCase());
    const matchesGrade = filterGrade === "all" || student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#0F7490] text-white shadow-sm"
          : "text-gray-600 hover:text-[#0F7490] hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    {
      label: "Exams",
      href: "/exams",
      icon: FileText,
    },
    { label: "Algebra Midterm", href: "/", icon: FileQuestionIcon, current: true },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Header */}

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-2 flex items-center space-x-3"
                style={{ color: colors.text }}
              >
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <FileText
                    className="w-8 h-8"
                    style={{ color: colors.primary }}
                  />
                </div>
                <span>{examData.title}</span>
                {getStatusBadge(examData.status)}
              </h1>
              <p className="text-gray-600">
                {examData.subject} • Created on {examData.createdDate}
              </p>
            </div>
            <Link href={"/exams/new"} passHref>
              <button
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Plus className="w-5 h-5" />
                <span>Create New Exam</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-[#202938]">
                  {examData.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-2xl font-bold text-[#202938]">
                  {examData.completedStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-[#202938]">
                  {examData.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Pass Rate
                </p>
                <p className="text-2xl font-bold text-[#202938]">
                  {examData.passRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100 w-fit">
            <TabButton
              id="overview"
              label="Overview"
              isActive={activeTab === "overview"}
              onClick={setActiveTab}
            />
            <TabButton
              id="questions"
              label="Questions"
              isActive={activeTab === "questions"}
              onClick={setActiveTab}
            />
            <TabButton
              id="results"
              label="Results"
              isActive={activeTab === "results"}
              onClick={setActiveTab}
            />
            <TabButton
              id="analytics"
              label="Analytics"
              isActive={activeTab === "analytics"}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exam Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#202938] mb-4">
                  Exam Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Exam Date</p>
                        <p className="font-medium text-[#202938]">
                          {examData.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-[#202938]">
                          {examData.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Total Questions</p>
                        <p className="font-medium text-[#202938]">
                          {examData.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Difficulty</p>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(
                            examData.difficulty
                          )}`}
                        >
                          {examData.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Passing Grade</p>
                        <p className="font-medium text-[#202938]">
                          {examData.passingGrade}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Last Modified</p>
                        <p className="font-medium text-[#202938]">
                          {examData.lastModified}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#202938] mb-4">
                  Description
                </h3>
                <p className="text-gray-700 mb-4">{examData.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Instructions
                  </h4>
                  <p className="text-blue-800 text-sm">
                    {examData.instructions}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#202938] mb-4">
                  Score Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Highest Score</span>
                    <span className="font-semibold text-green-600">
                      {examData.highestScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="font-semibold text-[#0F7490]">
                      {examData.averageScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lowest Score</span>
                    <span className="font-semibold text-red-600">
                      {examData.lowestScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-gray-600">Pass Rate</span>
                    <span className="font-semibold text-[#202938]">
                      {examData.passRate}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#202938] mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-[#0F7490]" />
                    <span className="text-[#202938]">Export Results</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <BarChart3 className="w-5 h-5 text-[#C9AE6C]" />
                    <span className="text-[#202938]">View Analytics</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-[#8B5CF6]" />
                    <span className="text-[#202938]">Share Exam</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <InteractiveQuestionsTab />
          // <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          //   <div className="p-6 border-b border-gray-200">
          //     <div className="flex items-center justify-between">
          //       <h3 className="text-lg font-semibold text-[#202938]">
          //         Questions ({questionsData.length})
          //       </h3>
          //       <button className="bg-[#0F7490] text-white px-4 py-2 rounded-lg hover:bg-[#0D6680] transition-colors flex items-center gap-2">
          //         <BookOpen className="w-4 h-4" />
          //         Add Question
          //       </button>
          //     </div>
          //   </div>
          //   <div className="divide-y divide-gray-100">
          //     {questionsData.map((question, index) => (
          //       <div
          //         key={question.id}
          //         className="p-6 hover:bg-gray-50 transition-colors"
          //       >
          //         <div className="flex items-start justify-between mb-4">
          //           <div className="flex-1">
          //             <div className="flex items-center gap-3 mb-2">
          //               <span className="bg-[#0F7490] text-white text-sm font-medium px-2 py-1 rounded">
          //                 Q{index + 1}
          //               </span>
          //               <span
          //                 className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
          //                   question.difficulty
          //                 )}`}
          //               >
          //                 {question.difficulty}
          //               </span>
          //               <span className="text-sm text-gray-600">
          //                 {question.type}
          //               </span>
          //               <span className="text-sm font-medium text-[#202938]">
          //                 {question.points} pts
          //               </span>
          //             </div>
          //             <h4 className="text-[#202938] font-medium mb-3">
          //               {question.question}
          //             </h4>
          //             {question.options && (
          //               <div className="grid grid-cols-2 gap-2 mb-3">
          //                 {question.options.map((option, optIndex) => (
          //                   <div
          //                     key={optIndex}
          //                     className={`p-2 rounded border text-sm ${
          //                       option === question.correctAnswer
          //                         ? "bg-green-50 border-green-200 text-green-800"
          //                         : "bg-gray-50 border-gray-200 text-gray-700"
          //                     }`}
          //                   >
          //                     {String.fromCharCode(65 + optIndex)}. {option}
          //                   </div>
          //                 ))}
          //               </div>
          //             )}
          //             <div className="flex items-center gap-4 text-sm text-gray-600">
          //               <span>
          //                 Correct Rate:{" "}
          //                 <strong className="text-[#0F7490]">
          //                   {question.correctRate}%
          //                 </strong>
          //               </span>
          //               <span>
          //                 Answer:{" "}
          //                 <strong className="text-green-600">
          //                   {question.correctAnswer}
          //                 </strong>
          //               </span>
          //             </div>
          //           </div>
          //           <div className="flex items-center gap-2 ml-4">
          //             <button className="p-2 text-gray-400 hover:text-[#0F7490] hover:bg-gray-100 rounded-lg transition-colors">
          //               <Eye className="w-4 h-4" />
          //             </button>
          //             <button className="p-2 text-gray-400 hover:text-[#C9AE6C] hover:bg-gray-100 rounded-lg transition-colors">
          //               <Edit3 className="w-4 h-4" />
          //             </button>
          //             <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          //               <MoreVertical className="w-4 h-4" />
          //             </button>
          //           </div>
          //         </div>
          //       </div>
          //     ))}
          //   </div>
          // </div>
        )}

        {activeTab === "results" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h3 className="text-lg font-semibold text-[#202938]">
                  Student Results ({studentResults.length})
                </h3>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none"
                    />
                  </div>
                  <select
                    value={filterGrade}
                    onChange={(e) => setFilterGrade(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0F7490] focus:border-transparent outline-none bg-white"
                  >
                    <option value="all">All Grades</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                    <option value="Incomplete">Incomplete</option>
                  </select>
                  <button className="bg-[#C9AE6C] text-white px-4 py-2 rounded-lg hover:bg-[#B59A5C] transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Student
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Score
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Grade
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Completed
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Time Spent
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-[#202938]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResults.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-[#202938]">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-semibold text-[#202938]">
                          {student.score}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(
                            student.grade
                          )}`}
                        >
                          {student.grade}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {student.completedAt || "Not completed"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {student.timeSpent || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {student.status === "Completed" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#0F7490] hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-[#202938] mb-4">
                Performance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">
                        Excellent (90-100%)
                      </p>
                      <p className="text-sm text-green-700">8 students</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-600">25%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">Good (80-89%)</p>
                      <p className="text-sm text-blue-700">12 students</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">38%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-yellow-900">
                        Average (70-79%)
                      </p>
                      <p className="text-sm text-yellow-700">6 students</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">
                    19%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-900">
                        Below Average (70%)
                      </p>
                      <p className="text-sm text-red-700">6 students</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">19%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-[#202938] mb-4">
                Question Analysis
              </h3>
              <div className="space-y-4">
                {questionsData.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#202938]">
                        Question {index + 1}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          question.correctRate >= 80
                            ? "text-green-600"
                            : question.correctRate >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {question.correctRate}% correct
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${
                          question.correctRate >= 80
                            ? "bg-green-500"
                            : question.correctRate >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${question.correctRate}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {question.question}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{question.type}</span>
                      <span>{question.points} points</span>
                      <span
                        className={`px-2 py-1 rounded ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-[#202938] mb-4">
                Time Analysis
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Average Time</p>
                    <p className="text-sm text-blue-700">
                      Time spent by students
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    82 min
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">
                      Fastest Completion
                    </p>
                    <p className="text-sm text-green-700">
                      Shortest time taken
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    65 min
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900">
                      Slowest Completion
                    </p>
                    <p className="text-sm text-orange-700">
                      Longest time taken
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-orange-600">
                    90 min
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-[#202938] mb-4">
                Recommendations
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900 mb-1">
                      Strong Performance
                    </p>
                    <p className="text-sm text-blue-700">
                      85% of students passed the exam. Overall performance is
                      above average.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-900 mb-1">
                      Review Question 3
                    </p>
                    <p className="text-sm text-yellow-700">
                      Only 45% answered correctly. Consider reviewing graphing
                      inequalities topic.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900 mb-1">
                      Well-Designed Exam
                    </p>
                    <p className="text-sm text-green-700">
                      Good balance of difficulty levels and appropriate time
                      allocation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-purple-900 mb-1">
                      Student Support
                    </p>
                    <p className="text-sm text-purple-700">
                      4 students haven't completed yet. Consider sending
                      reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

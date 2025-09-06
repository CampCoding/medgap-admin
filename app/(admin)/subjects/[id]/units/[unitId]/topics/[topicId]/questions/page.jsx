"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Tag,
  Clock,
  User,
  BarChart3,
  Book,
  Currency,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock3,
  MessageSquare,
  Users,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../../../../../components/ui/BreadCrumbs";
import { subjects } from "../../../../../../../../../data/subjects";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../../../../../../../components/atoms/Button";
import Input from "../../../../../../../../../components/atoms/Input";
import Card from "../../../../../../../../../components/atoms/Card";
import Badge from "../../../../../../../../../components/atoms/Badge";
import Select from "../../../../../../../../../components/atoms/Select";
import PagesHeader from "./../../../../../../../../../components/ui/PagesHeader";
import QuestionsSearchAndFilters from "../../../../../../../../../components/Questions/QuestionsSearchAndFilters";
import QuestionCard from "../../../../../../../../../components/ui/Cards/QuestionCard";
import QuestionStats from "../../../../../../../../../components/Questions/QuestionStats";
import { Modal } from "antd";
import MCQPrev from "../../../../../../../../../components/Previews/MCQ.preview";
import classNames from "classnames";
import EssayPrev from "../../../../../../../../../components/Previews/Essay.preview";
import CustomModal from "../../../../../../../../../components/layout/Modal";

const TopicQuestions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedReviewStatus, setSelectedReviewStatus] = useState("");
  const [selectedCreatedBy, setSelectedCreatedBy] = useState("");
  const [selectedReviewedBy, setSelectedReviewedBy] = useState("");
  const [selectedUsageRange, setSelectedUsageRange] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [activeTab, setActiveTab] = useState("questions");
  const { id, unitId, topicId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDetailsModal, setQuestionDetailsModal] = useState(false);
  const [detailsActiveTab, setDetailsActiveTab] = useState("question");

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );
    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  const questions = [
    {
      id: 1,
      question: "What is 2 + 2?",
      type: "MCQ",
      subject: "Math",
      difficulty: "Easy",
      createdAt: "2024-08-01",
      lastModified: "2024-08-01",
      usageCount: 15,
      tags: ["Basic", "Addition"],
      reviewStatus: "accepted",
      reviewedBy: "Dr. Sarah Johnson",
      reviewedAt: "2024-08-02",
      createdBy: "John Admin",
      reviewComments: "Good basic math question, well structured.",
    },
    {
      id: 2,
      question: "The Earth is flat.",
      type: "True/False",
      subject: "Science",
      difficulty: "Easy",
      createdAt: "2024-07-28",
      lastModified: "2024-07-30",
      usageCount: 8,
      tags: ["Geography", "Facts"],
      reviewStatus: "rejected",
      reviewedBy: "Prof. Michael Chen",
      reviewedAt: "2024-07-29",
      createdBy: "Jane Admin",
      reviewComments:
        "Factually incorrect statement. Please revise the question.",
    },
    {
      id: 3,
      question: "Explain the causes of World War II.",
      type: "Essay",
      subject: "History",
      difficulty: "Hard",
      createdAt: "2024-07-25",
      lastModified: "2024-07-26",
      usageCount: 12,
      tags: ["World War", "Analysis"],
      reviewStatus: "pending",
      reviewedBy: null,
      reviewedAt: null,
      createdBy: "Admin User",
      reviewComments: null,
    },
    {
      id: 4,
      question: "Calculate the derivative of x² + 3x - 5",
      type: "MCQ",
      subject: "Math",
      difficulty: "Medium",
      createdAt: "2024-07-22",
      lastModified: "2024-07-23",
      usageCount: 22,
      tags: ["Calculus", "Derivatives"],
      reviewStatus: "accepted",
      reviewedBy: "Dr. Lisa Wang",
      reviewedAt: "2024-07-24",
      createdBy: "Math Admin",
      reviewComments:
        "Excellent calculus question with appropriate difficulty level.",
    },
  ];

  // Sample students data for this topic
  const students = [
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@student.edu",
      enrolledDate: "2024-07-15",
      progress: 85,
      questionsAttempted: 12,
      questionsCorrect: 10,
      averageScore: 83,
      lastActivity: "2024-08-03",
      status: "active",
    },
    {
      id: 2,
      name: "Sara Mohamed",
      email: "sara.mohamed@student.edu",
      enrolledDate: "2024-07-20",
      progress: 92,
      questionsAttempted: 15,
      questionsCorrect: 14,
      averageScore: 93,
      lastActivity: "2024-08-02",
      status: "active",
    },
    {
      id: 3,
      name: "Omar Ali",
      email: "omar.ali@student.edu",
      enrolledDate: "2024-07-25",
      progress: 68,
      questionsAttempted: 8,
      questionsCorrect: 5,
      averageScore: 62,
      lastActivity: "2024-07-30",
      status: "inactive",
    },
    {
      id: 4,
      name: "Fatima Ibrahim",
      email: "fatima.ibrahim@student.edu",
      enrolledDate: "2024-08-01",
      progress: 78,
      questionsAttempted: 10,
      questionsCorrect: 8,
      averageScore: 80,
      lastActivity: "2024-08-03",
      status: "active",
    },
  ];

  // Comprehensive filtering logic
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      // Search term filter (search in question, tags, subject)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          question.id.toString().toLowerCase().includes(searchLower) ||
          question.question.toLowerCase().includes(searchLower) ||
          question.subject.toLowerCase().includes(searchLower) ||
          question.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Subject filter
      if (
        selectedSubject &&
        question.subject.toLowerCase() !== selectedSubject
      ) {
        return false;
      }

      // Type filter
      if (
        selectedType &&
        question.type.toLowerCase().replace("/", "") !== selectedType
      ) {
        return false;
      }

      // Difficulty filter
      if (
        selectedDifficulty &&
        question.difficulty.toLowerCase() !== selectedDifficulty
      ) {
        return false;
      }

      // Review status filter
      if (
        selectedReviewStatus &&
        question.reviewStatus !== selectedReviewStatus
      ) {
        return false;
      }

      // Created by filter
      if (selectedCreatedBy && question.createdBy !== selectedCreatedBy) {
        return false;
      }

      // Reviewed by filter
      if (selectedReviewedBy && question.reviewedBy !== selectedReviewedBy) {
        return false;
      }

      // Usage range filter
      if (selectedUsageRange) {
        const usage = question.usageCount;
        switch (selectedUsageRange) {
          case "0-5":
            if (usage < 0 || usage > 5) return false;
            break;
          case "6-15":
            if (usage < 6 || usage > 15) return false;
            break;
          case "16-25":
            if (usage < 16 || usage > 25) return false;
            break;
          case "25+":
            if (usage <= 25) return false;
            break;
        }
      }

      // Date range filter
      if (dateRange.from || dateRange.to) {
        const questionDate = new Date(question.createdAt);
        if (dateRange.from && questionDate < new Date(dateRange.from)) {
          return false;
        }
        if (dateRange.to && questionDate > new Date(dateRange.to)) {
          return false;
        }
      }

      return true;
    });
  }, [
    questions,
    searchTerm,
    selectedSubject,
    selectedType,
    selectedDifficulty,
    selectedReviewStatus,
    selectedCreatedBy,
    selectedReviewedBy,
    selectedUsageRange,
    dateRange,
  ]);

  const [deleteModal, setDeleteModal] = useState(false);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "Questions", href: "#", current: true },
  ];

  const [prevModal, setPrevModal] = useState(false);

  console.log(
    "selectedSubjectAndUnitWithTopic",
    selectedSubjectAndUnitWithTopic
  );

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFC] p-6">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

          {/* Header */}
          <PagesHeader
            extra={
              <div className="flex  space-x-4">
                <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <BookOpen className="w-5 h-5 text-[#0F7490]" />
                  <span className="text-sm font-medium text-[#202938]">
                    {filteredQuestions.length} / {questions.length} Questions
                  </span>
                </div>

                <Link href={"questions/new"}>
                  <Button
                    type="primary"
                    size="large"
                    className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Question
                  </Button>
                </Link>
              </div>
            }
            title={
              <>
                {selectedSubjectAndUnitWithTopic?.topic?.name} :{" "}
                <span className="text-primary">Question Bank</span>
              </>
            }
            subtitle={"Manage and organize your teaching questions"}
          />

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("questions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "questions"
                    ? "border-[#0F7490] text-[#0F7490]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Questions ({filteredQuestions.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("stats")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "stats"
                    ? "border-[#0F7490] text-[#0F7490]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Statistics</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "questions" && (
            <>
              <QuestionsSearchAndFilters
                {...{
                  searchTerm,
                  setSearchTerm,
                  selectedSubject,
                  setSelectedSubject,
                  selectedType,
                  setSelectedType,
                  selectedDifficulty,
                  setSelectedDifficulty,
                  selectedReviewStatus,
                  setSelectedReviewStatus,
                  selectedCreatedBy,
                  setSelectedCreatedBy,
                  selectedReviewedBy,
                  setSelectedReviewedBy,
                  selectedUsageRange,
                  setSelectedUsageRange,
                  dateRange,
                  setDateRange,
                  questions,
                }}
              />

              {/* Questions Grid */}
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No questions found
                  </h3>
                  <p className="text-gray-500">
                    {questions.length === 0
                      ? "No questions have been created yet."
                      : "Try adjusting your filters to see more results."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredQuestions.map((question) => (
                    <QuestionCard
                      selectedQuestion={selectedQuestion}
                      setSelectedQuestion={setSelectedQuestion}
                      prevModal={prevModal}
                      setPrevModal={setPrevModal}
                      deleteModal={deleteModal}
                      setDeleteModal={setDeleteModal}
                      questionDetailsModal={questionDetailsModal}
                      setQuestionDetailsModal={setQuestionDetailsModal}
                      question={question}
                      key={question.id}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <QuestionStats questions={filteredQuestions} />
            </div>
          )}

          {/* Question preview modal */}
          {selectedQuestion?.type == "MCQ" ? (
            <Modal
              footer={null}
              open={prevModal}
              className="!w-[40%]"
              onCancel={() => setPrevModal(!prevModal)}
            >
              <MCQPrev />
            </Modal>
          ) : (
            <Modal
              footer={null}
              open={prevModal}
              className="!w-[40%]"
              onCancel={() => setPrevModal(!prevModal)}
            >
              <EssayPrev />
            </Modal>
          )}

          <CustomModal
            isOpen={deleteModal}
            onClose={() => setDeleteModal(false)}
            title="Delete Question"
            size="sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-900">Are you sure?</h4>
                  <p className="text-sm text-red-700">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Question to be deleted:
                </p>
                <p className="font-medium text-[#202938]">
                  {selectedQuestion?.question}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => null}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Question
                </button>
              </div>
            </div>
          </CustomModal>

          {/* Question Details Modal with Tabs */}
          <CustomModal
            isOpen={questionDetailsModal}
            onClose={() => {
              setQuestionDetailsModal(false);
              setDetailsActiveTab("question"); // Reset to first tab
            }}
            title={
              <div className="flex items-center justify-between">
                <span>Question Details</span>
                {selectedQuestion && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ID: {selectedQuestion.id}
                  </span>
                )}
              </div>
            }
            size="lg"
          >
            {selectedQuestion && (
              <div className="space-y-4">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setDetailsActiveTab("question")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        detailsActiveTab === "question"
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Question Info</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setDetailsActiveTab("creator")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        detailsActiveTab === "creator"
                          ? "border-green-600 text-green-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Creator</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setDetailsActiveTab("reviewer")}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        detailsActiveTab === "reviewer"
                          ? "border-purple-600 text-purple-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Review</span>
                      </div>
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {/* Question Information Tab */}
                  {detailsActiveTab === "question" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">Question Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-blue-700 block mb-2">Question:</label>
                            <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                              <p className="text-gray-900 leading-relaxed">{selectedQuestion.question}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-blue-700 block mb-2">Type:</label>
                              <Badge color={selectedQuestion.type === "MCQ" ? "blue" : selectedQuestion.type === "True/False" ? "gold" : "purple"}>
                                {selectedQuestion.type}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-blue-700 block mb-2">Difficulty:</label>
                              <Badge color={selectedQuestion.difficulty === "Easy" ? "green" : selectedQuestion.difficulty === "Medium" ? "gold" : "red"}>
                                {selectedQuestion.difficulty}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-blue-700 block mb-2">Subject:</label>
                              <p className="text-gray-900 p-2 bg-white rounded border">{selectedQuestion.subject}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-blue-700 block mb-2">Usage Count:</label>
                              <p className="text-gray-900 p-2 bg-white rounded border">
                                <span className="font-semibold">{selectedQuestion.usageCount}</span> times
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-blue-700 block mb-2">Tags:</label>
                            <div className="flex flex-wrap gap-2">
                              {selectedQuestion.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                >
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Creator Details Tab */}
                  {detailsActiveTab === "creator" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <User className="w-6 h-6 text-green-600 mr-3" />
                          <h3 className="text-lg font-semibold text-green-900">Creator Information</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="text-sm font-medium text-green-700 block mb-2">Created By:</label>
                              <div className="p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                                <p className="text-gray-900 font-semibold">{selectedQuestion.createdBy}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-green-700 block mb-2">Created At:</label>
                              <div className="p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 text-green-600 mr-2" />
                                  <p className="text-gray-900">{selectedQuestion.createdAt}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-green-700 block mb-2">Last Modified:</label>
                            <div className="p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 text-green-600 mr-2" />
                                <p className="text-gray-900">{selectedQuestion.lastModified}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviewer Details Tab */}
                  {detailsActiveTab === "reviewer" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <CheckCircle className="w-6 h-6 text-purple-600 mr-3" />
                          <h3 className="text-lg font-semibold text-purple-900">Review Information</h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-purple-700 block mb-2">Review Status:</label>
                            <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                              <Badge 
                                color={selectedQuestion.reviewStatus === "accepted" ? "green" : selectedQuestion.reviewStatus === "rejected" ? "red" : "yellow"}
                                className="text-base"
                              >
                                {selectedQuestion.reviewStatus === "accepted" && <CheckCircle className="w-4 h-4 mr-2" />}
                                {selectedQuestion.reviewStatus === "rejected" && <XCircle className="w-4 h-4 mr-2" />}
                                {selectedQuestion.reviewStatus === "pending" && <Clock3 className="w-4 h-4 mr-2" />}
                                {selectedQuestion.reviewStatus.charAt(0).toUpperCase() + selectedQuestion.reviewStatus.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          {selectedQuestion.reviewedBy ? (
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <label className="text-sm font-medium text-purple-700 block mb-2">Reviewed By:</label>
                                <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                                  <p className="text-gray-900 font-semibold">{selectedQuestion.reviewedBy}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-purple-700 block mb-2">Reviewed At:</label>
                                <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-purple-600 mr-2" />
                                    <p className="text-gray-900">{selectedQuestion.reviewedAt}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center">
                                <Clock3 className="w-5 h-5 text-yellow-600 mr-2" />
                                <p className="text-yellow-800 font-medium">This question is pending review and has not been assigned to a reviewer yet.</p>
                              </div>
                            </div>
                          )}
                          
                          {selectedQuestion.reviewComments && (
                            <div>
                              <label className="text-sm font-medium text-purple-700 block mb-2">Review Comments:</label>
                              <div className="p-4 bg-white rounded-lg border border-purple-200 shadow-sm">
                                <div className="flex items-start space-x-3">
                                  <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-gray-900 italic leading-relaxed">"{selectedQuestion.reviewComments}"</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setQuestionDetailsModal(false);
                      setDetailsActiveTab("question");
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setPrevModal(true);
                      setQuestionDetailsModal(false);
                      setDetailsActiveTab("question");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Question
                  </button>
                </div>
              </div>
            )}
          </CustomModal>
        </div>
      </div>
    </>
  );
};

export default TopicQuestions;

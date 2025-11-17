"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Eye,
  BarChart3,
  Book,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../../../../../components/ui/BreadCrumbs";
import Link from "next/link";
import Button from "../../../../../../../../../components/atoms/Button";
import PagesHeader from "./../../../../../../../../../components/ui/PagesHeader";
import QuestionsSearchAndFilters from "../../../../../../../../../components/Questions/QuestionsSearchAndFilters";
import QuestionCard from "../../../../../../../../../components/ui/Cards/QuestionCard";
import QuestionStats from "../../../../../../../../../components/Questions/QuestionStats";
import CustomModal from "../../../../../../../../../components/layout/Modal";
import { useDispatch, useSelector } from "react-redux";
import { handleQuestionsTopics } from "../../../../../../../../../features/topicsSlice";
import DeleteQuestionsModal from "../../../../../../../../../components/Questions/DeleteQuestionsModal";
import {
  handleGetAllQuestions,
} from "../../../../../../../../../features/questionsSlice";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import DuplicateQuestionModal from "../../../../../../../../../components/Questions/DuplicateQuestionModal";
import PreviewQuestionModal from "../../../../../../../../../components/Questions/PreviewQuestionModal";

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

  const dispatch = useDispatch();
  const { topic_questions_list } = useSelector((state) => state?.topics);
  const { all_questions, questions_loading } = useSelector(
    (state) => state?.questions
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🔁 Duplicate modal state
  const [dupOpen, setDupOpen] = useState(false);
  const [dupLoading, setDupLoading] = useState(false);
  const [dupTarget, setDupTarget] = useState(null); // raw question from API
  const [dupName, setDupName] = useState(""); // optional: new question text

  // Other modals
  const [deleteModal, setDeleteModal] = useState(false);
  const [prevModal, setPrevModal] = useState(false);

  // Fetch questions with pagination and filters
  const fetchQuestions = (page = 1, filters = {}) => {
    const payload = {
      id: topicId,
      page,
      limit: itemsPerPage,
      ...filters,
    };
    dispatch(handleGetAllQuestions({ topic_id: topicId }));
    dispatch(handleQuestionsTopics(payload));
  };

  useEffect(() => {
    const filters = {
      search: searchTerm,
      type: selectedType,
      difficulty: selectedDifficulty,
      status: selectedReviewStatus,
    };

    setCurrentPage(1);
    fetchQuestions(1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedType, selectedDifficulty, selectedReviewStatus, topicId]);

  // Apply client-side filtering
  const filteredQuestions = useMemo(() => {
    const list = all_questions?.data?.questions || [];
    let qs = list;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      qs = qs.filter(
        (q) =>
          q?.question_id?.toString().toLowerCase().includes(searchLower) ||
          q?.question_text?.toLowerCase().includes(searchLower) ||
          q?.topic_name?.toLowerCase().includes(searchLower) ||
          q?.tags?.some((t) => t.toLowerCase().includes(searchLower)) ||
          q?.keywords?.some((k) => k.toLowerCase().includes(searchLower))
      );
    }

    if (selectedType) {
      qs = qs.filter(
        (q) =>
          (q?.question_type || "").toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedDifficulty) {
      qs = qs.filter(
        (q) =>
          (q?.difficulty_level || "").toLowerCase() ===
          selectedDifficulty.toLowerCase()
      );
    }

    if (selectedReviewStatus) {
      qs = qs.filter(
        (q) =>
          (q?.status || "").toLowerCase() ===
          selectedReviewStatus.toLowerCase()
      );
    }

    if (selectedUsageRange && qs[0]?.usage_count !== undefined) {
      qs = qs.filter((q) => {
        const usage = q?.usage_count || 0;
        switch (selectedUsageRange) {
          case "0-5":
            return usage >= 0 && usage <= 5;
          case "6-15":
            return usage >= 6 && usage <= 15;
          case "16-25":
            return usage >= 16 && usage <= 25;
          case "25+":
            return usage > 25;
          default:
            return true;
        }
      });
    }

    return qs;
  }, [
    all_questions?.data?.questions,
    searchTerm,
    selectedType,
    selectedDifficulty,
    selectedReviewStatus,
    selectedUsageRange,
  ]);

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredQuestions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  // Format question for display (card)
  const formatQuestionForDisplay = (q) => ({
    id: q.question_id,
    question: q.question_text,
    type:
      q.question_type === "multiple_choice"
        ? "MCQ"
        : q.question_type === "essay"
        ? "Essay"
        : "True/False",
    subject: q.topic_name,
    difficulty:
      q.difficulty_level === "easy"
        ? "Easy"
        : q.difficulty_level === "medium"
        ? "Medium"
        : "Hard",
    createdAt: new Date(q.created_at).toLocaleDateString(),
    lastModified: q.updated_at ? new Date(q.updated_at).toLocaleDateString() : "N/A",
    usageCount: q.usage_count || 0,
    tags: q.tags || q.keywords || [],
    reviewStatus:
      q.status === "active"
        ? "accepted"
        : q.status === "inactive"
        ? "rejected"
        : "pending",
    reviewedBy: q.updated_by_name,
    reviewedAt: q.updated_at,
    createdBy: q.created_by_name || "Unknown",
    reviewComments: q.help_guidance || q.hint,
    acceptanceRate: q.acceptance_rate,
    points: q.points,
    originalData: q,
  });

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: topic_questions_list?.data?.topic?.topic_name, href: "#" },
    { label: "Questions", href: "#", current: true },
  ];

  useEffect(() => {
    console.log(topic_questions_list)
  } , [topic_questions_list])

  // Local pagination UI
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredQuestions.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{filteredQuestions.length}</span>{" "}
              results
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>

            <nav className="flex space-x-1" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`relative inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium ${
                    currentPage === p
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // ===== Duplicate handlers =====
  const openDuplicateModal = (rawQuestion) => {
    setDupTarget(rawQuestion);
    const defaultName = (rawQuestion?.question_text || "New question") + " (Copy)";
    setDupName(defaultName);
    setDupOpen(true);
  };

  const closeDuplicateModal = () => {
    setDupOpen(false);
    setDupTarget(null);
    setDupName("");
    setDupLoading(false);
  };



  return (
    <>
      <div className="min-h-screen bg-[#F9FAFC] p-6">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

          {/* Header */}
          <PagesHeader
            extra={
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <BookOpen className="w-5 h-5 text-[#0F7490]" />
                  <span className="text-sm font-medium text-[#202938]">
                    {filteredQuestions.length} Questions
                    {all_questions?.pagination?.total && ` of ${all_questions?.pagination?.total}`}
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
                {topic_questions_list?.data?.topic?.topic_name} :{" "}
                <span className="text-primary">Question Bank</span>
              </>
            }
            subtitle={"Manage and organize your teaching questions"}
          />

          {/* Tabs */}
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

          {/* Content */}
          {activeTab === "questions" ? (
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
                  questions: filteredQuestions,
                }}
              />

              {questions_loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading questions...</p>
                </div>
              )}

              {!all_questions && paginatedQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    {filteredQuestions.length === 0
                      ? "No questions found"
                      : "No questions on this page"}
                  </h3>
                  <p className="text-gray-500">
                    {all_questions?.questions?.length === 0
                      ? "No questions have been created yet."
                      : "Try adjusting your filters or check another page."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedQuestions.map((q) => (
                      <QuestionCard
                      id={id}
                      unitId={unitId}
                      topicId={topicId}
                        key={q.question_id}
                        selectedQuestion={selectedQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                        prevModal={prevModal}
                        setPrevModal={setPrevModal}
                        deleteModal={deleteModal}
                        setDeleteModal={setDeleteModal}
                        questionDetailsModal={questionDetailsModal}
                        setQuestionDetailsModal={setQuestionDetailsModal}
                        question={formatQuestionForDisplay(q)}
                        onDuplicate={() => openDuplicateModal(q)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Pagination />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="space-y-6">
              <QuestionStats questions={filteredQuestions.map(formatQuestionForDisplay)} />
            </div>
          )}

          <PreviewQuestionModal 
          dupLoading={dupLoading}
          prevModal={prevModal}
          setPrevModal={setPrevModal}
          selectedQuestion={selectedQuestion}
          />

          {/* Delete Modal */}
          <DeleteQuestionsModal
          topic_id={topicId}
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            selectedQuestion={selectedQuestion}
          />
        </div>
      </div>

      {/* 🔁 Duplicate Question Modal */}
      <DuplicateQuestionModal
       closeDuplicateModal={closeDuplicateModal}
       dupOpen={dupOpen}
       dupLoading={dupLoading}
       dupTarget={dupTarget}
       topicId={topicId}
       setDupLoading={setDupLoading}
      />
    </>
  );
};

export default TopicQuestions;

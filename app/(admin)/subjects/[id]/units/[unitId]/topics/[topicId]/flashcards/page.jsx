"use client";
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Play,
  Eye,
  BookOpen,
  Download,
  Star,
  Users,
  RotateCcw,
  XCircle,
  CheckCircle,
  Filter,
  Grid,
  List,
  Clock,
  TrendingUp,
  Award,
  X,
  ChevronLeft,
  ChevronRight,
  Book,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { subjects } from "@/data/subjects";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import Link from "next/link";
import PageLayout from "../../../../../../../../../components/layout/PageLayout";
import Button from "../../../../../../../../../components/atoms/Button";
import PagesHeader from "../../../../../../../../../components/ui/PagesHeader";

const FlashCards = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("my-decks");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const flashcardDecks = [
    {
      id: 1,
      title: "USMLE Step 1 - Pathology",
      subtitle: "Comprehensive pathology review for Step 1 exam preparation",
      cards: 567,
      difficulty: "Hard",
      downloads: "12,450",
      author: "MedGap Team",
      rating: 4.8,
      color: "from-orange-400 to-orange-600",
      category: "Medical",
      lastStudied: "2 days ago",
      progress: 68,
      studyTime: "45 min",
    },
    {
      id: 2,
      title: "Clinical Medicine Essentials",
      subtitle: "Key clinical concepts and case-based learning scenarios",
      cards: 423,
      difficulty: "Medium",
      downloads: "8,930",
      author: "Dr. Sarah Chen",
      rating: 4.9,
      color: "from-blue-400 to-blue-600",
      category: "Clinical",
      lastStudied: "1 week ago",
      progress: 34,
      studyTime: "32 min",
    },
    {
      id: 3,
      title: "Microbiology Mastery",
      subtitle: "Bacteria, viruses, and fungi with clinical correlations",
      cards: 298,
      difficulty: "Hard",
      downloads: "6,780",
      author: "MedGap Team",
      rating: 4.7,
      color: "from-purple-400 to-purple-600",
      category: "Science",
      lastStudied: "3 days ago",
      progress: 89,
      studyTime: "28 min",
    },
    {
      id: 4,
      title: "Pharmacology Fundamentals",
      subtitle: "Drug mechanisms and clinical applications",
      cards: 345,
      difficulty: "Medium",
      downloads: "9,230",
      author: "Dr. Michael Torres",
      rating: 4.6,
      color: "from-green-400 to-green-600",
      category: "Pharmacology",
      lastStudied: "5 days ago",
      progress: 12,
      studyTime: "38 min",
    },
    {
      id: 5,
      title: "Anatomy & Physiology",
      subtitle: "Complete body systems overview with detailed illustrations",
      cards: 512,
      difficulty: "Easy",
      downloads: "15,670",
      author: "MedGap Team",
      rating: 4.8,
      color: "from-teal-400 to-teal-600",
      category: "Basic Science",
      lastStudied: "1 day ago",
      progress: 76,
      studyTime: "42 min",
    },
    {
      id: 6,
      title: "Emergency Medicine",
      subtitle: "Critical care and emergency protocols for urgent situations",
      cards: 189,
      difficulty: "Hard",
      downloads: "4,560",
      author: "Dr. Lisa Park",
      rating: 4.9,
      color: "from-red-400 to-red-600",
      category: "Emergency",
      lastStudied: "Never",
      progress: 0,
      studyTime: "0 min",
    },
  ];

  const sampleCards = [
    {
      question: "What is the mechanism of action of ACE inhibitors?",
      answer:
        "ACE inhibitors block the conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion, ultimately lowering blood pressure.",
      category: "Pharmacology",
      difficulty: "Medium",
    },
    {
      question: "What are the classic signs of pneumonia on chest X-ray?",
      answer:
        "Consolidation (air space opacity), air bronchograms, and possible pleural effusion. The pattern may be lobar, bronchopneumonic, or interstitial.",
      category: "Radiology",
      difficulty: "Medium",
    },
    {
      question: "Define myocardial infarction and its ECG changes",
      answer:
        "Death of cardiac muscle due to prolonged ischemia. ECG shows ST elevation (STEMI) or depression/T-wave changes (NSTEMI), and Q waves in chronic cases.",
      category: "Cardiology",
      difficulty: "Hard",
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "#00d77c";
    if (progress >= 50) return "#0793b0";
    return "#075260";
  };

  const filteredDecks = flashcardDecks.filter((deck) => {
    const matchesSearch =
      deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === "all" ||
      deck.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % sampleCards.length);
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentCard(
      (prev) => (prev - 1 + sampleCards.length) % sampleCards.length
    );
    setIsFlipped(false);
  };

  const handleReset = () => setIsFlipped(false);

  const { id, unitId, topicId } = useParams();

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code == id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );

    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  const breadcrumbs = [
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "Flashcard Library", href: "#", current: true },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      {/* Header */}
      <PagesHeader
        title={<>Flashcard Library</>}
        subtitle={"Organize and manage your teaching modules"}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              onClick={() => setNewUnitModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Flashcard
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search decks, categories, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters
                  ? "bg-teal-50 border-teal-200 text-teal-700"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-colors ${
                  viewMode === "grid"
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-colors ${
                  viewMode === "list"
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("my-decks")}
            className={`pb-4 px-1 font-medium transition-colors relative ${
              activeTab === "my-decks"
                ? "text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Decks (3)
            {activeTab === "my-decks" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-4 px-1 font-medium transition-colors relative ${
              activeTab === "library"
                ? "text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            MedGap Library (3)
            {activeTab === "library" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Flashcard Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredDecks.map((deck) => (
            <div
              key={deck.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                viewMode === "list" ? "flex items-center p-6" : ""
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="p-6 relative flex flex-col justify-between h-full">
                    <div className="absolute left-0 top-0 blur-3xl bg-gradient-to-br w-20 h-20 rounded-full bg-(--main-color)"></div>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                        {deck.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {deck.subtitle}
                    </p>

                    {/* Progress Bar */}
                    {/* <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          Progress
                        </span>
                        <span className="text-xs font-medium text-gray-900">
                          {deck.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${deck.progress}%`,
                            backgroundColor: getProgressColor(deck.progress),
                          }}
                        />
                      </div>
                    </div> */}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {deck.cards}
                        </span>
                        <span className="text-gray-500">cards</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {deck.studyTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{deck.downloads}</span>
                      </div>
                      <span
                        className={`inline-block text-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                          deck.difficulty
                        )}`}
                      >
                        {deck.difficulty}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => setShowPreviewModal(true)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button> */}
                      <Link
                        href={`flashcards/${deck?.id}/flash-card-preview`}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                      >
                        <Play className="w-4 h-4" />
                        Preview
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${deck.color} flex items-center justify-center`}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {deck.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {deck.cards} cards • {deck.author}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {deck.progress}%
                      </div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        deck.difficulty
                      )}`}
                    >
                      {deck.difficulty}
                    </span>
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => setShowPreviewModal(true)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button> */}
                      <button
                        onClick={() => setShowPreviewModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-teal-600 hover:to-teal-700 transition-all"
                      >
                        Study
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDecks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No decks found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters, or create a new deck
              to get started.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full min-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Card Preview
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Card {currentCard + 1} of {sampleCards.length}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Card Container */}
            <div className="p-8">
              <div className="perspective-1000 mb-6">
                <div
                  className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  onClick={handleFlip}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl shadow-xl">
                    <div
                      className="w-full h-full rounded-2xl p-8 flex flex-col justify-between text-white relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, #0793b0 0%, #075260 100%)`,
                      }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                      <div>
                        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/20 backdrop-blur-sm">
                          {sampleCards[currentCard].category}
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <h2 className="text-xl font-bold text-center leading-relaxed">
                          {sampleCards[currentCard].question}
                        </h2>
                      </div>

                      <div className="flex justify-center">
                        <div className="text-sm opacity-75 bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Click to reveal answer
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl shadow-xl">
                    <div
                      className="w-full h-full rounded-2xl p-8 flex flex-col justify-between text-white relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, #00d77c 0%, #00b866 100%)`,
                      }}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                      <div>
                        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/20 backdrop-blur-sm">
                          Answer
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-lg text-center leading-relaxed">
                          {sampleCards[currentCard].answer}
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <div className="text-sm opacity-75 bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Click to flip back
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-2">
                  {sampleCards.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentCard
                          ? "w-8 bg-teal-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Answer Feedback */}
              {isFlipped && (
                <div className="flex gap-3 animate-fade-in">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 shadow-md bg-red-500 hover:bg-red-600"
                    onClick={handleNext}
                  >
                    <XCircle size={18} />
                    Incorrect
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 shadow-md bg-green-500 hover:bg-green-600"
                    onClick={handleNext}
                  >
                    <CheckCircle size={18} />
                    Correct
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageLayout>
  );
};

export default FlashCards;

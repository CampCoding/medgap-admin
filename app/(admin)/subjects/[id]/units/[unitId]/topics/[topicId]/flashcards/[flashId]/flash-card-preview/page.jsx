"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  X,
  XCircle,
  Clock,
  Trophy,
  Target,
  BookOpen,
  Play,
  Pause,
  SkipForward,
  Volume2,
} from "lucide-react";

export default function PreviewFlashCard({ onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [studyMode, setStudyMode] = useState("manual"); // manual, auto, quiz
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    startTime: Date.now(),
  });
  const [showStats, setShowStats] = useState(false);
  const [cardHistory, setCardHistory] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const sampleCards = [
    {
      id: 1,
      question: "What is the mechanism of action of ACE inhibitors?",
      answer:
        "ACE inhibitors block the conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion, ultimately lowering blood pressure.",
      category: "Pharmacology",
      difficulty: "Medium",
      tags: ["Cardiovascular", "Hypertension", "Drug Mechanism"],
    },
    {
      id: 2,
      question: "What are the classic signs of pneumonia on chest X-ray?",
      answer:
        "Consolidation (air space opacity), air bronchograms, and possible pleural effusion. The pattern may be lobar, bronchopneumonic, or interstitial.",
      category: "Radiology",
      difficulty: "Medium",
      tags: ["Pulmonology", "Imaging", "Diagnosis"],
    },
    {
      id: 3,
      question: "Define myocardial infarction and its ECG changes",
      answer:
        "Death of cardiac muscle due to prolonged ischemia. ECG shows ST elevation (STEMI) or depression/T-wave changes (NSTEMI), and Q waves in chronic cases.",
      category: "Cardiology",
      difficulty: "Hard",
      tags: ["Emergency", "ECG", "Heart Disease"],
    },
    {
      id: 4,
      question:
        "What are the layers of the epidermis from superficial to deep?",
      answer:
        "Stratum corneum, stratum lucidum (thick skin only), stratum granulosum, stratum spinosum, and stratum basale.",
      category: "Anatomy",
      difficulty: "Easy",
      tags: ["Dermatology", "Histology", "Skin"],
    },
    {
      id: 5,
      question: "Explain the mechanism of action of warfarin",
      answer:
        "Warfarin inhibits vitamin K epoxide reductase, preventing regeneration of vitamin K, which is essential for synthesis of clotting factors II, VII, IX, and X.",
      category: "Pharmacology",
      difficulty: "Hard",
      tags: ["Anticoagulation", "Blood", "Drug Mechanism"],
    },
  ];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      // Add to history when viewing answer
      setCardHistory((prev) => [
        ...prev,
        {
          cardId: sampleCards[currentCard].id,
          timestamp: Date.now(),
          timeToFlip: Date.now() - studyStats.startTime,
        },
      ]);
    }
  };

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

  const handleAnswerFeedback = (isCorrect) => {
    setStudyStats((prev) => ({
      ...prev,
      [isCorrect ? "correct" : "incorrect"]:
        prev[isCorrect ? "correct" : "incorrect"] + 1,
    }));

    // Auto advance to next card
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
      setIsAutoPlaying(false);
    } else {
      const interval = setInterval(() => {
        if (isFlipped) {
          handleNext();
        } else {
          setIsFlipped(true);
        }
      }, 3000);
      setAutoPlayInterval(interval);
      setIsAutoPlaying(true);
    }
  };

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

  const getStudyTime = () => {
    const minutes = Math.floor((Date.now() - studyStats.startTime) / 60000);
    return minutes < 1 ? "<1 min" : `${minutes} min`;
  };

  const getAccuracy = () => {
    const total = studyStats.correct + studyStats.incorrect;
    return total === 0 ? 0 : Math.round((studyStats.correct / total) * 100);
  };

  useEffect(() => {
    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, [autoPlayInterval]);

  const currentCardData = sampleCards[currentCard];

  return (
    <div className="backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in">
      <div className="rounded-3xl max-w-7xl w-full min-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                  Card Preview
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span>
                    Card {currentCard + 1} of {sampleCards.length}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                      currentCardData.difficulty
                    )}`}
                  >
                    {currentCardData.difficulty}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span>{currentCardData.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Study Stats Toggle */}
              <button
                onClick={() => setShowStats(!showStats)}
                className={`p-2 rounded-xl transition-all ${
                  showStats
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Trophy className="w-5 h-5" />
              </button>

              {/* Auto Play Toggle */}
              <button
                onClick={toggleAutoPlay}
                className={`p-2 rounded-xl transition-all ${
                  isAutoPlaying
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isAutoPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="px-6 pb-4 animate-slide-down">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-teal-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Study Time</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {getStudyTime()}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Correct</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {studyStats.correct}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Incorrect</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {studyStats.incorrect}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-sm font-medium">Accuracy</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {getAccuracy()}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Container */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {currentCardData.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="perspective-1000 mb-8">
            <div
              className={`relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              onClick={handleFlip}
            >
              {/* Front Side - Enhanced */}
              <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl shadow-2xl">
                <div
                  className="w-full h-full rounded-3xl p-8 flex flex-col justify-between !text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #0793b0 0%, #075260 100%)`,
                  }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12" />

                  <div>
                    <div className="inline-flex items-center text-white gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/20 backdrop-blur-sm">
                      <BookOpen className="w-4 h-4" />
                      {currentCardData.category}
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center px-4">
                    <h2 className="text-2xl font-bold text-center leading-relaxed max-w-2xl">
                      {currentCardData.question}
                    </h2>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm opacity-75 bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 text-white">
                      <RotateCcw className="w-4 h-4" />
                      Click to reveal answer
                    </div>
                    {isAutoPlaying && (
                      <div className="text-sm opacity-75 bg-white/10 px-3 py-2 rounded-full">
                        Auto-playing
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Back Side - Enhanced */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-2xl">
                <div
                  className="w-full h-full rounded-3xl p-8 flex flex-col justify-between !text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, #00d77c 0%, #00b866 100%)`,
                  }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12" />

                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-white/20 text-white backdrop-blur-sm">
                      <CheckCircle className="w-4 h-4" />
                      Answer
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center px-4">
                    <p className="text-xl text-center leading-relaxed max-w-2xl">
                      {currentCardData.answer}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="text-sm opacity-75 bg-white/10 text-white px-4 py-2 rounded-full flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Click to flip back
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handlePrevious}
              disabled={currentCard === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 rounded-2xl font-medium transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            {/* Enhanced Progress Dots */}
            <div className="flex gap-3">
              {sampleCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentCard(index);
                    setIsFlipped(false);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentCard
                      ? "w-12 h-3 bg-teal-500"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentCard === sampleCards.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed !text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Answer Feedback */}
          {isFlipped && (
            <div className="flex gap-4 animate-fade-in">
              <button
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold !text-white transition-all duration-200 hover:scale-105 shadow-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                onClick={() => handleAnswerFeedback(false)}
              >
                <XCircle size={20} />
                <span>Incorrect</span>
                <div className="text-sm opacity-75 text-white">
                  Need more review
                </div>
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-semibold !text-white transition-all duration-200 hover:scale-105 shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                onClick={() => handleAnswerFeedback(true)}
              >
                <CheckCircle size={20} />
                <span>Correct</span>
                <div className="text-sm opacity-75 text-white">Well done!</div>
              </button>
            </div>
          )}
        </div>

        {/* Study Mode Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Study Mode:</span>
              <div className="flex bg-white rounded-xl p-1 border">
                <button
                  onClick={() => setStudyMode("manual")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    studyMode === "manual"
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Manual
                </button>
                <button
                  onClick={() => setStudyMode("auto")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    studyMode === "auto"
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => setStudyMode("quiz")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    studyMode === "quiz"
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Quiz
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Session: {getStudyTime()}</span>
            </div>
          </div>
        </div>
      </div>

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

        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fadeInUp 0.4s ease-out;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

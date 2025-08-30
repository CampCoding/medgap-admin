"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Flag,
  CheckCircle,
  Circle,
  AlertTriangle,
  Send,
} from "lucide-react";
import Link from "next/link";

const QuestionPreview = ({ params }) => {
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [showHelpText, setShowHelpText] = useState(false);
  const [highlightedKeyword, setHighlightedKeyword] = useState(null);

  // Mock exam questions
  const examQuestions = [
    {
      id: 1,
      question: "What is the medical term for high blood pressure?",
      type: "MCQ",
      options: ["Hypertension", "Hypotension", "Tachycardia", "Bradycardia"],
      correctAnswer: 0,
      explanation: "Hypertension is the medical term for high blood pressure.",
      difficulty: "Easy",
      hint: "Think about the prefix 'hyper-' which means above or excessive.",
      keywords: ["blood pressure", "high", "hypertension", "cardiovascular"],
      help_text:
        "Blood pressure is the force of blood against artery walls. High blood pressure is a common cardiovascular condition.",
    },
    {
      id: 2,
      question: "The prefix 'hypo-' means:",
      type: "MCQ",
      options: ["Above", "Below", "Around", "Through"],
      correctAnswer: 1,
      explanation: "The prefix 'hypo-' means below or deficient.",
      difficulty: "Easy",
      hint: "Compare with 'hyper-' which means above. 'Hypo-' is the opposite.",
      keywords: ["prefix", "hypo", "below", "deficient"],
      help_text:
        "Medical prefixes help understand the meaning of terms. 'Hypo-' indicates something is below normal or deficient.",
    },
    {
      id: 3,
      question: "The suffix '-itis' indicates inflammation.",
      type: "TF",
      correctAnswer: true,
      explanation:
        "The suffix '-itis' always indicates inflammation of an organ or tissue.",
      difficulty: "Easy",
      hint: "Think of common conditions like arthritis, bronchitis, or appendicitis.",
      keywords: ["suffix", "itis", "inflammation", "medical terminology"],
      help_text:
        "The suffix '-itis' is one of the most common medical suffixes, always indicating inflammation.",
    },
    {
      id: 4,
      question: "What is the medical term for heart attack?",
      type: "MCQ",
      options: [
        "Myocardial Infarction",
        "Cardiac Arrest",
        "Angina Pectoris",
        "Heart Failure",
      ],
      correctAnswer: 0,
      explanation:
        "Myocardial infarction is the medical term for heart attack.",
      difficulty: "Medium",
      hint: "Break down the term: 'myo-' (muscle), 'cardial' (heart), 'infarction' (tissue death).",
      keywords: [
        "heart attack",
        "myocardial infarction",
        "cardiac",
        "infarction",
        "medical term",
      ],
      help_text:
        "Myocardial infarction occurs when blood flow to the heart muscle is blocked, causing tissue death.",
    },
    {
      id: 5,
      question: "Describe the proper technique for measuring blood pressure.",
      type: "Essay",
      explanation:
        "Blood pressure should be measured with the patient seated, arm at heart level, using an appropriately sized cuff.",
      difficulty: "Medium",
      hint: "Consider patient position, cuff placement, and measurement conditions.",
      keywords: [
        "blood pressure",
        "measurement",
        "technique",
        "sphygmomanometer",
        "proper",
        "describe",
      ],
      help_text:
        "Proper blood pressure measurement requires correct patient positioning, appropriate cuff size, and standardized conditions.",
    },
    {
      id: 6,
      question: "The heart has four chambers: two atria and two ventricles.",
      type: "TF",
      correctAnswer: true,
      explanation:
        "The heart has four chambers: right atrium, left atrium, right ventricle, and left ventricle.",
      difficulty: "Easy",
      hint: "Visualize the heart structure: two upper chambers (atria) and two lower chambers (ventricles).",
      keywords: ["heart", "chambers", "atria", "ventricles", "anatomy", "four"],
      help_text:
        "The heart's four-chamber structure allows for efficient blood circulation through the pulmonary and systemic circuits.",
    },
    {
      id: 7,
      question: "Which chamber receives oxygenated blood from the lungs?",
      type: "MCQ",
      options: [
        "Right Atrium",
        "Left Atrium",
        "Right Ventricle",
        "Left Ventricle",
      ],
      correctAnswer: 1,
      explanation:
        "The left atrium receives oxygenated blood from the lungs via the pulmonary veins.",
      difficulty: "Medium",
      hint: "Follow the blood flow: lungs → pulmonary veins → left atrium.",
      keywords: [
        "oxygenated blood",
        "left atrium",
        "pulmonary veins",
        "blood flow",
        "chamber",
        "receives",
        "lungs",
      ],
      help_text:
        "Oxygenated blood from the lungs travels through pulmonary veins to the left atrium, then to the left ventricle.",
    },
    {
      id: 8,
      question: "During systole, the ventricles:",
      type: "MCQ",
      options: [
        "Relax and fill",
        "Contract and eject blood",
        "Receive blood from atria",
        "Close all valves",
      ],
      correctAnswer: 1,
      explanation:
        "During systole, the ventricles contract and eject blood into the arteries.",
      difficulty: "Hard",
      hint: "Systole is the contraction phase of the cardiac cycle.",
      keywords: [
        "systole",
        "ventricles",
        "contraction",
        "cardiac cycle",
        "during",
      ],
      help_text:
        "Systole is the contraction phase when ventricles pump blood into arteries. Diastole is the relaxation phase.",
    },
    {
      id: 9,
      question: "The cardiac cycle consists of systole and diastole.",
      type: "TF",
      correctAnswer: true,
      explanation:
        "The cardiac cycle consists of systole (contraction) and diastole (relaxation).",
      difficulty: "Medium",
      hint: "The cardiac cycle has two main phases: contraction and relaxation.",
      keywords: [
        "cardiac cycle",
        "systole",
        "diastole",
        "heart function",
        "consists",
      ],
      help_text:
        "The cardiac cycle is the complete sequence of events in one heartbeat, including systole and diastole phases.",
    },
    {
      id: 10,
      question: "Explain the importance of vital signs in patient assessment.",
      type: "Essay",
      explanation:
        "Vital signs provide essential information about a patient's basic body functions and help identify potential health issues.",
      difficulty: "Medium",
      hint: "Consider what vital signs measure and how they reflect overall health status.",
      keywords: [
        "vital signs",
        "patient assessment",
        "health monitoring",
        "clinical evaluation",
        "importance",
        "explain",
      ],
      help_text:
        "Vital signs (temperature, pulse, respiration, blood pressure) are fundamental indicators of patient health and stability.",
    },
  ];

  useEffect(() => {
    // Simulate fetching exam data
    setTimeout(() => {
      setExamData({
        id: 1,
        title: "Medical Terminology Final Exam",
        duration: "60 minutes",
        totalQuestions: examQuestions.length,
        passingScore: 70,
      });
      setLoading(false);
    }, 1000);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      // Reset help features for new question
      setShowHint(false);
      setShowKeywords(false);
      setShowHelpText(false);
      setHighlightedKeyword(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      // Reset help features for new question
      setShowHint(false);
      setShowKeywords(false);
      setShowHelpText(false);
      setHighlightedKeyword(null);
    }
  };

  const handleShowHint = () => {
    setShowHint(!showHint);
  };

  const handleShowKeywords = () => {
    setShowKeywords(!showKeywords);
    if (showKeywords) {
      setHighlightedKeyword(null); // Clear highlighting when closing keywords
    }
  };

  const handleKeywordClick = (keyword) => {
    setHighlightedKeyword(highlightedKeyword === keyword ? null : keyword);
  };

  const handleShowHelpText = () => {
    setShowHelpText(!showHelpText);
  };

  const handleSubmitExam = () => {
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = () => {
    // Calculate score
    let correctAnswers = 0;
    examQuestions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined) {
        if (question.type === "MCQ" && userAnswer === question.correctAnswer) {
          correctAnswers++;
        } else if (
          question.type === "TF" &&
          userAnswer === question.correctAnswer
        ) {
          correctAnswers++;
        } else if (
          question.type === "Essay" &&
          userAnswer &&
          userAnswer.trim() !== ""
        ) {
          correctAnswers++; // Essay questions get credit if answered
        }
      }
    });

    const score = Math.round((correctAnswers / examQuestions.length) * 100);
    const passed = score >= examData.passingScore;

    // Navigate to results page
    window.location.href = `/subjects/${
      params.id
    }/enrolled/exam/${1}/results?score=${score}&passed=${passed}`;
  };

  const getQuestionStatus = (index) => {
    const question = examQuestions[index];
    const hasAnswer = answers[question.id] !== undefined;
    const isFlagged = flaggedQuestions.has(question.id);

    if (hasAnswer && isFlagged) return "answered-flagged";
    if (hasAnswer) return "answered";
    if (isFlagged) return "flagged";
    return "unanswered";
  };

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start?
            </h2>
            <p className="text-gray-600 mb-6">
              You're about to begin the {examData.title}. Make sure you're ready
              and have a stable internet connection.
            </p>
            <button
              onClick={handleStartExam}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Timer */}

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 p-4">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currentQuestion.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : currentQuestion.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    currentQuestion.type === "MCQ"
                      ? "bg-blue-100 text-blue-700"
                      : currentQuestion.type === "TF"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {currentQuestion.type}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShowHint}
                  className={`p-2 rounded-lg transition-colors ${
                    showHint
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="Show Hint"
                >
                  💡
                </button>
                <button
                  onClick={handleShowKeywords}
                  className={`p-2 rounded-lg transition-colors ${
                    showKeywords
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="Show Keywords"
                >
                  🔑
                </button>
                <button
                  onClick={handleShowHelpText}
                  className={`p-2 rounded-lg transition-colors ${
                    showHelpText
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  title="Show Help"
                >
                  ❓
                </button>
                <button
                  onClick={() => handleFlagQuestion(currentQuestion.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    flaggedQuestions.has(currentQuestion.id)
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Help Features */}
            {(showHint || showKeywords || showHelpText) && (
              <div className="mb-4 space-y-3">
                {showHint && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <span className="text-blue-700 font-bold text-sm">
                        Hint
                      </span>
                    </div>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {currentQuestion.hint}
                    </p>
                  </div>
                )}

                {showHelpText && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-3 shadow-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">❓</span>
                      </div>
                      <span className="text-purple-700 font-bold text-sm">
                        Help
                      </span>
                    </div>
                    <p className="text-purple-800 text-sm leading-relaxed">
                      {currentQuestion.help_text}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Question Text */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 leading-relaxed">
                {(() => {
                  const questionText = currentQuestion.question;
                  let highlightedText = questionText;

                  // Apply keyword highlighting when keywords panel is open
                  if (showKeywords) {
                    currentQuestion.keywords.forEach((keyword) => {
                      const regex = new RegExp(
                        `\\b${keyword.replace(
                          /[.*+?^${}()|[\]\\]/g,
                          "\\$&"
                        )}\\b`,
                        "gi"
                      );
                      highlightedText = highlightedText.replace(
                        regex,
                        (match) => {
                          const isHighlighted =
                            highlightedKeyword &&
                            keyword
                              .toLowerCase()
                              .includes(highlightedKeyword.toLowerCase());
                          return `<span class="px-1 rounded font-medium transition-colors ${
                            isHighlighted
                              ? "bg-blue-300 text-blue-900 border-2 border-blue-500"
                              : "bg-yellow-200"
                          }">${match}</span>`;
                        }
                      );
                    });
                  }

                  // Split by HTML tags to preserve highlighting
                  const parts = highlightedText.split(
                    /(<span[^>]*>.*?<\/span>)/
                  );

                  return parts.map((part, index) => {
                    if (part.startsWith("<span")) {
                      // This is a highlighted keyword - render as HTML
                      return (
                        <span
                          key={index}
                          dangerouslySetInnerHTML={{ __html: part }}
                        />
                      );
                    } else {
                      // This is regular text - split into words
                      return part.split(" ").map((word, wordIndex) => (
                        <span key={`${index}-${wordIndex}`}>
                          {word}
                          {wordIndex < part.split(" ").length - 1 ? " " : ""}
                        </span>
                      ));
                    }
                  });
                })()}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
              {currentQuestion.type === "MCQ" && (
                <div className="space-y-2">
                  {currentQuestion?.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-3 p-4  rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102 text-primary border border-[#0F7490] bg-white  shadow-md `}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index}
                        checked={answers[currentQuestion.id] === index}
                        onChange={(e) =>
                          handleAnswerChange(
                            currentQuestion.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-4 h-4 text-[#0F7490] bg-white focus:ring-[#0F7490]"
                       
                      />
                      <span
                        className={`font-medium text-sm text-black`}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === "TF" && (
                <div className="space-y-2">
                  {["True", "False"].map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                        answers[currentQuestion.id] === (index === 0)
                          ? "!border-[#0F7490] !bg-[#0F7490] !text-white !shadow-md"
                          : "!border-gray-200 !hover:border-[#0F7490] !hover:bg-[#0F7490]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={index === 0}
                        style={{
                          accentColor:
                            answers[currentQuestion.id] === (index === 0)
                              ? "white"
                              : "green",
                        }}
                        checked={answers[currentQuestion.id] === (index === 0)}
                        onChange={(e) =>
                          handleAnswerChange(
                            currentQuestion.id,
                            e.target.value === "true"
                          )
                        }
                        className="w-4 h-4 text-[#0F7490] focus:ring-[#0F7490]"
                      />
                      <span
                        className={`font-medium text-sm ${
                          answers[currentQuestion.id] === (index === 0)
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === "Essay" && (
                <div>
                  <textarea
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(currentQuestion.id, e.target.value)
                    }
                    placeholder="Type your answer here..."
                    className="w-full h-24 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none text-sm leading-relaxed transition-all duration-300 hover:border-blue-300"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Submit Exam?
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Are you sure you want to submit your exam? You cannot change
                your answers after submission.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="flex-1 px-6 py-3 bg-[#0F7490] text-white rounded-xl hover:bg-[#0D6B7D] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPreview;

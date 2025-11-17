"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Book,
  Settings,
  Calendar,
  Clock,
  HelpCircle,
  Save,
  Lightbulb,
  Rocket,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  BarChart3,
  Home,
  Badge,
  Smile,
  X,
} from "lucide-react";
// import BreadcrumbsShowcase from "../../../../components/ui/BreadCrumbs";
import { Dropdown } from "antd";
import Configuration from "../../../../components/ExamConfig/Configuration";
import QuestionModal from "../../../../components/Questions/CustomQuestion.modal";

const NewExamClient = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    difficulty: "",
    date: "",
    duration: "",
    status: "draft",
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [formProgress, setFormProgress] = useState(0);
  const [showCustomQuestionModal, setShowCustomQuestionModal] = useState(false);
  const [questionBankStep, setQuestionBankStep] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [showSelectedQuestions, setShowSelectedQuestions] = useState(false);

  const subjects = [
    { key: "mathematics", value: "mathematics", label: "Mathematics" },
    { key: "physics", value: "physics", label: "Physics" },
    { key: "biology", value: "biology", label: "Biology" },
    { key: "chemistry", value: "chemistry", label: "Chemistry" },
    { key: "english", value: "english", label: "English" },
  ];

  // Mock data for units based on subjects
  const unitsBySubject = {
    mathematics: [
      { id: "math-1", name: "Algebra", questionsCount: 45 },
      { id: "math-2", name: "Geometry", questionsCount: 38 },
      { id: "math-3", name: "Calculus", questionsCount: 52 },
      { id: "math-4", name: "Statistics", questionsCount: 29 },
    ],
    physics: [
      { id: "phy-1", name: "Classical Mechanics", questionsCount: 41 },
      { id: "phy-2", name: "Thermodynamics", questionsCount: 33 },
      { id: "phy-3", name: "Electromagnetism", questionsCount: 47 },
      { id: "phy-4", name: "Quantum Physics", questionsCount: 25 },
    ],
    biology: [
      { id: "bio-1", name: "Cell Biology", questionsCount: 36 },
      { id: "bio-2", name: "Genetics", questionsCount: 42 },
      { id: "bio-3", name: "Ecology", questionsCount: 31 },
      { id: "bio-4", name: "Evolution", questionsCount: 28 },
    ],
    chemistry: [
      { id: "chem-1", name: "Organic Chemistry", questionsCount: 39 },
      { id: "chem-2", name: "Inorganic Chemistry", questionsCount: 44 },
      { id: "chem-3", name: "Physical Chemistry", questionsCount: 32 },
    ],
    english: [
      { id: "eng-1", name: "Grammar", questionsCount: 35 },
      { id: "eng-2", name: "Literature", questionsCount: 48 },
      { id: "eng-3", name: "Writing", questionsCount: 26 },
    ],
  };

  // Mock data for topics based on units
  const topicsByUnit = {
    "math-1": [
      { id: "alg-1", name: "Linear Equations", questionsCount: 15 },
      { id: "alg-2", name: "Quadratic Functions", questionsCount: 12 },
      { id: "alg-3", name: "Polynomials", questionsCount: 18 },
    ],
    "math-2": [
      { id: "geo-1", name: "Triangles", questionsCount: 14 },
      { id: "geo-2", name: "Circles", questionsCount: 11 },
      { id: "geo-3", name: "Coordinate Geometry", questionsCount: 13 },
    ],
    "phy-1": [
      { id: "mech-1", name: "Newton's Laws", questionsCount: 16 },
      { id: "mech-2", name: "Energy & Work", questionsCount: 13 },
      { id: "mech-3", name: "Momentum", questionsCount: 12 },
    ],
    "bio-1": [
      { id: "cell-1", name: "Cell Structure", questionsCount: 12 },
      { id: "cell-2", name: "Cell Division", questionsCount: 10 },
      { id: "cell-3", name: "Cellular Respiration", questionsCount: 14 },
    ],
  };

  // Mock data for questions based on topics
  const questionsByTopic = {
    "alg-1": [
      {
        id: "q1",
        text: "Solve for x: 2x + 5 = 13",
        difficulty: "easy",
        type: "multiple-choice",
      },
      {
        id: "q2",
        text: "Find the slope of the line passing through (2,3) and (4,7)",
        difficulty: "medium",
        type: "True/False",
      },
      {
        id: "q3",
        text: "Solve the system: x + y = 5, 2x - y = 1",
        difficulty: "medium",
        type: "multiple-choice",
      },
      {
        id: "q4",
        text: "Graph the inequality: y ≤ 2x + 3",
        difficulty: "hard",
        type: "graphing",
      },
    ],
    "alg-2": [
      {
        id: "q5",
        text: "Find the vertex of y = x² - 4x + 3",
        difficulty: "medium",
        type: "multiple-choice",
      },
      {
        id: "q6",
        text: "Solve: x² - 5x + 6 = 0",
        difficulty: "easy",
        type: "short-answer",
      },
      {
        id: "q7",
        text: "Determine the discriminant of 2x² + 3x - 1 = 0",
        difficulty: "hard",
        type: "calculation",
      },
    ],
    "mech-1": [
      {
        id: "q8",
        text: "A 5kg object accelerates at 2m/s². What is the net force?",
        difficulty: "easy",
        type: "calculation",
      },
      {
        id: "q9",
        text: "Explain Newton's Third Law with an example",
        difficulty: "medium",
        type: "essay",
      },
      {
        id: "q10",
        text: "Calculate the friction force on a 10kg block on a surface with μ = 0.3",
        difficulty: "hard",
        type: "calculation",
      },
    ],
    "cell-1": [
      {
        id: "q11",
        text: "What is the function of mitochondria?",
        difficulty: "easy",
        type: "multiple-choice",
      },
      {
        id: "q12",
        text: "Describe the structure of the cell membrane",
        difficulty: "medium",
        type: "essay",
      },
      {
        id: "q13",
        text: "Compare prokaryotic and eukaryotic cells",
        difficulty: "hard",
        type: "essay",
      },
    ],
  };

  const questionBankSteps = [
    { title: "Subject", icon: Book, description: "Choose subject" },
    { title: "Units", icon: Settings, description: "Select units" },
    { title: "Topics", icon: Book, description: "Pick topics" },
    { title: "Questions", icon: HelpCircle, description: "Select questions" },
    { title: "Review", icon: HelpCircle, description: "Review questions" },
  ];

  const difficulties = [
    { value: "easy", label: "Easy", color: "bg-green-500", icon: <Smile /> },
    { value: "medium", label: "Medium", color: "bg-yellow-500", icon: "🤔" },
    { value: "hard", label: "Hard", color: "bg-red-500", icon: "😤" },
    { value: "expert", label: "Expert", color: "bg-purple-500", icon: "🔥" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft", color: "bg-gray-400" },
    { value: "published", label: "Published", color: "bg-green-500" },
    { value: "scheduled", label: "Scheduled", color: "bg-blue-500" },
  ];

  const steps = [
    {
      title: "Basic Info",
      icon: FileText,
      description: "Exam details",
    },
    {
      title: "Configuration",
      icon: Settings,
      description: "Settings & timing",
    },
    {
      title: "Questions",
      icon: HelpCircle,
      description: "Select questions",
    },
  ];

  useEffect(() => {
    const filledFields = Object.values(formData).filter(
      (value) => value && value !== ""
    ).length;
    const totalFields = Object.keys(formData).length;
    const progress = Math.round((filledFields / totalFields) * 100);
    setFormProgress(progress);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const requiredFields = [
      "title",
      "subject",
      "difficulty",
      "date",
      "duration",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    alert("Exam saved successfully!");
    console.log("Form values:", formData);
  };

  const handleQuestionBank = () => {
    setQuestionBankStep(0);
    setSelectedSubject("");
    setSelectedUnit("");
    setSelectedTopic("");
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestions((prev) => {
      const isSelected = prev.some((q) => q.id === question.id);
      if (isSelected) {
        return prev.filter((q) => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "multiple-choice":
        return "🔘";
      case "short-answer":
        return "✏️";
      case "essay":
        return "📝";
      case "calculation":
        return "🔢";
      case "graphing":
        return "📊";
      default:
        return "❓";
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Exams", href: "/exams", icon: Book },
    { label: "Create New Exam", href: "/exams/new", icon: Plus, current: true },
  ];
  const items = [
    {
      key: "1",
      label: "Item 1",
    },
    {
      key: "2",
      label: "Item 2",
    },
    {
      key: "3",
      label: "Item 3",
    },
  ];

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F9FAFC" }}>
      <div className="max-w-7xl mx-auto">
        {/* <BreadcrumbsShowcase items={breadcrumbs} variant="pill" /> */}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: "#202938" }}
              >
                Create New Exam
              </h1>
              <p className="text-lg opacity-70" style={{ color: "#202938" }}>
                Design and configure your examination
              </p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm text-gray-600">Form Progress</span>
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500  bg-primary"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <div className="text-sm text-cyan-600 font-medium mt-1">
                {formProgress}% Complete
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-cyan-600 text-white shadow-lg scale-110"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-cyan-600"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-24 h-0.5 mx-4 mt-6 transition-all duration-300 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full opacity-5 -translate-y-20 translate-x-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500 to-cyan-600 rounded-full opacity-5 translate-y-16 -translate-x-16"></div>

              <div className="relative z-10 p-10">
                {/* Step 1: Basic Information */}
                {currentStep === 0 && (
                  <div>
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-xl mr-4 bg-cyan-600">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h2
                          className="text-2xl font-bold"
                          style={{ color: "#202938" }}
                        >
                          Basic Information
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label
                          className="block text-base font-semibold mb-2"
                          style={{ color: "#202938" }}
                        >
                          Exam Title
                        </label>
                        <div className="relative">
                          <Lightbulb className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
                          <input
                            type="text"
                            placeholder="e.g. Algebra Midterm"
                            value={formData.title}
                            onChange={(e) =>
                              handleInputChange("title", e.target.value)
                            }
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-cyan-600 border-opacity-30 focus:border-opacity-100 focus:outline-none transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-base font-semibold mb-2"
                          style={{ color: "#202938" }}
                        >
                          Subject
                        </label>
                        <Dropdown
                          menu={{
                            items: subjects,
                            onClick: ({ key }) => {
                              handleInputChange("subject", key);
                              console.log("key", key);
                            },
                            activeKey: formData.subject,
                          }}
                          dropdownProps={{
                            placement: "bottomLeft",
                            trigger: "click",
                            selectable: true,
                            defaultSelectedKeys: ["3"],
                          }}
                        >
                          <div className="relative">
                            <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
                            <input
                              readOnly
                              placeholder="Select Subject"
                              value={formData.subject}
                              onChange={(e) =>
                                handleInputChange("subject", e.target.value)
                              }
                              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-cyan-600 border-opacity-30 focus:border-opacity-100 focus:outline-none transition-all duration-200 appearance-none bg-white"
                            />
                          </div>
                        </Dropdown>
                      </div>

                      <div>
                        <label
                          className="block text-base font-semibold mb-2"
                          style={{ color: "#202938" }}
                        >
                          Difficulty Level
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {difficulties.map((difficulty) => (
                            <button
                              key={difficulty.value}
                              type="button"
                              onClick={() =>
                                handleInputChange(
                                  "difficulty",
                                  difficulty.value
                                )
                              }
                              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                                formData.difficulty === difficulty.value
                                  ? "border-cyan-600 bg-cyan-50 shadow-md scale-105"
                                  : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
                              }`}
                            >
                              <div className="text-center flex flex-col items-center justify-center">
                                <div className="text-sm font-medium">
                                  {difficulty.label}
                                </div>
                                <div
                                  className={`w-4 h-4 rounded-full mx-auto mt-2 ${difficulty.color}`}
                                ></div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Configuration */}
                {currentStep === 1 && (
                  <Configuration
                    formData={formData}
                    setFormData={setFormData}
                  />
                )}

                {/* Step 3: Questions */}
                {currentStep === 2 && (
                  <div>
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <div className="p-3 rounded-xl mr-4 bg-[#075260]">
                            <HelpCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2
                              className="text-2xl font-bold"
                              style={{ color: "#202938" }}
                            >
                              Question Bank Selection
                            </h2>
                            <p
                              onClick={() => setShowSelectedQuestions(true)}
                              className="text-gray-600"
                            >
                              {selectedQuestions.length} questions selected
                            </p>
                          </div>
                        </div>
                        {selectedQuestions.length > 0 && (
                          <div
                            onClick={() => setShowSelectedQuestions(true)}
                            className=" cursor-pointer bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium"
                          >
                            {selectedQuestions.length} Selected
                          </div>
                        )}
                      </div>

                      {/* Question Bank Steps */}
                      <div className="mb-8">
                        <div className="flex items-center justify-center mb-6">
                          {questionBankSteps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = index === questionBankStep;
                            const isCompleted = index < questionBankStep;

                            return (
                              <div key={index} className="flex items-center">
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                      isActive
                                        ? "bg-[#075260] text-white shadow-lg scale-110"
                                        : isCompleted
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : (
                                      <StepIcon className="w-5 h-5" />
                                    )}
                                  </div>
                                  <div className="mt-2 text-center">
                                    <div
                                      className={`text-sm font-medium ${
                                        isActive
                                          ? "text-[#075260]"
                                          : isCompleted
                                          ? "text-green-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {step.title}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                      {step.description}
                                    </div>
                                  </div>
                                </div>
                                {index < questionBankSteps.length - 1 && (
                                  <div
                                    className={`w-16 h-0.5 mx-3 mt-5 transition-all duration-300 ${
                                      isCompleted
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  ></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step 0: Subject Selection */}
                      {questionBankStep === 0 && (
                        <div className="space-y-6">
                          <div className="text-center mb-8">
                            <h3
                              className="text-xl font-semibold mb-2"
                              style={{ color: "#202938" }}
                            >
                              Choose Subject
                            </h3>
                            <p className="text-gray-600">
                              Select the subject for your exam questions
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subjects.map((subject) => (
                              <div
                                key={subject.value}
                                className={`cursor-pointer transition-all duration-300 hover:shadow-lg p-6 rounded-2xl border-2 ${
                                  selectedSubject === subject.value
                                    ? "border-cyan-600 bg-cyan-50 shadow-lg transform scale-105"
                                    : "border-gray-200 bg-white hover:border-cyan-300"
                                }`}
                                onClick={() => {
                                  setSelectedSubject(subject.value);
                                  setTimeout(() => setQuestionBankStep(1), 300);
                                }}
                              >
                                <div className="text-center">
                                  <div className="text-4xl mb-3">
                                    {subject.icon}
                                  </div>
                                  <h4
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: "#202938" }}
                                  >
                                    {subject.label}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {unitsBySubject[subject.value]?.length || 0}{" "}
                                    units available
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 1: Unit Selection */}
                      {questionBankStep === 1 && selectedSubject && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "#202938" }}
                              >
                                Choose Units from{" "}
                                {
                                  subjects.find(
                                    (s) => s.value === selectedSubject
                                  )?.label
                                }
                              </h3>
                              <p className="text-gray-600">
                                Select the units you want to include questions
                                from
                              </p>
                            </div>
                            <button
                              onClick={() => setQuestionBankStep(0)}
                              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200"
                            >
                              <Book className="w-4 h-4" />
                              <span>Change Subject</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {unitsBySubject[selectedSubject]?.map((unit) => (
                              <div
                                key={unit.id}
                                className={`cursor-pointer transition-all duration-300 hover:shadow-lg p-6 rounded-2xl border-2 ${
                                  selectedUnit === unit.id
                                    ? "border-cyan-600 bg-cyan-50 shadow-lg transform scale-105"
                                    : "border-gray-200 bg-white hover:border-cyan-300"
                                }`}
                                onClick={() => {
                                  setSelectedUnit(unit.id);
                                  setTimeout(() => setQuestionBankStep(2), 300);
                                }}
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4
                                    className="text-lg font-semibold"
                                    style={{ color: "#202938" }}
                                  >
                                    {unit.name}
                                  </h4>
                                  <div className="p-2 rounded-lg bg-cyan-600">
                                    <Settings className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <span>Available Questions</span>
                                  <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    {unit.questionsCount}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Topic Selection */}
                      {questionBankStep === 2 && selectedUnit && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "#202938" }}
                              >
                                Choose Topics
                              </h3>
                              <p className="text-gray-600">
                                Select specific topics to narrow down your
                                question selection
                              </p>
                            </div>
                            <button
                              onClick={() => setQuestionBankStep(1)}
                              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Change Unit</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topicsByUnit[selectedUnit]?.map((topic) => (
                              <div
                                key={topic.id}
                                className={`cursor-pointer transition-all duration-300 hover:shadow-lg p-5 rounded-2xl border-2 ${
                                  selectedTopic === topic.id
                                    ? "border-cyan-600 bg-cyan-50 shadow-lg transform scale-105"
                                    : "border-gray-200 bg-white hover:border-cyan-300"
                                }`}
                                onClick={() => {
                                  setSelectedTopic(topic.id);
                                  setTimeout(() => setQuestionBankStep(3), 300);
                                }}
                              >
                                <div className="text-center">
                                  <div className="p-3 rounded-xl mb-3 mx-auto w-fit bg-purple-100">
                                    <Book className="w-6 h-6 text-purple-600" />
                                  </div>
                                  <h4
                                    className="text-base font-semibold mb-2"
                                    style={{ color: "#202938" }}
                                  >
                                    {topic.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {topic.questionsCount} questions
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Question Selection */}
                      {questionBankStep === 3 && selectedTopic && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "#202938" }}
                              >
                                Select Questions
                              </h3>
                              <p className="text-gray-600">
                                Choose specific questions for your exam
                              </p>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setQuestionBankStep(2)}
                                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl transition-all duration-200"
                              >
                                <Book className="w-4 h-4" />
                                <span>Change Topic</span>
                              </button>
                              {selectedQuestions.length > 0 && (
                                <button
                                  onClick={() => {
                                    alert(
                                      `${selectedQuestions.length} questions added to exam!`
                                    );
                                    setQuestionBankStep(0);
                                    setCurrentStep(2);
                                  }}
                                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>
                                    Add {selectedQuestions.length} Questions
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setShowCustomQuestionModal(true);
                              }}
                              className="flex justify-center items-center space-x-2 bg-[#0F7490] hover:bg-[#075260] text-white px-4 py-2 rounded-xl transition-all duration-200"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add Custom Question</span>
                            </button>
                          </div>

                          <div className="space-y-4">
                            {questionsByTopic[selectedTopic]?.map(
                              (question, index) => {
                                const isSelected = selectedQuestions.some(
                                  (q) => q.id === question.id
                                );
                                return (
                                  <div
                                    key={question.id}
                                    className={`cursor-pointer transition-all duration-300 p-5 rounded-xl border-2 ${
                                      isSelected
                                        ? "border-green-500 bg-green-50 shadow-lg"
                                        : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
                                    }`}
                                    onClick={() =>
                                      handleQuestionSelect(question)
                                    }
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center mb-3">
                                          {/* <span className="text-lg mr-2">
                                            {getTypeIcon(question.type)}
                                          </span> */}
                                          <span className="text-sm font-medium text-gray-600 mr-3">
                                            Q{index + 1}
                                          </span>
                                          <div
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                              question.difficulty
                                            )}`}
                                          >
                                            {question.difficulty}
                                          </div>
                                          <span className="text-xs text-gray-500 ml-3 capitalize">
                                            {question.type.replace("-", " ")}
                                          </span>
                                        </div>
                                        <p
                                          className="text-base mb-2"
                                          style={{ color: "#202938" }}
                                        >
                                          {question.text}
                                        </p>
                                      </div>
                                      <div className="ml-4">
                                        {isSelected ? (
                                          <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : (
                                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}

                      {/* Initial State - No selection made */}
                      {questionBankStep === 0 && !selectedSubject && (
                        <div className="text-center py-12">
                          <div className="mb-6">
                            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 bg-cyan-100">
                              <HelpCircle className="w-12 h-12 text-cyan-600" />
                            </div>
                            <h3
                              className="text-xl font-semibold mb-2"
                              style={{ color: "#202938" }}
                            >
                              Build Your Question Bank
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto">
                              Follow the steps to select questions from
                              subjects, units, and topics
                            </p>
                          </div>

                          <button
                            onClick={handleQuestionBank}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
                          >
                            <Book className="w-5 h-5" />
                            <span>Start Selection Process</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      currentStep === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  {currentStep < steps.length - 1 ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span>Next Step</span>
                      <Rocket className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Exam</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-[#075260] to-[#0793b0] rounded-2xl p-6 !text-white shadow-xl">
              <div className="flex items-center mb-4">
                <Lightbulb className="w-6 h-6 mr-3" />
                <h3 className="text-lg font-bold text-white">Quick Tips</h3>
              </div>
              <ul className="space-y-2 text-sm font-normal opacity-90 text-white">
                <li>• Use clear, descriptive exam titles</li>
                <li>• Consider appropriate difficulty levels</li>
                <li>• Set realistic time durations</li>
                <li>• Preview before publishing</li>
              </ul>
            </div>

            {/* Progress Summary */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-center">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: "#202938" }}
                >
                  Form Completion
                </h3>
                <div className="mb-4">
                  <div className="text-3xl font-bold mb-2 text-cyan-600">
                    {formProgress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-cyan-600 rounded-full transition-all duration-500"
                      style={{ width: `${formProgress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Complete all fields to enable saving
                </p>
              </div>
            </div> */}

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Exam</span>
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSelectedQuestions}
        onClose={() => setShowSelectedQuestions(false)}
        title="Selected Questions"
        size="lg"
      >
        <div className="flex flex-col gap-2">
          {selectedQuestions?.map((question, index) => {
            const isSelected = selectedQuestions.some(
              (q) => q.id === question.id
            );
            return (
              <div
                key={question.id}
                className={`cursor-pointer transition-all duration-300 p-5 rounded-xl border-2 ${
                  isSelected
                    ? "border-green-500 bg-green-50 shadow-lg"
                    : "border-gray-200 bg-white hover:shadow-md hover:border-gray-300"
                }`}
                onClick={() => handleQuestionSelect(question)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {/* <span className="text-lg mr-2">
                                            {getTypeIcon(question.type)}
                                          </span> */}
                      <span className="text-sm font-medium text-gray-600 mr-3">
                        Q{index + 1}
                      </span>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </div>
                      <span className="text-xs text-gray-500 ml-3 capitalize">
                        {question.type.replace("-", " ")}
                      </span>
                    </div>
                    <p className="text-base mb-2" style={{ color: "#202938" }}>
                      {question.text}
                    </p>
                  </div>
                  <div className="ml-4">
                    {isSelected ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>

      <QuestionModal
        isOpen={showCustomQuestionModal}
        onClose={() => setShowCustomQuestionModal(false)}
        setIsOpen={setShowCustomQuestionModal}
      />
    </div>
  );
};

export default NewExamClient;

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-xl shadow-xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#202938]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

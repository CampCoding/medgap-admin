"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Book,
  Eye,
  MinusIcon,
  PlusIcon,
  SaveIcon,
} from "lucide-react";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import Card from "../atoms/Card";
import PagesHeader from "../ui/PagesHeader";
import MCQPrev from "../Previews/MCQ.preview";
import { Modal } from "antd";
import QuestionPreview from "../Previews/MCQ.preview";
import EssayPrev from "../Previews/Essay.preview";

const Settings = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const AlertCircle = () => (
  <svg
    className="w-3 h-3"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01"
    />
  </svg>
);

const CheckCircle2 = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Input = ({
  placeholder,
  className = "",
  label,
  required = false,
  error,
  ...props
}) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-[#202938]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`block w-full rounded-lg border ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
          : "border-gray-200 focus:border-[#0F7490] focus:ring-[#0F7490]"
      } bg-white px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${className}`}
      placeholder={placeholder}
      {...props}
    />
    {error && (
      <div className="flex items-center space-x-1 text-red-500 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const mcq = {
  type: "MCQ",
  difficulty: "Easy",
  question: "What is 2 + 2?",
  subject: "Math",
  uses: 15,
  tags: ["Basic", "Addition"],
  modified: "2024-08-01",
  created: "2024-08-01",
  hint: "Think basic addition.",
  keywords: "math, addition, basics",
  helpText: "Add the two numbers directly.",
  options: [
    { id: "A", text: "3", explanation: "No, 2 + 2 = 4." },
    { id: "B", text: "4", explanation: "Correct! 2 + 2 = 4.", isCorrect: true },
    { id: "C", text: "5", explanation: "Too high." },
    { id: "D", text: "6", explanation: "Way off." },
  ],
};

// True/False
const tf = {
  type: "True/False",
  difficulty: "Medium",
  question: "The Earth revolves around the Sun.",
  subject: "Science",
  correct: true,
  explanationTrue: "Correct—it's heliocentric.",
  explanationFalse: "No—the Earth does revolve around the Sun.",
};

// Essay
const essay = {
  type: "Essay",
  difficulty: "Hard",
  question: "Explain the causes of World War II.",
  subject: "History",
  guidelines: "Discuss political, economic, and social causes. 500–800 words.",
  rubric: {
    "Content Knowledge": "40%",
    "Analysis & Critical Thinking": "30%",
    "Organization & Structure": "20%",
    "Grammar & Style": "10%",
  },
};

const CreateQuestion = () => {
  const [questionType, setQuestionType] = useState("mcq"); // "mcq" | "trueFalse" | "essay"
  const [question, setQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [prevModal, setPrevModal] = useState(false);

  const [options, setOptions] = useState([
    { text: "", explanation: "", isCorrect: false },
    { text: "", explanation: "", isCorrect: false },
  ]);

  // (kept for future TF usage)
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState("");

  // NEW fields
  const [hint, setHint] = useState("");
  const [keywords, setKeywords] = useState(""); // comma-separated
  const [helpText, setHelpText] = useState("");

  const [timeLimit, setTimeLimit] = useState("");
  const [points, setPoints] = useState("1");

  const addOption = () =>
    setOptions([...options, { text: "", explanation: "", isCorrect: false }]);

  const removeOption = (index) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    if (field === "isCorrect" && value) {
      newOptions.forEach((o, i) => (o.isCorrect = i === index));
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
    if (type === "trueFalse") {
      setTrueFalseAnswer(null);
      setTrueFalseExplanation("");
      setOptions([
        { text: "", explanation: "", isCorrect: false },
        { text: "", explanation: "", isCorrect: false },
      ]);
    } else {
      setOptions([
        { text: "", explanation: "", isCorrect: false },
        { text: "", explanation: "", isCorrect: false },
      ]);
    }
  };

  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C",
    accent: "#8B5CF6",
    background: "#F9FAFC",
    text: "#202938",
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "from-green-400 to-green-500" },
    {
      value: "medium",
      label: "Medium",
      color: "from-yellow-400 to-yellow-500",
    },
    { value: "hard", label: "Hard", color: "from-red-400 to-red-500" },
  ];

  // mock params
  const selectedSubjectAndUnitWithTopic = {
    subject: { name: "Mathematics" },
    unit: { name: "Algebra" },
    topic: { name: "Linear Equations" },
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "Questions", href: "#" },
    { label: "Create New Question", href: "#", current: true },
  ];

  const isFormValid =
    questionType === "mcq" || questionType === "trueFalse"
      ? question.trim() &&
        options.every((opt) => opt.text.trim()) &&
        options.some((opt) => opt.isCorrect) &&
        difficulty
      : question.trim() !== "" && modalAnswer && difficulty;

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"Create New Question"}
          subtitle={"                Design questions for your students"}
          extra={
            <div className="flex items-center space-x-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  questionType === "mcq"
                    ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                    : "bg-[#0F7490]/10 text-[#0F7490]"
                }`}
              >
                {questionType === "mcq"
                  ? "Multiple Choice"
                  : questionType === "trueFalse"
                  ? "True/False"
                  : "Essay Question"}
              </div>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Question Type" className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleQuestionTypeChange("mcq")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    questionType === "mcq"
                      ? "border-[#0F7490] bg-[#0F7490]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-medium text-[#202938]">
                    Multiple Choice
                  </h3>
                  <p className="text-sm text-[#202938]/60">
                    Create questions with multiple answer options
                  </p>
                </button>

                <button
                  onClick={() => handleQuestionTypeChange("trueFalse")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    questionType === "trueFalse"
                      ? "border-[#0F7490] bg-[#0F7490]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-medium text-[#202938]">True/False</h3>
                  <p className="text-sm text-[#202938]/60">
                    Create simple true or false questions
                  </p>
                </button>

                <button
                  onClick={() => handleQuestionTypeChange("essay")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    questionType === "essay"
                      ? "border-[#0F7490] bg-[#0F7490]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h3 className="font-medium text-[#202938]">Essay</h3>
                  <p className="text-sm text-[#202938]/60">
                    Create simple essay questions
                  </p>
                </button>
              </div>
            </Card>

            {/* Question Details */}
            <Card title="Question Details" className="p-6">
              <div className="space-y-6">
                <TextArea
                  label="Question"
                  placeholder="Enter your question here..."
                  required
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                {questionType === "essay" && (
                  <TextArea
                    label="Model answer"
                    placeholder="Enter your model answer here..."
                    required
                    rows={3}
                    value={modalAnswer}
                    onChange={(e) => setModalAnswer(e.target.value)}
                  />
                )}

                {/* NEW: Hint */}
                <TextArea
                  label="Hint"
                  placeholder="Add a short hint to guide students (optional)..."
                  rows={2}
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                />

                {/* NEW: Keywords */}
                <Input
                  label="Keywords"
                  placeholder="Enter keywords separated by commas (e.g., algebra, equations, slope)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />

                {/* Difficulty */}
                <div className="mt-2">
                  <label
                    className="block text-sm font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Difficulty Level
                  </label>
                  <div className="flex space-x-3">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDifficulty(option.value)}
                        className={`flex-1 p-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                          difficulty === option.value
                            ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <Input
                  label="Tags"
                  placeholder="Enter tags separated by commas (e.g., algebra, equations)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />

                {/* NEW: Help / Guidance */}
                <TextArea
                  label="Help / Guidance"
                  placeholder="Provide additional help or solution strategy (shown on request to students)..."
                  rows={3}
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                />
              </div>
            </Card>

            {/* Conditional Answer Section */}
            {(questionType === "mcq" || questionType === "trueFalse") && (
              <Card
                title="Answer Options & Explanations"
                extra={
                  questionType === "mcq" && (
                    <Button
                      type="text"
                      onClick={addOption}
                      className="text-[#0F7490] hover:bg-[#0F7490]/10"
                    >
                      <PlusIcon className="w-4 h-4 mr-1" />
                      Add Option
                    </Button>
                  )
                }
                className="p-6"
              >
                <div className="space-y-6">
                  <p className="text-sm text-[#202938]/60 mb-4">
                    Enter answer options and mark the correct one. Add
                    explanations to help students understand.
                  </p>

                  {options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        option.isCorrect
                          ? "border-[#0F7490] bg-[#0F7490]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start space-x-3 mb-4">
                        {/* Radio */}
                        <div className="relative mt-3">
                          <input
                            type="radio"
                            checked={option.isCorrect}
                            onChange={() =>
                              updateOption(
                                index,
                                "isCorrect",
                                !option.isCorrect
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                              option.isCorrect
                                ? "border-[#0F7490] bg-[#0F7490]"
                                : "border-gray-300"
                            }`}
                            onClick={() =>
                              updateOption(index, "isCorrect", true)
                            }
                          >
                            {option.isCorrect && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                        </div>

                        {/* Option text */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-medium text-[#202938]">
                              Option {index + 1}
                            </span>
                            {option.isCorrect && (
                              <span className="bg-[#0F7490] text-white text-xs px-2 py-1 rounded-full">
                                Correct Answer
                              </span>
                            )}
                          </div>
                          <Input
                            placeholder={`Enter option ${index + 1}`}
                            value={option.text}
                            onChange={(e) =>
                              updateOption(index, "text", e.target.value)
                            }
                            className="w-full"
                          />
                        </div>

                        {/* Remove */}
                        {options.length > 2 && (
                          <Button
                            type="text"
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:bg-red-50 mt-8"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* Explanation */}
                      <div className="ml-8">
                        <TextArea
                          label={`Explanation for Option ${index + 1}`}
                          placeholder="Explain why this answer is correct or incorrect (optional)"
                          rows={2}
                          value={option.explanation}
                          onChange={(e) =>
                            updateOption(index, "explanation", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sticky top-0">
            <Card title="Quick Actions" className="p-6">
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setPrevModal(true);
                  }}
                  type="default"
                  className="w-full justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Question
                </Button>
                <Button type="secondary" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </Card>

            <Card title="Question Info" className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">Type</span>
                  <span className="font-medium text-[#202938]">
                    {questionType === "mcq"
                      ? "Multiple Choice"
                      : questionType === "essay"
                      ? "Essay"
                      : "True/False"}
                  </span>
                </div>

                {questionType === "mcq" || questionType === "trueFalse" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">Options</span>
                      <span className="font-medium text-[#202938]">
                        {options.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">
                        Correct Answer
                      </span>
                      <span className="font-medium text-[#0F7490]">
                        {options.findIndex((opt) => opt.isCorrect) !== -1
                          ? `Option ${
                              options.findIndex((opt) => opt.isCorrect) + 1
                            }`
                          : "None Selected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">
                        With Explanations
                      </span>
                      <span className="font-medium text-[#8B5CF6]">
                        {
                          options.filter((opt) =>
                            (opt.explanation || "").trim()
                          ).length
                        }
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">
                      Model Answer
                    </span>
                    <span className="font-medium text-[#0F7490]">
                      {(modalAnswer || "").trim().length > 0 ? "Added" : "None"}
                    </span>
                  </div>
                )}

                {/* NEW summary */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">Has Hint</span>
                  <span className="font-medium text-[#202938]">
                    {(hint || "").trim() ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">Keywords</span>
                  <span className="font-medium text-[#202938]">
                    {(keywords || "").trim() ? keywords.split(",").length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">Has Help</span>
                  <span className="font-medium text-[#202938]">
                    {(helpText || "").trim() ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#202938]/60">Characters</span>
                  <span className="font-medium text-[#202938]">
                    {(question || "").length}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-center">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isFormValid ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {isFormValid ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p
                  className={`text-sm font-medium ${
                    isFormValid ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {isFormValid ? "Ready to Save" : "Fill Required Fields"}
                </p>
                <p className="text-xs text-[#202938]/50 mt-1">
                  {isFormValid
                    ? "All required fields completed"
                    : questionType === "mcq"
                    ? "Need question, options, and correct answer"
                    : "Need question and correct answer"}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <Button type="text">Cancel</Button>
            <Button type="default">Save as Draft</Button>
          </div>
          <Button
            type="primary"
            size="large"
            disabled={!isFormValid}
            // onClick={() => saveQuestion({question, modalAnswer, options, difficulty, tags, hint, keywords, helpText})}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Save Question
          </Button>
        </div>
      </div>

      {/* Question preview modal */}
      {questionType === "mcq" ? (
        <Modal
          footer={null}
          open={prevModal}
          className=" w-full  md:!w-[40%]"
          onCancel={() => setPrevModal(!prevModal)}
        >
          <QuestionPreview question={mcq} />
          
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
    </div>
  );
};

export default CreateQuestion;

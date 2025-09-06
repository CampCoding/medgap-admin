import React, { useState } from "react";
import {
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
} from "lucide-react";

const EssayPrev = () => {
  const essayQuestion = {
    type: "Essay",
    difficulty: "Hard",
    question: "Explain the causes of World War II.",
    subject: "History",
    uses: 12,
    tags: ["World War", "Analysis"],
    modified: "2024-07-26",
    created: "2024-07-25",
    guidelines:
      "Students should discuss multiple factors including political, economic, and social causes. Expected length: 500-800 words.",
    rubric: {
      "Content Knowledge": "40%",
      "Analysis & Critical Thinking": "30%",
      "Organization & Structure": "20%",
      "Grammar & Style": "10%",
    },
  };
  // 定义一个包含题目卡片信息的组件

  const QuestionCard = ({ question, children, bgColor = "bg-white" }) => (
    <div
      className={`${bgColor} rounded-lg shadow-md border border-gray-200 p-6 mb-6`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              question.type === "MCQ"
                ? "bg-blue-100 text-blue-800"
                : question.type === "True/False"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {question.type}
          </span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              question.difficulty === "Easy"
                ? "bg-green-100 text-green-700"
                : question.difficulty === "Hard"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {question.difficulty}
          </span>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" />
            <span className="text-sm">Preview</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors">
            <FileText className="w-4 h-4" />
            <span className="text-sm">Duplicate</span>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {question.question}
      </h3>

      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center space-x-1">
          <FileText className="w-4 h-4" />
          <span>{question.subject}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Eye className="w-4 h-4" />
          <span>{question.uses} uses</span>
        </span>
        <span className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>Modified {question.modified}</span>
        </span>
        <span className="flex items-center space-x-1">
          <User className="w-4 h-4" />
          <span>Created {question.created}</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-gray-50">
      {/* Essay Question */}
      <QuestionCard question={essayQuestion} bgColor="bg-purple-50">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">Answer:</h4>
            <p className="text-gray-600 font-semibold text-base">
              World War II was caused by the rise of fascist regimes in Germany,
              Italy, and Japan, driven by militarism, expansionism, and
              nationalism. <br /> It was triggered by Germany's invasion of
              Poland in 1939, following unresolved tensions from World War I and
              the Treaty of Versailles.
            </p>
          </div>
        </div>
      </QuestionCard>
    </div>
  );
};

export default EssayPrev;

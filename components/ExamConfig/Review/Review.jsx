import React from "react";
import { Eye, FileText, BookOpen, Settings } from "lucide-react";

const ReviewConfiguration = ({ formData, setFormData }) => {
  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const reviewOptions = [
    {
      id: "showCorrectAnswers",
      label: "Show Correct Answers",
      description:
        "Display the correct answers to students after exam completion",
      icon: Eye,
      iconColor: "text-green-600",
    },
    {
      id: "showStudentResponses",
      label: "Show Student Responses",
      description: "Allow students to view their submitted answers",
      icon: FileText,
      iconColor: "text-blue-600",
    },
    {
      id: "showExplanationsAfterExamCompletion",
      label: "Show Explanations After Exam Completion",
      description:
        "Display detailed explanations for each question after submission",
      icon: BookOpen,
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-3 rounded-xl mr-4 bg-amber-500">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "#202938" }}>
            Configuration - Review
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Review Options */}
        <div className="space-y-4">
          {reviewOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  formData[option.id]
                    ? "border-cyan-600 bg-cyan-50 shadow-md"
                    : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <IconComponent
                        className={`w-5 h-5 ${option.iconColor}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold"
                        style={{ color: "#202938" }}
                      >
                        {option.label}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={option.id}
                        checked={formData[option.id] === true}
                        onChange={() => handleRadioChange(option.id, true)}
                        className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="text-sm font-medium text-green-600">
                        Enable
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={option.id}
                        checked={formData[option.id] === false}
                        onChange={() => handleRadioChange(option.id, false)}
                        className="w-4 h-4 text-gray-400 focus:ring-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        Disable
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Review Summary Card */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
          <h3
            className="text-lg font-semibold mb-3"
            style={{ color: "#202938" }}
          >
            Review Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Correct Answers</div>
              <div
                className={`font-semibold ${
                  formData.showCorrectAnswers
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {formData.showCorrectAnswers ? "Visible" : "Hidden"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Student Responses</div>
              <div
                className={`font-semibold ${
                  formData.showStudentResponses
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                {formData.showStudentResponses ? "Visible" : "Hidden"}
              </div>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <div className="font-medium text-gray-700">Explanations</div>
              <div
                className={`font-semibold ${
                  formData.showExplanationsAfterExamCompletion
                    ? "text-purple-600"
                    : "text-gray-400"
                }`}
              >
                {formData.showExplanationsAfterExamCompletion
                  ? "Visible"
                  : "Hidden"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewConfiguration;

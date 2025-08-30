import React, { useState } from "react";
import { Modal, Button, Card, Upload, Input, Tooltip } from "antd";
import {
  PlusOutlined,
  CameraOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Plus, Minus } from "lucide-react";
import Jodit from "@/components/Jodit/Jodit";

const QuestionModal = ({ isOpen, onClose, setIsOpen }) => {
  const [questionType, setQuestionType] = useState("mcq");
  const [question, setQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [tags, setTags] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [options, setOptions] = useState([
    { text: "", explanation: "", isCorrect: false },
    { text: "", explanation: "", isCorrect: false },
  ]);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState(null);
  const [trueFalseExplanation, setTrueFalseExplanation] = useState("");

  const colors = {
    text: "#202938",
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", color: "from-green-500 to-green-600" },
    {
      value: "medium",
      label: "Medium",
      color: "from-yellow-500 to-yellow-600",
    },
    { value: "hard", label: "Hard", color: "from-red-500 to-red-600" },
  ];

  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
  };

  const handleTrueFalseAnswer = (answer) => {
    setTrueFalseAnswer(answer);
  };

  const addOption = () => {
    setOptions([...options, { text: "", explanation: "", isCorrect: false }]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    if (field === "isCorrect" && value) {
      // Only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setOptions(newOptions);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setSelectedFile(file);
      return false;
    },
    showUploadList: false,
  };

  const handleOk = () => {
    setIsOpen(false);
    onClose();
  };

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className="p-8">
      <Modal
        title={
          <div className="flex items-center gap-2">
            <PlusOutlined className="text-lg" />
            <span>Add Question</span>
          </div>
        }
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" onClick={handleOk}>
            Add Question
          </Button>,
        ]}
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Question Type Selector */}
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
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-[#202938]">
                      Multiple Choice
                    </h3>
                    <p className="text-sm text-[#202938]/60">
                      Create questions with multiple answer options
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuestionTypeChange("trueFalse")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  questionType === "trueFalse"
                    ? "border-[#0F7490] bg-[#0F7490]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-[#202938]">True/False</h3>
                    <p className="text-sm text-[#202938]/60">
                      Create simple true or false questions
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuestionTypeChange("essay")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  questionType === "essay"
                    ? "border-[#0F7490] bg-[#0F7490]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-medium text-[#202938]">Essay</h3>
                    <p className="text-sm text-[#202938]/60">
                      Create simple essay questions
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* Question Details */}
          <Card title="Question Details" className="p-6">
            <div className="flex flex-col gap-3">
              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#202938] mb-3">
                  Question Image (Optional)
                </label>

                {imagePreview ? (
                  <div className="relative inline-block">
                    <div className="relative w-64 h-40 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Question"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <button
                          onClick={handleRemoveImage}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
                        >
                          <DeleteOutlined className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Replace Image Button */}
                    <Upload
                      {...uploadProps}
                      className="absolute -bottom-2 -right-2"
                    >
                      <Button
                        type="primary"
                        className=" text-white shadow-lg rounded-full w-8 h-8 p-0"
                        size="small"
                      >
                        <CameraOutlined className="w-4 h-4" />
                      </Button>
                    </Upload>
                  </div>
                ) : (
                  <Upload className="w-full" {...uploadProps}>
                    <div className="w-48 h-40 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-gray-400">
                      <CameraOutlined className="text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-1">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </Upload>
                )}

                {selectedFile && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>

              <Jodit
                content={question}
                onChange={(e) => setQuestion(e)}
                placeholder="Enter your question here..."
              />

              {questionType === "essay" && (
                <Jodit
                  placeholder="Enter your model answer here..."
                  content={modalAnswer}
                  onChange={(e) => setModalAnswer(e)}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="mt-6">
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
              </div>

              <Input
                placeholder="Enter tags separated by commas (e.g., algebra, equations)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                addonBefore="Tags"
              />
            </div>
          </Card>

          {/* Conditional Answer Section */}
          {questionType === "mcq" && (
            // MCQ Answer Options
            <Card
              title="Answer Options & Explanations"
              extra={
                <Button
                  type="text"
                  onClick={addOption}
                  className="text-[#0F7490] hover:bg-[#0F7490]/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Option
                </Button>
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
                      {/* Radio Button */}
                      <div className="relative mt-3">
                        <input
                          type="radio"
                          checked={option.isCorrect}
                          onChange={() =>
                            updateOption(index, "isCorrect", !option.isCorrect)
                          }
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer ${
                            option.isCorrect
                              ? "border-[#0F7490] bg-[#0F7490]"
                              : "border-gray-300"
                          }`}
                          onClick={() => updateOption(index, "isCorrect", true)}
                        >
                          {option.isCorrect && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>

                      {/* Option Text */}
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
                        <Jodit
                          placeholder={`Enter option ${index + 1}`}
                          content={option.text}
                          onChange={(e) => updateOption(index, "text", e)}
                        />
                      </div>

                      {/* Remove Button */}
                      {options.length > 2 && (
                        <Button
                          type="text"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:bg-red-50 mt-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Explanation */}
                    <div className="ml-8">
                      <label className="block text-sm font-medium text-[#202938] mb-2">
                        Explanation for Option {index + 1}
                      </label>
                      <Jodit
                        placeholder="Explain why this answer is correct or incorrect (optional)"
                        content={option.explanation}
                        onChange={(e) => updateOption(index, "explanation", e)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {questionType === "trueFalse" && (
            // True/False Answer Options
            <Card title="True/False Answer" className="p-6">
              <div className="flex flex-col gap-4">
                <p className="text-sm text-[#202938]/60 mb-4">
                  Select the correct answer for this True/False question.
                </p>

                <div className="flex space-x-4">
                  <button
                    onClick={() => handleTrueFalseAnswer(true)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                      trueFalseAnswer === true
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">True</div>
                      <div className="text-sm opacity-75">
                        This statement is correct
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleTrueFalseAnswer(false)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                      trueFalseAnswer === false
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-semibold">False</div>
                      <div className="text-sm opacity-75">
                        This statement is incorrect
                      </div>
                    </div>
                  </button>
                </div>

                <Jodit
                  placeholder="Explain why this answer is correct (optional)"
                  content={trueFalseExplanation}
                  onChange={(e) => setTrueFalseExplanation(e)}
                />
              </div>
            </Card>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default QuestionModal;

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Book,
  Eye,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Save as SaveIcon,
  Video,
  Upload,
  File,
  X,
  Edit3,
  Play,
  FolderOpen,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { Modal, message, Select } from "antd";
import { toast } from "react-toastify";

// project atoms/ui (same ones you already use on Create)
import BreadcrumbsShowcase from "../../../../../../../../../../../components/ui/BreadCrumbs";
import Button from "../../../../../../../../../../../components/atoms/Button";
import TextArea from "../../../../../../../../../../../components/atoms/TextArea";
import Card from "../../../../../../../../../../../components/atoms/Card";
import PagesHeader from "../../../../../../../../../../../components/ui/PagesHeader";
import EssayPrev from "../../../../../../../../../../../components/Previews/Essay.preview";
import {
  handleEditQuestion,
  handleGetQuestionDetails,
} from "../../../../../../../../../../../features/questionsSlice";

/* ---------- Small helpers/components ---------- */
const AlertCircle = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
  </svg>
);

const CheckCircle2 = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Input = ({ placeholder, className = "", label, required = false, error, ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-medium text-[#202938]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      className={`block w-full rounded-lg border ${
        error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0F7490] focus:ring-[#0F7490]"
      } bg-white px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 transition-colors ${className}`}
      placeholder={placeholder}
      {...props}
    />
    {error && (
      <div className="flex items-center space-x-1 text-red-500 text-xs">
        <AlertCircle />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const getVideoEmbedUrl = (url) => {
  if (!url) return null;
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeRegex);
  if (match) return `https://www.youtube.com/embed/${match[1]}`;
  return url;
};

const isValidVideoUrl = (url) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const SUGGESTED_TAGS = [
  "algebra",
  "equations",
  "functions",
  "geometry",
  "calculus",
  "trigonometry",
  "statistics",
  "probability",
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

const freshOptions = () => [
  { optionId: null, text: "", explanation: "", videoUrl: "", videoFile: null, isCorrect: false },
  { optionId: null, text: "", explanation: "", videoUrl: "", videoFile: null, isCorrect: false },
];

/* ===================== PAGE ===================== */
export default function EditQuestionPage() {
  const dispatch = useDispatch();
  const { editId } = useParams();

  const {
    question_details,
    question_details_list,
    get_question_loading,
    edit_question_loading,
  } = useSelector((s) => s?.questions) || {};

  // UI state
  const [activeTab, setActiveTab] = useState("editor");
  const [questionType, setQuestionType] = useState("mcq"); // "mcq" | "trueFalse" | "essay"
  const [question, setQuestion] = useState("");
  const [modalAnswer, setModalAnswer] = useState("");
  const [prevModal, setPrevModal] = useState(false);

  const [options, setOptions] = useState(freshOptions());
  const [deletedOptionIds, setDeletedOptionIds] = useState([]); // track deletions to send {_delete: true}

  const [difficulty, setDifficulty] = useState("medium");
  const [hint, setHint] = useState("");
  const [keywords, setKeywords] = useState(""); // CSV for UI
  const [helpText, setHelpText] = useState("");
  const [points, setPoints] = useState("1");

  const [status, setStatus] = useState("active");
  const [tags, setTags] = useState([]); // array for Select tags mode
  const [existingTopicId, setExistingTopicId] = useState(null);

  // Load details
  useEffect(() => {
    if (editId) {
      dispatch(handleGetQuestionDetails(editId));
    }
  }, [dispatch, editId]);

  // Prefill when data arrives (use question_details_list as requested)
  useEffect(() => {
    const q = question_details_list?.data?.question;
    if (!q) return;

    const apiType = String(q.question_type || "").toLowerCase();
    const uiType = apiType === "multiple_choice" ? "mcq" : apiType === "true_false" ? "trueFalse" : "essay";

    const mappedOptions = (q.options || []).map((o) => ({
      optionId: o?.option_id ?? o?.id ?? null,
      text: o?.option_text || o?.text || "",
      explanation: o?.explanation || "",
      videoUrl: o?.video_explanation_url || o?.videoUrl || "",
      videoFile: null,
      isCorrect: !!(o?.is_correct ?? o?.isCorrect),
    }));

    // Ensure at least two rows visible
    while (mappedOptions.length < 2) {
      mappedOptions.push({
        optionId: null,
        text: "",
        explanation: "",
        videoUrl: "",
        videoFile: null,
        isCorrect: false,
      });
    }

    setQuestionType(uiType);
    setQuestion(q.question_text || "");
    setModalAnswer(q.model_answer || "");
    setOptions(mappedOptions);
    setDeletedOptionIds([]); // reset deletion queue on fresh load
    setDifficulty(String(q.difficulty_level || "medium").toLowerCase());
    setHint(q.hint || "");
    setHelpText(q.help_guidance || "");
    setPoints(String(q.points ?? "1"));
    setStatus(String(q.status || "active").toLowerCase());

    setTags(Array.isArray(q.tags) ? q.tags.map((t) => String(t).trim()).filter(Boolean) : []);
    setKeywords(Array.isArray(q.keywords) ? q.keywords.join(", ") : q.keywords || "");

    setExistingTopicId(q.topic_id ?? null);
  }, [question_details_list]);

  // Derived
  const colors = useMemo(() => ({ primary: "#0F7490", text: "#202938" }), []);
  const difficultyOptions = useMemo(
    () => [
      { value: "easy", label: "Easy", color: "from-green-400 to-green-500" },
      { value: "medium", label: "Medium", color: "from-yellow-400 to-yellow-500" },
      { value: "hard", label: "Hard", color: "from-red-400 to-red-500" },
    ],
    []
  );

  // Validation
  const isFormValid =
    questionType === "mcq" || questionType === "trueFalse"
      ? question.trim() &&
        options.length >= 2 &&
        options.every((opt) => opt.text.trim()) &&
        options.some((opt) => opt.isCorrect) &&
        options.every((opt) => !opt.videoUrl || isValidVideoUrl(opt.videoUrl)) &&
        difficulty
      : question.trim() !== "" && modalAnswer && difficulty;

  // Builders
  const toArray = (csv) =>
    (csv || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const mapType = (t) => (t === "mcq" ? "multiple_choice" : t === "trueFalse" ? "true_false" : "essay");

  const mapOptionsForApi = () => {
    const updatedOrNew = options.map((o, idx) => ({
      ...(o.optionId ? { option_id: o.optionId } : {}),
      option_text: (o.text || "").trim(),
      is_correct: !!o.isCorrect,
      explanation: (o.explanation || "").trim() || undefined,
      video_explanation_url: (o.videoUrl || "").trim() || undefined,
      option_order: idx + 1,
    }));

    const deletions = deletedOptionIds.map((id) => ({
      option_id: id,
      _delete: true,
    }));

    return [...updatedOrNew, ...deletions];
  };

  const buildPayload = () => {
    const base = {
      question_text: question.trim(),
      question_type: mapType(questionType),
      difficulty_level: difficulty,
      hint: (hint || "").trim() || undefined,
      keywords: toArray(keywords),
      tags,
      help_guidance: (helpText || "").trim() || undefined,
      points: Number(points) || 0,
      status,
      topic_id: existingTopicId ?? undefined,
    };

    return base.question_type === "essay"
      ? { ...base, model_answer: (modalAnswer || "").trim() }
      : { ...base, options: mapOptionsForApi() };
  };

  // Handlers
  const addOption = () =>
    setOptions((prev) => [
      ...prev,
      { optionId: null, text: "", explanation: "", videoUrl: "", videoFile: null, isCorrect: false },
    ]);

  const removeOption = (index) => {
    setOptions((prev) => {
      const target = prev[index];
      if (target?.optionId) {
        setDeletedOptionIds((ids) => Array.from(new Set([...ids, target.optionId])));
      }
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  };

  const updateOption = (index, field, value) => {
    const next = [...options];
    if (field === "isCorrect" && value) {
      next.forEach((o, i) => (o.isCorrect = i === index));
    } else {
      next[index][field] = value;
    }
    setOptions(next);
  };

  const handleVideoFileUpload = (index, file) => {
    if (file && file.type.startsWith("video/")) {
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        message.error("File size must be less than 100MB");
        return;
      }
      const next = [...options];
      next[index].videoFile = file;
      next[index].videoUrl = "";
      setOptions(next);
    }
  };

  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
    // changing type resets model answer/options to avoid cross-type junk
    setModalAnswer("");
    setOptions(freshOptions());
    setDeletedOptionIds([]);
  };

  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please complete the required fields.");
      return;
    }
    const data_send = buildPayload();
    console.log(data_send);
    try {
      // If your thunk expects { id, data } shape, use:
      // const res = await dispatch(handleEditQuestion({ id: editId, data: payload })).unwrap();
      const res = await dispatch(handleEditQuestion({id:editId, body : data_send})).unwrap();
      if (res?.status === "success") {
        toast.success(res?.message || "Question updated successfully");
        setDeletedOptionIds([]); // clear deletion queue after success
      } else {
        toast.error(res || "Failed to update question");
      }
    } catch (e) {
      toast.error("An error occurred while updating the question");
    }
  };

  // Breadcrumbs (use list version for consistency)
  const q = question_details_list?.data?.question;
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Questions", href: "/questions", icon: Book },
    { label: q?.topic_name || "Edit Question", href: "#", current: true },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        <PagesHeader
          title={"Edit Question"}
          subtitle={q?.question_text ? `Editing: ${q.question_text}` : "Update question details"}
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center space-x-1 p-2">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "editor"
                  ? "bg-[#0F7490] text-white shadow-md"
                  : "text-[#202938]/60 hover:text-[#202938] hover:bg-gray-50"
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "preview"
                  ? "bg-[#0F7490] text-white shadow-md"
                  : "text-[#202938]/60 hover:text-[#202938] hover:bg-gray-50"
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === "assets"
                  ? "bg-[#0F7490] text-white shadow-md"
                  : "text-[#202938]/60 hover:text-[#202938] hover:bg-gray-50"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Assets</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main */}
          <div className="xl:col-span-2 space-y-6">
            {activeTab === "editor" && (
              <>
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
                      <h3 className="font-medium text-[#202938]">Multiple Choice</h3>
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
                  </div>
                </Card>

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
                        Enter answer options and mark the correct one. Add explanations to help
                        students understand.
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
                                onChange={() => updateOption(index, "isCorrect", !option.isCorrect)}
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
                          <div className="ml-8 space-y-4">
                            <TextArea
                              label={`Explanation for Option ${index + 1}`}
                              placeholder="Explain why this answer is correct or incorrect (optional)"
                              rows={2}
                              value={option.explanation}
                              onChange={(e) =>
                                updateOption(index, "explanation", e.target.value)
                              }
                            />

                            {/* Video section */}
                            <div>
                              <label className="block text-sm font-medium text-[#202938] mb-3">
                                <Video className="w-4 h-4 inline mr-2" />
                                Video Explanation (Optional)
                              </label>

                              <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                  <div className="flex space-x-4 text-sm">
                                    <span className="text-gray-600">Choose video source:</span>
                                  </div>
                                </div>

                                <div className="p-4 space-y-4">
                                  {/* URL */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Video URL (YouTube, Vimeo, etc.)
                                    </label>
                                    <Input
                                      placeholder="https://www.youtube.com/watch?v=..."
                                      value={option.videoUrl}
                                      onChange={(e) => {
                                        updateOption(index, "videoUrl", e.target.value);
                                        if (e.target.value && option.videoFile) {
                                          const next = [...options];
                                          next[index].videoFile = null;
                                          setOptions(next);
                                        }
                                      }}
                                      error={
                                        option.videoUrl && !isValidVideoUrl(option.videoUrl)
                                          ? "Please enter a valid URL"
                                          : null
                                      }
                                      disabled={!!option.videoFile}
                                    />
                                  </div>

                                  {/* OR */}
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                    <span className="text-xs text-gray-500">OR</span>
                                    <div className="flex-1 h-px bg-gray-200"></div>
                                  </div>

                                  {/* File */}
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">
                                      Upload Video File
                                    </label>

                                    {!option.videoFile ? (
                                      <div className="relative">
                                        <input
                                          type="file"
                                          accept="video/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleVideoFileUpload(index, file);
                                          }}
                                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          disabled={!!option.videoUrl}
                                        />
                                        <div
                                          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                            option.videoUrl
                                              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                                          }`}
                                        >
                                          <Upload
                                            className={`w-8 h-8 mx-auto mb-2 ${
                                              option.videoUrl ? "text-gray-400" : "text-gray-500"
                                            }`}
                                          />
                                          <p
                                            className={`text-sm ${
                                              option.videoUrl ? "text-gray-400" : "text-gray-600"
                                            }`}
                                          >
                                            {option.videoUrl
                                              ? "Clear URL to upload file"
                                              : "Click to upload video file"}
                                          </p>
                                          <p
                                            className={`text-xs mt-1 ${
                                              option.videoUrl ? "text-gray-400" : "text-gray-500"
                                            }`}
                                          >
                                            MP4, WebM, AVI, MOV (Max 100MB)
                                          </p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <File className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-green-800 font-medium">
                                              {option.videoFile.name}
                                            </span>
                                            <span className="text-xs text-green-600">
                                              ({(option.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                                            </span>
                                          </div>
                                          <button
                                            onClick={() => {
                                              const next = [...options];
                                              next[index].videoFile = null;
                                              setOptions(next);
                                            }}
                                            className="text-red-500 hover:text-red-700 p-1"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Success */}
                                  {((option.videoUrl && isValidVideoUrl(option.videoUrl)) ||
                                    option.videoFile) && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                                      <p className="text-xs text-green-700 flex items-center">
                                        <span className="mr-1">✓</span>
                                        Video will be available in the explanation
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Preview Tab */}
            {activeTab === "preview" && (
              <Card title="Question Preview" className="p-6">
                <div className="space-y-6">
                  {question ? (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Question Preview</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium text-gray-800 mb-2">Question:</p>
                          <p className="text-gray-700">{question}</p>

                          {hint && (
                            <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                              <p className="text-sm font-medium text-blue-800">Hint:</p>
                              <p className="text-sm text-blue-700">{hint}</p>
                            </div>
                          )}

                          {helpText && (
                            <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                              <p className="text-sm font-medium text-yellow-800">Help/Guidance:</p>
                              <p className="text-sm text-yellow-700">{helpText}</p>
                            </div>
                          )}

                          {difficulty && (
                            <div className="mt-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  difficulty === "easy"
                                    ? "bg-green-100 text-green-800"
                                    : difficulty === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                              </span>
                            </div>
                          )}

                          <div className="mt-3 space-y-2">
                            {keywords && (
                              <div>
                                <span className="text-sm font-medium text-gray-600">Keywords: </span>
                                <span className="text-sm text-gray-500">{keywords}</span>
                              </div>
                            )}
                            {tags.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-gray-600">Tags: </span>
                                <span className="text-sm text-gray-500">{tags.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {questionType === "mcq" && options.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800">Answer Options:</h4>
                            {options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-3 border rounded-lg ${
                                  option.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                                  <span>{option.text || `Option ${index + 1}`}</span>
                                  {option.isCorrect && (
                                    <span className="text-green-600 text-xs font-medium">(Correct Answer)</span>
                                  )}
                                </div>

                                {option.explanation && (
                                  <div className="mt-2 ml-6 text-sm text-gray-600">
                                    <p className="font-medium">Explanation:</p>
                                    <p>{option.explanation}</p>
                                  </div>
                                )}

                                {(option.videoUrl || option.videoFile) && (
                                  <div className="mt-2 ml-6 text-sm text-blue-600">
                                    <p className="font-medium">📹 Video explanation available</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {questionType === "essay" && modalAnswer && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Model Answer:</h4>
                            <p className="text-gray-700">{modalAnswer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        No Question to Preview
                      </h3>
                      <p className="text-gray-500">Start editing your question to see the preview</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Assets Tab */}
            {activeTab === "assets" && (
              <Card title="Question Assets" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Manage Assets</h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Video Assets</h4>
                        {options.some((opt) => opt.videoFile || opt.videoUrl) ? (
                          <div className="space-y-3">
                            {options.map((option, index) => {
                              if (!option.videoFile && !option.videoUrl) return null;
                              return (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-gray-800">Option {index + 1} Video</p>
                                      <p className="text-sm text-gray-500">
                                        {option.videoFile
                                          ? `File: ${option.videoFile.name} (${(option.videoFile.size / (1024 * 1024)).toFixed(2)} MB)`
                                          : `URL: ${option.videoUrl}`}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {option.videoFile && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Uploaded</span>
                                      )}
                                      {option.videoUrl && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">URL</span>
                                      )}
                                    </div>
                                  </div>

                                  {option.videoFile && (
                                    <div className="mt-3">
                                      <video controls className="w-full max-w-md h-auto rounded-lg" preload="metadata">
                                        <source src={URL.createObjectURL(option.videoFile)} type={option.videoFile.type} />
                                        Your browser does not support the video tag.
                                      </video>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                            <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-gray-500">No video assets</p>
                            <p className="text-sm text-gray-400 mt-1">Add videos in the Editor under options</p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-3">Asset Summary</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#0F7490]">{options.filter((opt) => opt.videoFile).length}</div>
                            <div className="text-sm text-gray-600">Uploaded Files</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[#8B5CF6]">
                              {options.filter((opt) => opt.videoUrl && !opt.videoFile).length}
                            </div>
                            <div className="text-sm text-gray-600">Video URLs</div>
                          </div>
                        </div>

                        {options.some((opt) => opt.videoFile) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-700">
                                {(
                                  options
                                    .filter((opt) => opt.videoFile)
                                    .reduce((total, opt) => total + opt.videoFile.size, 0) / (1024 * 1024)
                                ).toFixed(2)}{" "}
                                MB
                              </div>
                              <div className="text-sm text-gray-600">Total Upload Size</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sticky top-0">
            <Card title="Question Settings" className="p-6">
              <div className="space-y-6">
                {/* Status select */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#202938]">Status</label>
                  <Select value={status} onChange={setStatus} options={STATUS_OPTIONS} style={{ width: "100%" }} />
                </div>

                {/* Points */}
                <Input label="Points" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="e.g., 5" />

                {/* Hint / Keywords */}
                <TextArea
                  label="Hint"
                  placeholder="Add a short hint to guide students (optional)..."
                  rows={2}
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                />
                <Input
                  label="Keywords"
                  placeholder="Enter keywords separated by commas (e.g., algebra, equations, slope)"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />

                {/* Tags multiselect */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#202938]">Tags</label>
                  <Select
                    mode="tags"
                    value={tags}
                    onChange={(vals) => setTags(vals)}
                    tokenSeparators={[","]}
                    placeholder="Select or type tags"
                    options={SUGGESTED_TAGS.map((t) => ({ value: t, label: t }))}
                    style={{ width: "100%" }}
                    maxTagCount="responsive"
                  />
                </div>

                <TextArea
                  label="Help / Guidance"
                  placeholder="Provide additional help or solution strategy (shown on request to students)..."
                  rows={3}
                  value={helpText}
                  onChange={(e) => setHelpText(e.target.value)}
                />

                {/* Difficulty */}
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-3" style={{ color: colors.text }}>
                    Difficulty Level
                  </label>
                  <div className="flex flex-col space-y-2">
                    {difficultyOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDifficulty(option.value)}
                        className={`p-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
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
            </Card>

            <div className="space-y-6 sticky top-0">
              <Card title="Quick Actions" className="p-6">
                <div className="space-y-3">
                  <Button onClick={() => setActiveTab("preview")} type="default" className="w-full justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Question
                  </Button>
                  <Button onClick={() => setActiveTab("assets")} type="secondary" className="w-full justify-start">
                    <FolderOpen className="w-4 h-4 mr-2" />
                    Manage Assets
                  </Button>
                </div>
              </Card>

              <Card title="Question Info" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">Type</span>
                    <span className="font-medium text-[#202938]">
                      {questionType === "mcq" ? "Multiple Choice" : questionType === "essay" ? "Essay" : "True/False"}
                    </span>
                  </div>

                  {questionType === "mcq" || questionType === "trueFalse" ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#202938]/60">Options</span>
                        <span className="font-medium text-[#202938]">{options.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#202938]/60">Correct Answer</span>
                        <span className="font-medium text-[#0F7490]">
                          {options.findIndex((opt) => opt.isCorrect) !== -1
                            ? `Option ${options.findIndex((opt) => opt.isCorrect) + 1}`
                            : "None Selected"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#202938]/60">With Explanations</span>
                        <span className="font-medium text-[#8B5CF6]">
                          {options.filter((opt) => (opt.explanation || "").trim()).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#202938]/60">With Videos</span>
                        <span className="font-medium text-[#C9AE6C]">
                          {options.filter((opt) => (opt.videoUrl || "").trim() || opt.videoFile).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#202938]/60">Video Files</span>
                        <span className="font-medium text-[#8B5CF6]">
                          {options.filter((opt) => opt.videoFile).length}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#202938]/60">Model Answer</span>
                      <span className="font-medium text-[#0F7490]">
                        {(modalAnswer || "").trim().length > 0 ? "Added" : "None"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">Has Hint</span>
                    <span className="font-medium text-[#202938]">{(hint || "").trim() ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">Keywords</span>
                    <span className="font-medium text-[#202938]">
                      {(keywords || "").trim() ? keywords.split(",").filter(Boolean).length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">Tags</span>
                    <span className="font-medium text-[#202938]">{tags.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">Has Help</span>
                    <span className="font-medium text-[#202938]">{(helpText || "").trim() ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#202938]/60">Characters</span>
                    <span className="font-medium text-[#202938]">{(question || "").length}</span>
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
                  <p className={`text-sm font-medium ${isFormValid ? "text-green-600" : "text-gray-500"}`}>
                    {isFormValid ? "Ready to Save" : "Fill Required Fields"}
                  </p>
                  <p className="text-xs text-[#202938]/50 mt-1">
                    {isFormValid
                      ? "All required fields completed"
                      : questionType === "mcq"
                      ? "Need question, options, and correct answer"
                      : "Need question and model answer"}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-between bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <Button type="text" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="default" onClick={() => message.info("You can autosave drafts here if needed.")}>
              Save Draft
            </Button>
          </div>
          <Button
            type="primary"
            size="large"
            disabled={!isFormValid || !!edit_question_loading || !!get_question_loading}
            onClick={handleSubmit}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {edit_question_loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Preview modal */}
      {questionType === "mcq" ? (
        <Modal
          footer={null}
          open={prevModal}
          className=" w-full  md:!w-[40%]"
          onCancel={() => setPrevModal(!prevModal)}
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Question Preview</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-800">{question || "Question text..."}</p>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${option.isCorrect ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span>{option.text || `Option ${index + 1}`}</span>
                      {option.isCorrect && <span className="text-green-600 text-xs">(Correct)</span>}
                    </div>

                    {option.explanation && (
                      <div className="mt-2 ml-6 text-sm text-gray-600">
                        <p className="mb-2">{option.explanation}</p>

                        {(option.videoUrl || option.videoFile) && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Video className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">
                                Video Explanation {option.videoFile && <span className="text-xs">(Uploaded File)</span>}
                              </span>
                            </div>

                            {option.videoFile ? (
                              <div className="max-w-md">
                                <video controls className="w-full h-auto rounded-lg" preload="metadata">
                                  <source src={URL.createObjectURL(option.videoFile)} type={option.videoFile.type} />
                                  Your browser does not support the video tag.
                                </video>
                                <p className="text-xs text-gray-500 mt-1">
                                  {option.videoFile.name} ({(option.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                                </p>
                              </div>
                            ) : (
                              option.videoUrl &&
                              (() => {
                                const embedUrl = getVideoEmbedUrl(option.videoUrl);
                                const isYouTube =
                                  option.videoUrl.includes("youtube.com") || option.videoUrl.includes("youtu.be");
                                if (isYouTube && embedUrl) {
                                  return (
                                    <div className="aspect-video max-w-md">
                                      <iframe
                                        src={embedUrl}
                                        className="w-full h-full rounded-lg"
                                        allowFullScreen
                                        title={`Video explanation for option ${index + 1}`}
                                      />
                                    </div>
                                  );
                                }
                                return (
                                  <div className="bg-gray-100 p-3 rounded-lg">
                                    <a
                                      href={option.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 underline text-sm"
                                    >
                                      Open Video Explanation
                                    </a>
                                  </div>
                                );
                              })()
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal footer={null} open={prevModal} className="!w-[40%]" onCancel={() => setPrevModal(!prevModal)}>
          <EssayPrev />
        </Modal>
      )}
    </div>
  );
}

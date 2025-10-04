"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Gauge,
  Layers,
  Type,
  BookOpen,
  Volume2,
  Quote,
  Languages,
  Eye,
  Sparkles,
  Trash2,
  PartyPopper,
  Copy,
  Check,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Info,
  BarChart3,
  Book,
} from "lucide-react";
import PageLayout from "../../../../../../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../../../../../../components/ui/BreadCrumbs";
import { subjects } from "../../../../../../../../../../data/subjects";
import { useParams } from "next/navigation";
import PagesHeader from "./../../../../../../../../../../components/ui/PagesHeader";
import { useDispatch, useSelector } from "react-redux";

export default function AddFlashcardPage() {
  // dispatch 
  const dispatch = useDispatch();
  const {create_flashcard_loading} = useSelector(state => state?.flashcards)
  const [formData, setFormData] = useState({
    difficulty: "",
    type: "",
    front: "",
    back: "",
    pronunciation: "",
    example: "",
    exampleTranslation: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // UI state
  const [activePreviewTab, setActivePreviewTab] = useState("front"); // front | back
  const [flipped, setFlipped] = useState(false);
  const [copiedKey, setCopiedKey] = useState(""); // front | back

  // Character limits (soft)
  const limits = {
    front: 160,
    back: 280,
    example: 180,
    exampleTranslation: 180,
    pronunciation: 60,
  };

  const difficultyOptions = [
    {
      value: "easy",
      label: "Easy",
      desc: "Basic recall or recognition",
      chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: <Gauge className="w-4 h-4" />,
      ring: "ring-2 ring-emerald-300",
      glowFrom: "from-emerald-400",
      glowTo: "to-emerald-600",
    },
    {
      value: "medium",
      label: "Medium",
      desc: "Understanding & application",
      chip: "bg-amber-50 text-amber-700 ring-amber-200",
      icon: <Gauge className="w-4 h-4" />,
      ring: "ring-2 ring-amber-300",
      glowFrom: "from-amber-400",
      glowTo: "to-amber-600",
    },
    {
      value: "hard",
      label: "Hard",
      desc: "Analysis & synthesis",
      chip: "bg-rose-50 text-rose-700 ring-rose-200",
      icon: <Gauge className="w-4 h-4" />,
      ring: "ring-2 ring-rose-300",
      glowFrom: "from-rose-400",
      glowTo: "to-rose-600",
    },
  ];

  const typeOptions = [
    {
      value: "MCQ",
      label: "Multiple Choice",
      desc: "Front = question, Back = explanation",
      icon: <Layers className="w-4 h-4" />,
      chip: "bg-blue-50 text-blue-700 ring-blue-200",
    },
    {
      value: "Definition",
      label: "Definition",
      desc: "Front = term, Back = definition",
      icon: <BookOpen className="w-4 h-4" />,
      chip: "bg-purple-50 text-purple-700 ring-purple-200",
    },
    {
      value: "Essay",
      label: "Essay",
      desc: "Open-ended response",
      icon: <Type className="w-4 h-4" />,
      chip: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    },
    {
      value: "True/False",
      label: "True / False",
      desc: "Binary reasoning",
      icon: <Check className="w-4 h-4" />,
      chip: "bg-teal-50 text-teal-700 ring-teal-200",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { id, unitId, topicId } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const selectedSubjectAndUnitWithTopic = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );
    const topic = unit?.topics.find(
      (topic) => topic.name == decodeURIComponent(topicId)
    );
    return { subject, unit, topic };
  }, [id, unitId, topicId]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required.";
    if (!formData.type) newErrors.type = "Type is required.";
    if (!formData.front.trim()) newErrors.front = "Front content is required.";
    if (!formData.back.trim()) newErrors.back = "Back content is required.";
    if (formData.example && !formData.exampleTranslation.trim()) {
      newErrors.exampleTranslation =
        "Provide a translation if you include an example.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =  () => {
    if (!validateForm()) return;
    console.log(formData)
    const data_send= {
    library_name: "USMLE Step 1 - Pathology",
    description: "Comprehensive pathology review for Step 1 exam preparation",
    difficulty_level: "hard",
    estimated_time: 45,
    status: "active"
}
    // setIsSubmitting(true);
    // await new Promise((r) => setTimeout(r, 1100)); // simulate API
    // setIsSubmitting(false);
    // setShowSuccess(true);
    // // reset form after success
    // setTimeout(() => {
    //   setFormData({
    //     difficulty: "",
    //     type: "",
    //     front: "",
    //     back: "",
    //     pronunciation: "",
    //     example: "",
    //     exampleTranslation: "",
    //   });
    //   setShowSuccess(false);
    // }, 1800);
  };

  const handleReset = () => {
    setFormData({
      difficulty: "",
      type: "",
      front: "",
      back: "",
      pronunciation: "",
      example: "",
      exampleTranslation: "",
    });
    setErrors({});
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formData, errors]);

  const softCountClass = (value, limit) => {
    if (!value) return "text-gray-400";
    const ratio = value.length / limit;
    if (ratio > 1) return "text-rose-600";
    if (ratio > 0.8) return "text-amber-600";
    return "text-gray-500";
  };

  const copy = async (key) => {
    try {
      const text =
        key === "front" ? formData.front : key === "back" ? formData.back : "";
      if (!text) return;
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(""), 1000);
    } catch {}
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "Falshcards", href: "#" },
    { label: "Create New Question", href: "#", current: true },
  ];

  return (
    <PageLayout className="mx-auto border border-red-500 py-8">
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      <PagesHeader
        title={"Create New Flashcard"}
        subtitle={"Fill the fields — preview updates live on thright."}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FORM */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
    
            <div className="p-8 space-y-8">
              {/* Difficulty & Type */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Difficulty */}
                <div>
                  <label className=" text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    Difficulty Level *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {difficultyOptions.map((o) => {
                      const active = formData.difficulty === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() =>
                            handleInputChange("difficulty", o.value)
                          }
                          className={`text-left w-full rounded-xl border-2 p-4 transition-all flex items-center gap-3 ${
                            active
                              ? `${o.ring} bg-white`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`shrink-0 w-9 h-9 rounded-lg grid place-items-center text-white bg-gradient-to-br ${o.glowFrom} ${o.glowTo}`}
                          >
                            {o.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{o.label}</div>
                            <div className="text-xs text-gray-500">
                              {o.desc}
                            </div>
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full ring-1 ${o.chip}`}
                          >
                            {o.value}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.difficulty && (
                    <p className="text-rose-600 text-sm mt-2">
                      {errors.difficulty}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <label className=" text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Card Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {typeOptions.map((o) => {
                      const active = formData.type === o.value;
                      return (
                        <button
                          key={o.value}
                          type="button"
                          onClick={() => handleInputChange("type", o.value)}
                          className={`text-left w-full rounded-xl border-2 p-4 transition-all flex items-center gap-3 ${
                            active
                              ? "ring-2 ring-blue-300 bg-white"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="shrink-0 w-9 h-9 rounded-lg grid place-items-center text-white bg-gradient-to-br from-blue-500 to-blue-700">
                            {o.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{o.label}</div>
                            <div className="text-xs text-gray-500">
                              {o.desc}
                            </div>
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full ring-1 ${o.chip}`}
                          >
                            {o.value}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errors.type && (
                    <p className="text-rose-600 text-sm mt-2">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Front */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Front Content *
                  </label>
                  <span
                    className={`text-xs ${softCountClass(
                      formData.front,
                      limits.front
                    )}`}
                  >
                    {formData.front.length}/{limits.front}
                  </span>
                </div>
                <textarea
                  value={formData.front}
                  onChange={(e) => handleInputChange("front", e.target.value)}
                  rows={3}
                  maxLength={400}
                  className={`w-full p-4 border-2 rounded-xl transition-all resize-none focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 ${
                    errors.front ? "border-rose-300" : "border-gray-300"
                  }`}
                  placeholder="Enter the question or term for the front of the card…"
                />
                {errors.front && (
                  <p className="text-rose-600 text-sm mt-2">{errors.front}</p>
                )}
              </div>

              {/* Back */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Back Content *
                  </label>
                  <span
                    className={`text-xs ${softCountClass(
                      formData.back,
                      limits.back
                    )}`}
                  >
                    {formData.back.length}/{limits.back}
                  </span>
                </div>
                <textarea
                  value={formData.back}
                  onChange={(e) => handleInputChange("back", e.target.value)}
                  rows={4}
                  maxLength={600}
                  className={`w-full p-4 border-2 rounded-xl transition-all resize-none focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 ${
                    errors.back ? "border-rose-300" : "border-gray-300"
                  }`}
                  placeholder="Enter the answer or definition for the back of the card…"
                />
                {errors.back && (
                  <p className="text-rose-600 text-sm mt-2">{errors.back}</p>
                )}
              </div>

              {/* Pronunciation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Pronunciation{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <span
                    className={`text-xs ${softCountClass(
                      formData.pronunciation,
                      limits.pronunciation
                    )}`}
                  >
                    {formData.pronunciation.length}/{limits.pronunciation}
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.pronunciation}
                  onChange={(e) =>
                    handleInputChange("pronunciation", e.target.value)
                  }
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                  placeholder="e.g., pay-shunt"
                />
              </div>

              {/* Example */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Quote className="w-4 h-4" />
                  Example{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={formData.example}
                  onChange={(e) => handleInputChange("example", e.target.value)}
                  rows={2}
                  maxLength={400}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none"
                  placeholder="Enter an example sentence or usage…"
                />
              </div>

              {/* Example Translation */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Example Translation{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={formData.exampleTranslation}
                  onChange={(e) =>
                    handleInputChange("exampleTranslation", e.target.value)
                  }
                  rows={2}
                  maxLength={400}
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none ${
                    errors.exampleTranslation
                      ? "border-rose-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter the translation of the example…"
                />
                {errors.exampleTranslation && (
                  <p className="text-rose-600 text-sm mt-2">
                    {errors.exampleTranslation}
                  </p>
                )}
              </div>
            </div>

            {/* sticky action bar */}
            <div className="px-8 pb-6 pt-4 border-t border-gray-100 sticky bottom-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>
                    Tip:{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded">
                      Ctrl/⌘ + Enter
                    </kbd>{" "}
                    to submit,{" "}
                    <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd>{" "}
                    to reset.
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {isSubmitting ? "Creating…" : "Create Flashcard"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="space-y-6 sticky top-0 max-h-[calc(100vh-2rem)] overflow-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 sticky top-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
            {/* preview header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-800">
                  Live Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFlipped((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Flip
                </button>
                <div className="text-xs text-gray-500 hidden md:block">
                  Front / Back • Tabs below
                </div>
              </div>
            </div>

            {/* meta chips */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {formData.type && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ring-1 ring-blue-200 bg-blue-50 text-blue-700">
                  <Layers className="w-3.5 h-3.5" />
                  {formData.type}
                </span>
              )}
              {formData.difficulty && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ring-1 ring-purple-200 bg-purple-50 text-purple-700 capitalize">
                  <Gauge className="w-3.5 h-3.5" />
                  {formData.difficulty}
                </span>
              )}
              {formData.pronunciation && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ring-1 ring-emerald-200 bg-emerald-50 text-emerald-700">
                  <Volume2 className="w-3.5 h-3.5" />
                  {formData.pronunciation}
                </span>
              )}
            </div>

            {/* tabs */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setActivePreviewTab("front");
                  setFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  activePreviewTab === "front"
                    ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePreviewTab("back");
                  setFlipped(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  activePreviewTab === "back"
                    ? "border-teal-200 bg-teal-50 text-teal-700"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                Back
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copy(activePreviewTab)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                >
                  {copiedKey === activePreviewTab ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3D card */}
            {formData.front || formData.back ? (
              <div className="relative h-80 md:h-96 perspective-1500">
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                    flipped ? "rotate-y-180" : ""
                  }`}
                >
                  {/* front */}
                  <div className="absolute inset-0 backface-hidden">
                    <div className="w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-6 md:p-8 text-white flex flex-col">
                      <div className="flex-1 grid place-items-center text-center">
                        <div className="max-w-[90%]">
                          <div className="text-2xl md:text-3xl font-bold leading-snug">
                            {formData.front ||
                              "Front content will appear here…"}
                          </div>
                          {formData.pronunciation && (
                            <div className="mt-3 text-indigo-100 text-sm">
                              {formData.pronunciation}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs opacity-90">
                        <span className="inline-flex items-center gap-1">
                          <ChevronRight className="w-3.5 h-3.5" />
                          Click Flip to view answer
                        </span>
                        <span>{formData.type || "Type"}</span>
                      </div>
                    </div>
                  </div>

                  {/* back */}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden">
                    <div className="w-full h-full rounded-2xl shadow-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-6 md:p-8 text-white flex flex-col">
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xl md:text-2xl font-bold">
                          {formData.back || "Back content will appear here…"}
                        </div>
                        {formData.example && (
                          <div className="mt-4 p-3 rounded-lg bg-white/10">
                            <div className="text-xs font-medium mb-1 opacity-90">
                              Example
                            </div>
                            <div className="text-sm">{formData.example}</div>
                          </div>
                        )}
                        {formData.exampleTranslation && (
                          <div className="mt-3 p-3 rounded-lg bg-white/10">
                            <div className="text-xs font-medium mb-1 opacity-90">
                              Translation
                            </div>
                            <div className="text-sm">
                              {formData.exampleTranslation}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs opacity-90">
                        <span className="inline-flex items-center gap-1">
                          <ChevronLeft className="w-3.5 h-3.5" />
                          Flip to go back
                        </span>
                        <span className="capitalize">
                          {formData.difficulty || "difficulty"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-3">🃏</div>
                Start filling the form to see your flashcard preview
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            <PartyPopper className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Your flashcard has been created successfully.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      )}

      {/* local styles for 3D */}
      <style jsx>{`
        .perspective-1500 {
          perspective: 1500px;
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
      `}</style>
    </PageLayout>
  );
}

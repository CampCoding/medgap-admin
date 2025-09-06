import React from "react";
import {
  BookOpen,
  Calendar,
  Edit3,
  HelpCircle,
  Settings,
  Trash2,
  TrendingUp,
  Layers,
  Library, // 🆕 for Flashcards
} from "lucide-react";
import Link from "next/link";
import { Button } from "antd";
import { useSearchParams } from "next/navigation";
import { isTopicActive } from "../../../utils/topicsUtils";

const TopicCard = ({ topic, onDeleteTopic = () => null }) => {
  const searchParams = useSearchParams();

  const questionsCount =
    topic?.questions ??
    (Array.isArray(topic?.questions) ? topic.questions.length : 0);

  const flashcardsCount =
    topic?.flashcards ??
    (Array.isArray(topic?.flashcards) ? topic.flashcards.length : 0);

  const digitalLibraryCount =
    topic?.digital_library ??
    (Array.isArray(topic?.digital_library) ? topic.digital_library.length : 0);

  const flashcardsDelta = topic?.stats?.flashcardsDelta;

  // Determine if topic is active using utility function
  const topicIsActive = isTopicActive(topic);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer ${
        topicIsActive ? "ring-2 ring-green-200" : ""
      }`}
      style={{ backgroundColor: "white" }}
    >
      {/* Gradient Background Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-opacity-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 116, 144, 0.02) 0%, rgba(139, 92, 246, 0.05) 100%)",
        }}
      />
      {/* Decorative Elements */}
      <div
        className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{ backgroundColor: "#8B5CF6" }}
      />
      <div
        className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-300"
        style={{ backgroundColor: "#0F7490" }}
      />

      {/* Content */}
      <div className="relative p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div
              className="p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: "#0F7490" }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ color: "#202938" }}
              >
                {topic.name}
              </h2>
              {/* Status Badge */}
              <div className="flex items-center mt-1">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    topicIsActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      topicIsActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {topicIsActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Questions */}
          <div className="group/stat">
            <Link
              href={{
                pathname: `topics/${topic.name}/questions`,
                query: { subject: searchParams.get("subject") },
              }}
              className="block text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 cursor-pointer"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.02)",
                borderColor: "#8B5CF6",
              }}
            >
              <div className="mb-3">
                <span
                  className="text-4xl font-bold bg-gradient-to-r from-current to-opacity-80 bg-clip-text"
                  style={{ color: "#8B5CF6" }}
                >
                  {questionsCount}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <HelpCircle
                  className="w-4 h-4 opacity-60"
                  style={{ color: "#8B5CF6" }}
                />
                <span
                  className="text-sm font-medium opacity-70"
                  style={{ color: "#202938" }}
                >
                  Questions
                </span>
              </div>
            </Link>
          </div>

          {/* 🆕 Flashcards */}
          <div className="group/stat">
            <Link
              href={{
                pathname: `topics/${topic.name}/flashcards`,
                query: { subject: searchParams.get("subject") },
              }}
              aria-label="Open flashcards"
              className="block text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#0F7490]/40 cursor-pointer"
              style={{
                backgroundColor: "rgba(15, 116, 144, 0.04)",
                borderColor: "#0F7490",
              }}
            >
              <div className="mb-3">
                <span
                  className="text-4xl font-bold bg-gradient-to-r from-current to-opacity-80 bg-clip-text"
                  style={{ color: "#0F7490" }}
                >
                  {flashcardsCount}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Layers
                  className="w-4 h-4 opacity-70"
                  style={{ color: "#0F7490" }}
                />
                <span
                  className="text-sm font-medium opacity-70"
                  style={{ color: "#202938" }}
                >
                  Flashcards
                </span>
                {typeof flashcardsDelta === "number" && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#0F7490]/10 text-[#0F7490]">
                    <TrendingUp className="w-3 h-3" />
                    {flashcardsDelta > 0
                      ? `+${flashcardsDelta}%`
                      : `${flashcardsDelta}%`}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Digital Library */}
          <div className="group/stat col-span-2">
            <Link
              href={{
                pathname: `topics/${topic.name}/digital-library`,
                query: { subject: searchParams.get("subject") },
              }}
              aria-label="Open digital library"
              className="block text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 cursor-pointer"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.02)",
                borderColor: "#8B5CF6",
              }}
            >
              <div className="mb-3">
                <span
                  className="text-4xl font-bold bg-gradient-to-r from-current to-opacity-80 bg-clip-text"
                  style={{ color: "#8B5CF6" }}
                >
                  {digitalLibraryCount}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Library
                  className="w-4 h-4 opacity-60"
                  style={{ color: "#8B5CF6" }}
                />
                <span
                  className="text-sm font-medium opacity-70"
                  style={{ color: "#202938" }}
                >
                  Digital Library
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Calendar className="w-3 h-3" />
            <span>{topic.lastUpdated}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              type="text"
              size="small"
              className="text-[#0F7490] hover:bg-[#0F7490]/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              type="text"
              size="small"
              className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              onClick={(e) => onDeleteTopic(e, topic)}
              type="text"
              size="small"
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;

"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Calendar,
  Edit3,
  HelpCircle,
  Library,
  Layers,
  TrendingUp,
  MoreHorizontal,
  Info,
  Copy,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button, Dropdown } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import EditTopicForm from "../../Topics/EditNewTopicModal";

function TopicCard({
  unitId,
  topic,
  id,
  onDeleteTopic = () => null,
  onEdited = () => null,
  onDuplicate = () => null, // will open modal in parent
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const questionsCount = Number(topic?.questions_count ?? 0);
  const flashcardsCount = Number(topic?.flashcards_count ?? 0);
  const digitalLibraryCount = Number(topic?.library_files_count ?? 0);
  const flashcardsDelta =
    typeof topic?.stats?.flashcardsDelta === "number"
      ? topic.stats.flashcardsDelta
      : null;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);

  const openEdit = () => {
    setEditingTopic(topic);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingTopic(null);
  };

  const updatedAt = topic?.updated_at ? new Date(topic.updated_at) : null;
  const topicName = topic?.name ?? topic?.topic_name ?? "";

  const menuItems = [
    {
      key: "details",
      label: (
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4" />
          <span>Details</span>
        </div>
      ),
      onClick: () =>
        router.push(`/subjects/${id}/units/${unitId}/topics/${topic?.id}`),
    },
    {
      key: "duplicate",
      label: (
        <div className="flex items-center gap-2">
          <Copy className="w-4 h-4" />
          <span>Duplicate</span>
        </div>
      ),
      onClick: () => onDuplicate(topic), // ← opens modal in parent
    },
    { type: "divider" },
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer ${
        topic?.status === "active" ? "ring-2 ring-green-200" : ""
      }`}
      style={{ backgroundColor: "white" }}
    >
      {/* BG */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-opacity-5"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 116, 144, 0.02) 0%, rgba(139, 92, 246, 0.05) 100%)",
        }}
      />
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
                {topicName}
              </h2>
              <div className="flex items-center mt-1">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    topic?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      topic?.status === "active"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  {topic?.status || "unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions dropdown */}
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              className="hover:bg-gray-50"
              aria-label="More actions"
              icon={<MoreHorizontal className="w-5 h-5" />}
            />
          </Dropdown>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Questions */}
          <div className="group/stat">
            <Link
              href={{
                pathname: `topics/${topic?.id}/questions`,
                query: { subject: searchParams.get("subject") ?? undefined },
              }}
              className="block text-center p-6 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40 cursor-pointer"
              style={{
                backgroundColor: "rgba(139, 92, 246, 0.02)",
                borderColor: "#8B5CF6",
              }}
            >
              <div className="mb-3">
                <span
                  className="text-4xl font-bold"
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

          {/* Flashcards */}
          <div className="group/stat">
            <Link
              href={{
                pathname: `topics/${topic?.id}/flashcards`,
                query: { subject: searchParams.get("subject") ?? undefined },
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
                  className="text-4xl font-bold"
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
                {flashcardsDelta !== null && (
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
          {/* <div className="group/stat col-span-2">
            <Link
              href={{
                pathname: `topics/${topic?.id}/digital-library`,
                query: { subject: searchParams.get("subject") ?? undefined },
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
                  className="text-4xl font-bold"
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
          </div> */}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Calendar className="w-3 h-3" />
            <span>{updatedAt ? updatedAt.toLocaleString() : "—"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              onClick={openEdit}
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

      {/* Edit Modal */}
      <EditTopicForm
        open={isEditOpen}
        topic={editingTopic}
        defaultUnitId={unitId}
        onCancel={closeEdit}
        onSuccess={() => {
          closeEdit();
          onEdited();
        }}
      />
    </div>
  );
}

export default TopicCard;

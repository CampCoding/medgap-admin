"use client";

import React from "react";
import {
  BookOpen,
  Calendar,
  Edit3,
  FileText,
  HelpCircle,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Button from "../../atoms/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { Dropdown } from "antd";

const UnitCard = ({
  unit,
  moduleId, // required to build absolute URLs
  onDeleteClick = () => null,
  onEditClick, // optional: open edit modal instead of routing
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const qs = (() => {
    const subject = searchParams.get("subject");
    return subject ? `?subject=${encodeURIComponent(subject)}` : "";
  })();

  // Build absolute URLs consistently and preserve ?subject=
  const to = (suffix) => `/subjects/${moduleId}/units/${unit?.id}/${suffix}${qs}`;
  const toTopics = () => to("topics");
  const toQuestions = () => to("questions");
  const toFlashcards = () => to("flashcards");
  const toDigital = () => to(`digital-library`);

  const topicsArr = unit?.topics ?? [];
  const digitalCount = topicsArr.reduce((sum, t) => sum + (t.digital_library || 0), 0);
  const flashcardsCount = topicsArr.reduce((sum, t) => sum + (t.flashcards || 0), 0);
  const topicsCount = unit?.topics_count ?? topicsArr.length;

  const menu = {
    items: [
      { key: "topics",     label: "Topics",     icon: <BookOpen size={14} /> },
      // { key: "questions",  label: "Questions",  icon: <HelpCircle size={14} /> },
      { key: "digital_library", label: "Digital Library", icon: <FileText size={14} /> },
      { type: "divider" },
      { key: "edit",       label: "Edit",       icon: <Edit3 size={14} /> },
      { key: "delete",     label: "Delete",     icon: <Trash2 size={14} />, danger: true },
    ],
    onClick: ({ key }) => {
      if (key === "topics")     return router.push(toTopics());
      // if (key === "questions")  return router.push(toQuestions());
      if (key === "digital_library") return router.push(toDigital());
      if (key === "edit") {
        if (onEditClick) return onEditClick(unit);
        return router.push(to("edit"));
      }
      if (key === "delete")     return onDeleteClick(null, unit);
    },
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group cursor-pointer"
      style={{ backgroundColor: "white" }}
      role="link"
      tabIndex={0}
      // onClick={() => router.push(toTopics())}
      // onKeyDown={(e) => e.key === "Enter" && router.push(toTopics())}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-opacity-5"
        style={{ background: "linear-gradient(135deg, rgba(15, 116, 144, 0.02) 0%, rgba(139, 92, 246, 0.05) 100%)" }}
      />
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: "#8B5CF6" }} />
      <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full opacity-5 group-hover:opacity-15 transition-opacity duration-300" style={{ backgroundColor: "#0F7490" }} />

      {/* Content */}
      <div className="relative p-8">
        {/* Header (clicking anywhere still goes to Topics via parent onClick) */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: "#0F7490" }}>
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#202938" }}>
                {unit?.name}
              </h2>
              <p className="text-slate-400">{unit?.description}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Topics */}
          <div className="group/stat">
            <div
              className="text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10"
              style={{ backgroundColor: "rgba(15, 116, 144, 0.02)", borderColor: "#0F7490" }}
            >
              <div className="mb-2">
                <span className="text-3xl font-bold" style={{ color: "#0F7490" }}>
                  {topicsCount}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <BookOpen className="w-3 h-3 opacity-60" style={{ color: "#0F7490" }} />
                <span className="text-xs font-medium opacity-70" style={{ color: "#202938" }}>
                  Topics
                </span>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="group/stat">
            <div
              className="text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.02)", borderColor: "#8B5CF6" }}
            >
              <div className="mb-2">
                <span className="text-3xl font-bold" style={{ color: "#8B5CF6" }}>
                  {unit?.questions ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <HelpCircle className="w-3 h-3 opacity-60" style={{ color: "#8B5CF6" }} />
                <span className="text-xs font-medium opacity-70" style={{ color: "#202938" }}>
                  Questions
                </span>
              </div>
            </div>
          </div>

          {/* Digital Library (FULL-WIDTH) */}
          <div className="group/stat col-span-2">
            <button
              type="button"
              className="w-full text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.02)", borderColor: "#22C55E" }}
              onClick={(e) => {
                e.stopPropagation(); // prevent parent card navigation
                router.push(toDigital());
              }}
            >
              <div className="mb-2">
                <span className="text-3xl font-bold" style={{ color: "#22C55E" }}>
                  {digitalCount}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <BookOpen className="w-3 h-3 opacity-60" style={{ color: "#22C55E" }} />
                <span className="text-xs font-medium opacity-70" style={{ color: "#202938" }}>
                  Digital
                </span>
              </div>
            </button>
          </div>

          {/* Flashcards (render only if any) */}
          {flashcardsCount > 0 && (
            <div className="group/stat">
              <div
                className="text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-opacity-10"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.02)", borderColor: "#F59E0B" }}
              >
                <div className="mb-2">
                  <span className="text-3xl font-bold" style={{ color: "#F59E0B" }}>
                    {flashcardsCount}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <FileText className="w-3 h-3 opacity-60" style={{ color: "#F59E0B" }} />
                  <span className="text-xs font-medium opacity-70" style={{ color: "#202938" }}>
                    Cards
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Calendar className="w-3 h-3" />
            <span>{unit?.lastUpdated ? new Date(unit.lastUpdated).toLocaleString() : "—"}</span>
          </div>

          <Dropdown trigger={["click"]} placement="bottomRight" menu={menu}>
            <Button type="text" size="small" className="hover:bg-gray-100" title="More">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;

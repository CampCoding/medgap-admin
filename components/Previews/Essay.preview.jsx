"use client";

import React from "react";
import { Eye, FileText, Calendar, User } from "lucide-react";

/**
 * Props:
 * - questionData (from API), e.g.:
 *   {
 *     question_text, model_answer, hint, help_guidance,
 *     tags:[], keywords:[], difficulty_level, points,
 *     topic_name, usage_count, created_at, updated_at, status
 *   }
 */
export default function EssayPrev({ questionData }) {
  const q = questionData || {};

  const tagList = Array.isArray(q.tags) ? q.tags : [];
  const keywordList = Array.isArray(q.keywords) ? q.keywords : [];

  const createdAt = q.created_at ? new Date(q.created_at).toLocaleString() : "—";
  const updatedAt = q.updated_at ? new Date(q.updated_at).toLocaleString() : "—";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
              Essay
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                q.difficulty_level === "easy"
                  ? "bg-green-100 text-green-700"
                  : q.difficulty_level === "hard"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {q.difficulty_level
                ? q.difficulty_level[0].toUpperCase() + q.difficulty_level.slice(1)
                : "—"}
            </span>
            {q.points != null && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {q.points} pt{q.points === 1 ? "" : "s"}
              </span>
            )}
            {q.status && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                {q.status}
              </span>
            )}
          </div>
        </div>

        {/* Question text */}
        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed mb-3">
          {q.question_text || "—"}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          {q.topic_name && (
            <span className="inline-flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {q.topic_name}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {q.usage_count ?? 0} uses
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Created {createdAt}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Updated {updatedAt}
          </span>
          {q.created_by_name && (
            <span className="inline-flex items-center gap-1">
              <User className="w-4 h-4" />
              {q.created_by_name}
            </span>
          )}
        </div>

        {/* Tags & keywords */}
        {(tagList.length > 0 || keywordList.length > 0) && (
          <div className="mb-4">
            {tagList.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {tagList.map((t, i) => (
                  <span
                    key={`tag-${i}`}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs border border-purple-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {keywordList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywordList.map((k, i) => (
                  <span
                    key={`kw-${i}`}
                    className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs border border-yellow-100"
                  >
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Model answer */}
        {q.model_answer && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Model Answer:</h4>
            <pre className="whitespace-pre-wrap text-gray-800 text-sm">
              {q.model_answer}
            </pre>
          </div>
        )}

        {/* Hint / Help guidance */}
        {(q.hint || q.help_guidance) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {q.hint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-blue-700 font-semibold text-sm mb-1">
                  Hint
                </div>
                <p className="text-blue-900 text-sm">{q.hint}</p>
              </div>
            )}
            {q.help_guidance && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="text-emerald-700 font-semibold text-sm mb-1">
                  Help
                </div>
                <p className="text-emerald-900 text-sm">{q.help_guidance}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

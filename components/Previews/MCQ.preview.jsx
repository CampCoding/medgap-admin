"use client";

import React, { useMemo } from "react";
import { Eye, FileText, Calendar, User, CheckCircle } from "lucide-react";

/**
 * MCQPrev
 * Robust to different option shapes:
 * - options: string[] OR { option_text|text|label|value, is_correct|correct|isCorrect|is_right_answer }
 * - correct_option_index (number) or correctAnswer index
 * - acceptance_rate as string ("0.00")
 */
export default function MCQPrev({ questionData }) {
  const q = questionData || {};

  // Normalize options
  const normalized = useMemo(() => {
    const rawOptions =
      (Array.isArray(q.options) && q.options) ||
      (Array.isArray(q.choices) && q.choices) ||
      [];

    const getText = (opt, idx) =>
      typeof opt === "string"
        ? opt
        : opt?.option_text ??
          opt?.text ??
          opt?.label ??
          opt?.value ??
          `Option ${idx + 1}`;

    const getCorrectFlag = (opt) =>
      typeof opt === "object"
        ? Boolean(
            opt?.is_correct ?? opt?.correct ?? opt?.isCorrect ?? opt?.is_right_answer
          )
        : false;

    let list = rawOptions.map((opt, idx) => ({
      text: getText(opt, idx),
      correct: getCorrectFlag(opt),
    }));

    // If backend provides a correct index instead of flags
    const idxFromData =
      Number.isInteger(q.correct_option_index) ? q.correct_option_index
      : Number.isInteger(q.correctAnswer) ? q.correctAnswer
      : null;

    if (idxFromData != null && list[idxFromData]) {
      list = list.map((o, i) => ({ ...o, correct: i === idxFromData }));
    }

    return list;
  }, [q]);

  const createdAt = q.created_at ? new Date(q.created_at).toLocaleString() : "—";
  const updatedAt = q.updated_at ? new Date(q.updated_at).toLocaleString() : "—";

  const isRTL = useMemo(() => /[\u0600-\u06FF]/.test(q?.question_text || ""), [q]);

  return (
    <div className="max-w-3xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              MCQ
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
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
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
        <h3 className="text-lg font-semibold text-gray-900 leading-relaxed mb-4">
          {q.question_text || "—"}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-5">
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

        {/* Options */}
        <div className="space-y-2">
          {normalized.length === 0 ? (
            <div className="p-3 rounded-md bg-gray-50 border text-sm text-gray-600">
              لا توجد اختيارات متاحة / No options available
            </div>
          ) : (
            normalized.map((o, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  o.correct
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="mt-0.5">
                  {o.correct ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="block w-4 h-4 rounded-full border border-gray-300" />
                  )}
                </div>
                <div className="text-gray-900">{o.text}</div>
              </div>
            ))
          )}
        </div>

        {/* Hint / Help guidance / Tags / Keywords */}
        {(q.hint || q.help_guidance || (q.tags && q.tags.length) || (q.keywords && q.keywords.length)) && (
          <div className="mt-4 space-y-3">
            {(q.hint || q.help_guidance) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.hint && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-blue-700 font-semibold text-sm mb-1">Hint</div>
                    <p className="text-blue-900 text-sm">{q.hint}</p>
                  </div>
                )}
                {q.help_guidance && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="text-emerald-700 font-semibold text-sm mb-1">Help</div>
                    <p className="text-emerald-900 text-sm">{q.help_guidance}</p>
                  </div>
                )}
              </div>
            )}

            {(Array.isArray(q.tags) && q.tags.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {q.tags.map((t, i) => (
                  <span
                    key={`tag-${i}`}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs border border-purple-100"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {(Array.isArray(q.keywords) && q.keywords.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {q.keywords.map((k, i) => (
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
      </div>
    </div>
  );
}

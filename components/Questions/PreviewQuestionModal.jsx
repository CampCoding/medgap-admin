"use client";

import React, { useEffect, useMemo } from "react";
import { Modal, Button as AntdButton, Spin } from "antd";
import MCQPrev from "../../components/Previews/MCQ.preview";
import EssayPrev from "../../components/Previews/Essay.preview";
import { useDispatch, useSelector } from "react-redux";
import { handleGetQuestionDetails } from "../../features/questionsSlice";

/**
 * Props:
 * - selectedQuestion: { id, question_id?, originalData? }
 * - prevModal: boolean
 * - setPrevModal: fn
 */
export default function PreviewQuestionModal({
  selectedQuestion,
  prevModal,
  setPrevModal,
}) {
  const dispatch = useDispatch();
  const {
    question_details_loading,
    question_details_list,
    question_details_error,
  } = useSelector((state) => state?.questions || {});

  // Fetch details only when modal opens and we have an id
  useEffect(() => {
    const id = selectedQuestion?.id || selectedQuestion?.question_id;
    if (prevModal && id) {
      dispatch(handleGetQuestionDetails(id));
    }
  }, [dispatch, prevModal, selectedQuestion?.id, selectedQuestion?.question_id]);

  // Merge: prefer detailed payload; fall back to original card data
  const mergedQuestion = useMemo(() => {
    return (
      question_details_list?.data?.question ||
      selectedQuestion?.originalData ||
      null
    );
  }, [question_details_list?.data?.question, selectedQuestion?.originalData]);

  // Normalize type and detect choice-like questions
  const normalizedType = String(
    mergedQuestion?.question_type ||
      selectedQuestion?.originalData?.question_type ||
      ""
  ).toLowerCase();

  const isChoiceLike =
    normalizedType === "multiple_choice" || normalizedType === "true_false";

  // If server ever returns true_false without options, synthesize T/F
  const normalizedQuestion = useMemo(() => {
    if (!mergedQuestion) return mergedQuestion;

    if (normalizedType === "true_false") {
      const opts = Array.isArray(mergedQuestion.options)
        ? mergedQuestion.options
        : [];
      if (opts.length === 0) {
        // synthesize standard TF; neither marked correct (preview only)
        return {
          ...mergedQuestion,
          options: [
            { option_text: "True", is_correct: false },
            { option_text: "False", is_correct: false },
          ],
        };
      }
    }
    return mergedQuestion;
  }, [mergedQuestion, normalizedType]);

  // Simple RTL detection (Arabic ranges)
  const isRTL = useMemo(() => {
    const t =
      normalizedQuestion?.question_text ||
      selectedQuestion?.originalData?.question_text ||
      "";
    return /[\u0600-\u06FF]/.test(t);
  }, [normalizedQuestion, selectedQuestion]);

  return (
    <Modal
      open={prevModal}
      className="!w-[42%]"
      onCancel={() => setPrevModal(false)}
      footer={[
        <AntdButton key="close" onClick={() => setPrevModal(false)}>
          Close
        </AntdButton>,
      ]}
      destroyOnClose
    >
      {/* Loading */}
      {question_details_loading && (
        <div className="py-10 flex items-center justify-center">
          <Spin />
        </div>
      )}

      {/* Error */}
      {!question_details_loading && question_details_error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {String(question_details_error) || "Failed to load question details."}
        </div>
      )}

      {/* Content */}
      {!question_details_loading &&
        !question_details_error &&
        normalizedQuestion && (
          <div dir={isRTL ? "rtl" : "ltr"}>
            {isChoiceLike ? (
              <MCQPrev questionData={normalizedQuestion} />
            ) : (
              <EssayPrev questionData={normalizedQuestion} />
            )}

            {/* Meta from details */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-gray-500">Status</div>
                <div className="font-medium">
                  {normalizedQuestion?.status || "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-gray-500">Difficulty</div>
                <div className="font-medium">
                  {normalizedQuestion?.difficulty_level || "—"}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-gray-500">Usage Count</div>
                <div className="font-medium">
                  {normalizedQuestion?.usage_count ?? 0}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 border">
                <div className="text-gray-500">Acceptance Rate</div>
                <div className="font-medium">
                  {(normalizedQuestion?.acceptance_rate ?? "0.00") + "%"}
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Empty fallback */}
      {!question_details_loading &&
        !normalizedQuestion &&
        !question_details_error && (
          <div className="py-10 text-center text-gray-500">
            No data to preview.
          </div>
        )}
    </Modal>
  );
}

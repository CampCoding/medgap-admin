"use client";
import { Modal } from 'antd'
import React from 'react'
import { handleDuplicateQuestion, handleGetAllQuestions } from '../../features/questionsSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

export default function DuplicateQuestionModal({dupOpen,topicId , dupTarget  ,dupLoading, closeDuplicateModal , setDupLoading }) {
   const dispatch = useDispatch();

   const submitDuplicate = () => {
      if (!dupTarget) return;
      setDupLoading(true);
      dispatch(handleDuplicateQuestion(dupTarget?.question_id))
        .unwrap()
        .then((res) => {
          if (res?.status === "success") {
            toast.success(res?.message || "Question duplicated");
            dispatch(handleGetAllQuestions({ topic_id: topicId }));
            closeDuplicateModal();
          } else {
            toast.error(res?.message || "Failed to duplicate question");
            setDupLoading(false);
          }
        })
        .catch(() => {
          toast.error("An error occurred while duplicating the question");
          setDupLoading(false);
        });
    };

  return (
    <Modal
        title="Duplicate Question"
        open={dupOpen}
        onOk={submitDuplicate}
        onCancel={closeDuplicateModal}
        okText={dupLoading ? "Duplicating..." : "Duplicate"}
        okButtonProps={{ loading: dupLoading, className: "!bg-blue-500 text-white" }}
        destroyOnClose
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">
              Are you sure you want to duplicate this question?
            </p>
            <div className="p-3 rounded-md bg-gray-50 text-sm text-gray-800 border border-gray-200">
              {dupTarget?.question_text || "—"}
            </div>
          </div>
        </div>
      </Modal>
  )
}

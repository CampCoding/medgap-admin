"use client";

import React, { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  Copy,
  MoreVertical,
  Tag,
  Clock,
  User,
  BarChart3,
  Book,
  Currency,
  AlertTriangle,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../../../../../components/ui/BreadCrumbs";
import { subjects } from "../../../../../../../../../data/subjects";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../../../../../../../../../components/atoms/Button";
import Input from "../../../../../../../../../components/atoms/Input";
import Card from "../../../../../../../../../components/atoms/Card";
import Badge from "../../../../../../../../../components/atoms/Badge";
import Select from "../../../../../../../../../components/atoms/Select";
import PagesHeader from "./../../../../../../../../../components/ui/PagesHeader";
import QuestionsSearchAndFilters from "../../../../../../../../../components/Questions/QuestionsSearchAndFilters";
import QuestionCard from "../../../../../../../../../components/ui/Cards/QuestionCard";
import { Modal } from "antd";
import MCQPrev from "../../../../../../../../../components/Previews/MCQ.preview";
import classNames from "classnames";
import EssayPrev from "../../../../../../../../../components/Previews/Essay.preview";
import CustomModal from "../../../../../../../../../components/layout/Modal";

const TopicQuestions = () => {
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

  const questions = [
    {
      id: 1,
      question: "What is 2 + 2?",
      type: "MCQ",
      subject: "Math",
      difficulty: "Easy",
      createdAt: "2024-08-01",
      lastModified: "2024-08-01",
      usageCount: 15,
      tags: ["Basic", "Addition"],
    },
    {
      id: 2,
      question: "The Earth is flat.",
      type: "True/False",
      subject: "Science",
      difficulty: "Easy",
      createdAt: "2024-07-28",
      lastModified: "2024-07-30",
      usageCount: 8,
      tags: ["Geography", "Facts"],
    },
    {
      id: 3,
      question: "Explain the causes of World War II.",
      type: "Essay",
      subject: "History",
      difficulty: "Hard",
      createdAt: "2024-07-25",
      lastModified: "2024-07-26",
      usageCount: 12,
      tags: ["World War", "Analysis"],
    },
    {
      id: 4,
      question: "Calculate the derivative of x² + 3x - 5",
      type: "MCQ",
      subject: "Math",
      difficulty: "Medium",
      createdAt: "2024-07-22",
      lastModified: "2024-07-23",
      usageCount: 22,
      tags: ["Calculus", "Derivatives"],
    },
  ];

  const [deleteModal, setDeleteModal] = useState(false);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnitWithTopic?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.unit?.name, href: "#" },
    { label: selectedSubjectAndUnitWithTopic?.topic?.name, href: "#" },
    { label: "Questions", href: "#", current: true },
  ];

  const [prevModal, setPrevModal] = useState(false);

  console.log(
    "selectedSubjectAndUnitWithTopic",
    selectedSubjectAndUnitWithTopic
  );

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFC] p-6">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

          {/* Header */}
          <PagesHeader
            extra={
              <div className="flex  space-x-4">
                <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
                  <BookOpen className="w-5 h-5 text-[#0F7490]" />
                  <span className="text-sm font-medium text-[#202938]">
                    {questions.length} Questions
                  </span>
                </div>
                <Link href={"questions/new"}>
                  <Button
                    type="primary"
                    size="large"
                    className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Question
                  </Button>
                </Link>
              </div>
            }
            title={
              <>
                {selectedSubjectAndUnitWithTopic?.topic?.name} : <span className="text-primary">Question Bank</span>
              </>
            }
            subtitle={"Manage and organize your teaching questions"}
          />
          <QuestionsSearchAndFilters
            {...{
              searchTerm,
              setSearchTerm,
              selectedSubject,
              setSelectedSubject,
              selectedType,
              setSelectedType,
            }}
          />

          {/* Questions Grid */}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {questions.map((question) => (
              <QuestionCard
                selectedQuestion={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
                prevModal={prevModal}
                setPrevModal={setPrevModal}
                deleteModal={deleteModal}
                setDeleteModal={setDeleteModal}
                question={question}
                key={question.id}
              />
            ))}
          </div>

          {/* Question preview modal */}
          {selectedQuestion?.type == "MCQ" ? (
            <Modal
              footer={null}
              open={prevModal}
              className="!w-[40%]"
              onCancel={() => setPrevModal(!prevModal)}
            >
              <MCQPrev />
            </Modal>
          ) : (
            <Modal
              footer={null}
              open={prevModal}
              className="!w-[40%]"
              onCancel={() => setPrevModal(!prevModal)}
            >
              <EssayPrev />
            </Modal>
          )}

          <CustomModal
            isOpen={deleteModal}
            onClose={() => setDeleteModal(false)}
            title="Delete Question"
            size="sm"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-900">Are you sure?</h4>
                  <p className="text-sm text-red-700">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Question to be deleted:
                </p>
                <p className="font-medium text-[#202938]">
                  {selectedQuestion?.question}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => null}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Question
                </button>
              </div>
            </div>
          </CustomModal>
        </div>
      </div>
    </>
  );
};

export default TopicQuestions;

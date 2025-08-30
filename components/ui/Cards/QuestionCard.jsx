import React from "react";
import Badge from "../../atoms/Badge";
import Button from "../../atoms/Button";
import {
  Clock,
  Copy,
  Edit3,
  Eye,
  MoreVertical,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Card from "../../atoms/Card";
import MCQPreview from "../../Previews/MCQ.preview";
import { Modal } from "antd";

const QuestionCard = ({
  question,
  prevModal,
  setPrevModal,
  selectedQuestion,
  setSelectedQuestion,
  deleteModal,
  setDeleteModal,
}) => {
  const [previewModal, setPreviewModal] = React.useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case "MCQ":
        return "blue";
      case "True/False":
        return "gold";
      case "Essay":
        return "purple";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "gold";
      case "Hard":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Card
      key={question.id}
      className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
    >
      <h1>{selectedQuestion?.question}</h1>

      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Badge color={getTypeColor(question.type)}>{question.type}</Badge>
          <Badge color={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button type="text" size="small">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#202938] mb-2 line-clamp-2">
          {question.question}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-[#202938]/60">
          <div className="flex items-center space-x-1">
            <Tag className="w-4 h-4" />
            <span>{question.subject}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{question.usageCount} uses</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Question Meta */}
      <div className="flex items-center justify-between text-xs text-[#202938]/50 mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Modified {question.lastModified}</span>
        </div>
        <div className="flex items-center space-x-1">
          <User className="w-3 h-3" />
          <span>Created {question.createdAt}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => {
              setPrevModal(true);
              console.log("question", question);
              setSelectedQuestion(question);
            }}
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
          >
            <Copy className="w-4 h-4 mr-1" />
            Duplicate
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            type="text"
            size="small"
            className="text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              setDeleteModal(!deleteModal);
              setSelectedQuestion(question);
            }}
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* preview */}
    </Card>
  );
};

export default QuestionCard;

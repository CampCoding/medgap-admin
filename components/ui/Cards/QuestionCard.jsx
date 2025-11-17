import React from "react";
import Badge from "../../atoms/Badge";
import Button from "../../atoms/Button";
import {
  Clock,
  Copy,
  Edit3,
  Eye,
  Tag,
  Trash2,
  User,
  CheckCircle,
  XCircle,
  Clock3,
  MessageSquare,
} from "lucide-react";
import Card from "../../atoms/Card";
import MCQPreview from "../../Previews/MCQ.preview";
import { Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { handleGetAllQuestions, handleUpdateQuestionStatus } from "../../../features/questionsSlice";
import { handleChangeTeacherStatus } from "../../../features/teachersSlice";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
  {value :"active" , label:"Active"},
  {value:"inactive" , label:"InActive"},
  {value:"draft",label:"Draft"}
];

const statusIconInfo = (status) => {
  switch (status) {
    case "active":
      return { Icon: CheckCircle, className: "text-green-600", label: "Active" };
    case "inactive":
      return { Icon: XCircle, className: "text-red-600", label: "Inactive" };
    case "draft":
    default:
      return { Icon: Clock3, className: "text-yellow-600", label: "Draft" };
  }
};

const QuestionCard = ({
  question,
  prevModal,
  id,
  unitId,
  topicId,
  setPrevModal,
  selectedQuestion,
  setSelectedQuestion,
  deleteModal,
  setDeleteModal,
  questionDetailsModal,
  setQuestionDetailsModal,
  onDuplicate,
  onStatusChange, // optional callback (question, newStatus)
}) => {
  const [previewModal, setPreviewModal] = React.useState(false);

  // local status state so UI updates instantly
  const [currentStatus, setCurrentStatus] = React.useState(
    question?.status || "active"
  );
  const [statusModalOpen, setStatusModalOpen] = React.useState(false);
  const [statusDraft, setStatusDraft] = React.useState(currentStatus);

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

  const getReviewStatusInfo = (reviewStatus) => {
    switch (reviewStatus) {
      case "accepted":
        return {
          color: "green",
          icon: CheckCircle,
          text: "Accepted",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          iconColor: "text-green-600",
        };
    case "rejected":
        return {
          color: "red",
          icon: XCircle,
          text: "Rejected",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          iconColor: "text-red-600",
        };
      case "pending":
        return {
          color: "yellow",
          icon: Clock3,
          text: "Pending Review",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          iconColor: "text-yellow-600",
        };
      default:
        return {
          color: "gray",
          icon: Clock3,
          text: "Not Reviewed",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          iconColor: "text-gray-600",
        };
    }
  };

  const { Icon: StatusIcon, className: statusClass, label: statusLabel } =
    statusIconInfo(currentStatus);
  const dispatch  = useDispatch();
  const router = useRouter();

  const {question_status_loading} = useSelector(state => state?.questions);

  const openStatusModal = () => {
    setStatusDraft(currentStatus);
    setStatusModalOpen(true);
  };

  const handleSaveStatus = () => {
    const data_send = {
      status : statusDraft
    }
    dispatch(handleUpdateQuestionStatus(question?.id , data_send))
    .unwrap()
    .then(res => {
      if(res?.status == "success") {
        toast.success(res)
        setStatusModalOpen(false);
        dispatch(handleGetAllQuestions({topic_id : topicId}))
      }else {
        toast.error(res)
      }
    }).catch(e => console.log(e))
    .finally(() =>setStatusModalOpen(false))
  };

  return (
    <Card
      key={question.id}
      className="p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Badge color={getTypeColor(question.type)}>{question.type}</Badge>
          <Badge color={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
        </div>

        {/* Status icon button */}
        <button
          type="button"
          onClick={openStatusModal}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50 text-sm"
          title={`Status: ${statusLabel} (click to change)`}
        >
          <StatusIcon className={`w-4 h-4 ${statusClass}`} />
          <span className="text-[#202938]/70 capitalize">{currentStatus}</span>
        </button>
      </div>

      {/* Content */}
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

      {/* Review Status */}
      {question.reviewStatus && (
        <div className="mb-4">
          <div
            className={`flex items-center justify-between p-3 rounded-lg ${getReviewStatusInfo(question.reviewStatus).bgColor} border-l-4 border-l-${getReviewStatusInfo(question.reviewStatus).color}-500`}
          >
            <div className="flex items-center space-x-2">
              {React.createElement(
                getReviewStatusInfo(question.reviewStatus).icon,
                {
                  className: `w-4 h-4 ${getReviewStatusInfo(question.reviewStatus).iconColor}`,
                }
              )}
              <span
                className={`text-sm font-medium ${getReviewStatusInfo(question.reviewStatus).textColor}`}
              >
                {getReviewStatusInfo(question.reviewStatus).text}
              </span>
            </div>
            {question.reviewedBy && (
              <span
                className={`text-xs ${getReviewStatusInfo(question.reviewStatus).textColor} opacity-80`}
              >
                by {question.reviewedBy}
              </span>
            )}
          </div>

          {/* Creator Information */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>Created by: {question.createdBy}</span>
            </div>
            {question.reviewedAt && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Reviewed: {question.reviewedAt}</span>
              </div>
            )}
          </div>

          {/* Review Comments */}
          {question.reviewComments && (
            <div className="mt-2 p-2 bg-white rounded border-l-2 border-l-blue-400">
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700 italic">
                  "{question.reviewComments}"
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {(question.tags || []).map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meta */}
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
            onClick={() => onDuplicate(question)}
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
            onClick={() => router.push(`/subjects/${id}/units/${unitId}/topics/${topicId}/questions/edit/${question?.id}`)}
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

      {/* Status Modal */}
      <Modal
        title="Change Status"
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        onOk={handleSaveStatus}
        okText={question_status_loading ? "Loading" : "Save"}
        okButtonProps={{className:"!bg-blue-500 text-white"}}
      >
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#202938]">
            Select new status
          </label>
          <Select
            value={statusDraft}
            onChange={setStatusDraft}
            options={STATUS_OPTIONS}
            style={{ width: "100%" }}
          />
          <p className="text-xs text-[#202938]/60">
            This will update the status for this question.
          </p>
        </div>
      </Modal>
    </Card>
  );
};

export default QuestionCard;

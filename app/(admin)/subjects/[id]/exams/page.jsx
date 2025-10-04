"use client";

import React, { useMemo, useState } from "react";
import {
  Tag,
  Space,
  Avatar,
  Tooltip,
  Modal,
  Input,
  Select,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Form,
} from "antd";

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  BookOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import DataTable from "../../../../../components/layout/DataTable";
import PageLayout from "../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import { subjects } from "../../../../../data/subjects";
import { BarChart3, Book, Download, Plus, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import Button from "../../../../../components/atoms/Button";
import ExamsStats from "../../../../../components/Exams/ExamsStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import ExamsTable from "../../../../../components/Exams/ExamsTable";
import DeleteExamModal from "../../../../../components/Exams/DeleteExam.modal";
import ExamCards from "../../../../../components/Exams/ExamCard";
import Link from "next/link";

const { Option } = Select;

const ExamManager = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const [exams, setExams] = useState([
    {
      id: 1,
      title: "Algebra Basics",
      subject: "Math",
      createdBy: "Ahmed Hassan",
      status: "Published",
      questions: 25,
      duration: 60,
      attempts: 145,
      passRate: 85,
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
    },
    {
      id: 2,
      title: "Forces & Motion",
      subject: "Physics",
      createdBy: "Nour Adel",
      status: "Draft",
      questions: 30,
      duration: 90,
      attempts: 0,
      passRate: 0,
      createdDate: "2024-01-18",
      lastModified: "2024-01-22",
    },
    {
      id: 3,
      title: "World Geography",
      subject: "Geography",
      createdBy: "Omar Salah",
      status: "Published",
      questions: 40,
      duration: 75,
      attempts: 89,
      passRate: 92,
      createdDate: "2024-01-10",
      lastModified: "2024-01-25",
    },
  ]);

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteExamModal, setDeleteExamModal] = useState(false);
  const [selelectedExam, setSelectedExam] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    status: "",
    questions: "",
    duration: "",
    createdBy: "",
  });

  const subjectIcons = {
    Math: <CalculatorOutlined />,
    Physics: <ExperimentOutlined />,
    Geography: <GlobalOutlined />,
    Literature: <BookOutlined />,
  };

  const subjectColors = {
    Math: "blue",
    Physics: "purple",
    Geography: "green",
    Literature: "orange",
  };

  const handleAddExam = () => {
    setEditingExam(null);
    setFormData({
      title: "",
      subject: "",
      status: "",
      questions: "",
      duration: "",
      createdBy: "",
    });
    setIsModalVisible(true);
  };

  const handleEditExam = (record) => {
    setEditingExam(record);
    setFormData(record);
    setIsModalVisible(true);
  };

  const handleDeleteExam = (id) => {
    setExams(exams.filter((exam) => exam.id !== id));
    message.success("Exam deleted successfully");
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.title ||
      !formData.subject ||
      !formData.status ||
      !formData.questions ||
      !formData.duration ||
      !formData.createdBy
    ) {
      message.error("Please fill in all required fields");
      return;
    }

    if (editingExam) {
      setExams(
        exams.map((exam) =>
          exam.id === editingExam.id
            ? {
                ...exam,
                ...formData,
                questions: parseInt(formData.questions),
                duration: parseInt(formData.duration),
                lastModified: new Date().toISOString().split("T")[0],
              }
            : exam
        )
      );
      message.success("Exam updated successfully");
    } else {
      const newExam = {
        ...formData,
        id: Math.max(...exams.map((exam) => exam.id)) + 1,
        questions: parseInt(formData.questions),
        duration: parseInt(formData.duration),
        attempts: 0,
        passRate: 0,
        createdDate: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
      };
      setExams([...exams, newExam]);
      message.success("Exam created successfully");
    }
    setIsModalVisible(false);
    setFormData({
      title: "",
      subject: "",
      status: "",
      questions: "",
      duration: "",
      createdBy: "",
    });
  };

  const columns = [
    {
      title: "Exam Details",
      key: "examDetails",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#F9FAFC", border: "1px solid #e5e7eb" }}
          >
            <FileTextOutlined style={{ color: "#0F7490", fontSize: "18px" }} />
          </div>
          <div>
            <div
              className="font-semibold text-base"
              style={{ color: "#202938" }}
            >
              {record.title}
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <CalendarOutlined className="mr-1" />
              Created: {record.createdDate}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Tag
          icon={subjectIcons[subject]}
          color={subjectColors[subject]}
          className="px-3 py-1 font-medium"
        >
          {subject}
        </Tag>
      ),
    },
    {
      title: "Creator",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (creator) => (
        <div className="flex items-center space-x-2">
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#C9AE6C" }}
          />
          <span className="font-medium" style={{ color: "#202938" }}>
            {creator}
          </span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          Published: { color: "success", icon: <CheckCircleOutlined /> },
          Draft: { color: "warning", icon: <ClockCircleOutlined /> },
          Archived: { color: "default", icon: <FileTextOutlined /> },
        };

        return (
          <Tag
            color={statusConfig[status]?.color}
            icon={statusConfig[status]?.icon}
            className="px-3 py-1 font-medium"
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Exam Info",
      key: "examInfo",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <BookOutlined className="mr-2 text-gray-400" />
            <span className="font-medium">{record.questions}</span>
            <span className="text-gray-500 ml-1">questions</span>
          </div>
          <div className="flex items-center text-sm">
            <ClockCircleOutlined className="mr-2 text-gray-400" />
            <span className="font-medium">{record.duration}</span>
            <span className="text-gray-500 ml-1">minutes</span>
          </div>
          <div className="flex items-center text-sm">
            <TeamOutlined className="mr-2 text-gray-400" />
            <span className="font-medium">{record.attempts}</span>
            <span className="text-gray-500 ml-1">attempts</span>
          </div>
        </div>
      ),
    },
    {
      title: "Performance",
      key: "performance",
      render: (_, record) => (
        <div className="text-center">
          {record.attempts > 0 ? (
            <div>
              <div
                className="text-2xl font-bold mb-1"
                style={{
                  color:
                    record.passRate >= 80
                      ? "#22c55e"
                      : record.passRate >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              >
                {record.passRate}%
              </div>
              <div className="text-xs text-gray-500">Pass Rate</div>
            </div>
          ) : (
            <div className="text-gray-400">
              <div className="text-sm">No attempts</div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center">
          <Tooltip title="View Exam">
            <Button
              type="text"
              icon={<EyeOutlined />}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Edit Exam">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditExam(record)}
              style={{ color: "#0F7490" }}
              className="hover:bg-cyan-50"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Exam"
            description="Are you sure you want to delete this exam?"
            onConfirm={() => handleDeleteExam(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "#ef4444", borderColor: "#ef4444" },
            }}
          >
            <Tooltip title="Delete Exam">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              />
            </Tooltip>
            <Tooltip title="Delete Exam">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              />
            </Tooltip>
            <Tooltip title="Delete Exam">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    console.log(subject);
    return subject;
  }, [id]);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubject?.name, href: "#" },
    { label: "Exams", href: "#", current: true },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      {/* Header */}
      <PagesHeader
        title={
          <>
            Manage <span className="text-primary">{selectedSubject.name}</span>{" "}
            Exams{" "}
          </>
        }
        subtitle={"Create, monitor, and analyze your examination system"}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Link href={"/exams/new"}>
            <Button
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
              >
              Create New Exam
            </Button>
              </Link>
          </div>
        }
      />

      <ExamsStats />
      <SearchAndFilters
        mode={viewMode}
        setMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {viewMode == "table" ? (
        <div className="grid grid-cols-1">
          <ExamsTable
            deleteExamModal={deleteExamModal}
            setDeleteExamModal={setDeleteExamModal}
            selelectedExam={selelectedExam}
            setSelectedExam={setSelectedExam}
          />
        </div>
      ) : (
        <ExamCards
          deleteExamModal={deleteExamModal}
          setDeleteExamModal={setDeleteExamModal}
          selelectedExam={selelectedExam}
          setSelectedExam={setSelectedExam}
        />
      )}

      <DeleteExamModal
        open={deleteExamModal}
        setOpen={setDeleteExamModal}
        selectedExam={selelectedExam}
        setSelectedExam={setSelectedExam}
      />
    </PageLayout>
  );
};

export default ExamManager;

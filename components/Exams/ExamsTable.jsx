"use client";

import React, { useState } from "react";

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
import DataTable from "../layout/DataTable";

import Button from "../atoms/Button";
import { Edit3, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
const ExamsTable = ({deleteExamModal, setDeleteExamModal , selelectedExam, setSelectedExam}) => {


  const subjectIcons = {
    Math: <CalculatorOutlined />,
    Physics: <ExperimentOutlined />,
    Geography: <GlobalOutlined />,
    Literature: <BookOutlined />,
  };

  const colors = {
    primary: "#0F7490",
    secondary: "#C9AE6C",
    accent: "#8B5CF6",
    background: "#F9FAFC",
    text: "#202938",
  };

  const subjectColors = {
    Math: "blue",
    Physics: "purple",
    Geography: "green",
    Literature: "orange",
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
        <div className="flex items-center space-x-2">
          <Link
            href={`/exams/${record.id}/details`}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
            }}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: `${colors.secondary}15`,
              color: colors.secondary,
            }}
            title="Edit Exam"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setDeleteExamModal(true);
              setSelectedExam(record);
            }}
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all duration-200 hover:scale-110"
            title="Delete Exam"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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

  return (
    <DataTable
      searchable={false}
      table={{
        header: columns,
        rows: exams,
      }}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} exams`,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      className="border border-gray-100 rounded-lg overflow-hidden"
      rowClassName="hover:bg-gray-50 transition-colors"
    />
  );
};

export default ExamsTable;

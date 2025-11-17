"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
  Card,
  Statistic,
  Row,
  Col,
  Avatar,
  Badge,
  Typography,
  Divider,
  Progress,
  List,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  LockOutlined,
  UnlockOutlined,
  IdcardOutlined,
  HomeOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { BarChart3, Download, GraduationCap, Plus, Users } from "lucide-react";
import PageLayout from "../layout/PageLayout";
import PagesHeader from "../ui/PagesHeader";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
import Upload from "antd/es/upload/Upload";
import StudentsStats from "../Students/StudentsStats";
import SearchAndFilters from "../ui/SearchAndFilters";
import Button from "./../../components/atoms/Button";

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const StudentsTable = ({handleViewStudent}) => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Salma Ali",
      email: "salma@example.com",
      phone: "+20 100 111 2222",
      enrolledAt: "2024-10-01",
      status: "active",
      grade: "12th Grade",
      subjects: ["Math", "Physics", "Chemistry"],
      gpa: 3.8,
      address: "Cairo, Egypt",
      parentName: "Ahmed Ali",
      parentPhone: "+20 100 111 3333",
      dateOfBirth: "2006-03-15",
      studentId: "STU001",
      avatar: null,
    },
    {
      id: 2,
      name: "Mahmoud Zaki",
      email: "mahmoud@example.com",
      phone: "+20 101 222 3333",
      enrolledAt: "2024-08-12",
      status: "blocked",
      grade: "11th Grade",
      subjects: ["Biology", "Chemistry", "English"],
      gpa: 3.2,
      address: "Alexandria, Egypt",
      parentName: "Omar Zaki",
      parentPhone: "+20 101 222 4444",
      dateOfBirth: "2007-07-22",
      studentId: "STU002",
      avatar: null,
    },
    {
      id: 3,
      name: "Lina Gamal",
      email: "lina@example.com",
      phone: "+20 102 333 4444",
      enrolledAt: "2025-01-15",
      status: "active",
      grade: "10th Grade",
      subjects: ["Math", "English", "History"],
      gpa: 3.9,
      address: "Giza, Egypt",
      parentName: "Youssef Gamal",
      parentPhone: "+20 102 333 5555",
      dateOfBirth: "2008-12-10",
      studentId: "STU003",
      avatar: null,
    },
    {
      id: 4,
      name: "Hassan Ahmed",
      email: "hassan@example.com",
      phone: "+20 103 444 5555",
      enrolledAt: "2024-05-20",
      status: "active",
      grade: "12th Grade",
      subjects: ["Physics", "Math", "Computer Science"],
      gpa: 3.7,
      address: "Tanta, Egypt",
      parentName: "Mohamed Ahmed",
      parentPhone: "+20 103 444 6666",
      dateOfBirth: "2006-01-28",
      studentId: "STU004",
      avatar: null,
    },
    {
      id: 5,
      name: "Nour Hassan",
      email: "nour@example.com",
      phone: "+20 104 555 6666",
      enrolledAt: "2024-03-08",
      status: "inactive",
      grade: "11th Grade",
      subjects: ["Biology", "Chemistry", "Math"],
      gpa: 3.5,
      address: "Mansoura, Egypt",
      parentName: "Ali Hassan",
      parentPhone: "+20 104 555 7777",
      dateOfBirth: "2007-09-14",
      studentId: "STU005",
      avatar: null,
    },
  ]);
  const [filteredStudents, setFilteredStudents] = useState(students);

  const [loading, setLoading] = useState(false);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleOutlined />;
      case "blocked":
        return <StopOutlined />;
      case "inactive":
        return <ClockCircleOutlined />;
      default:
        return null;
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "12th Grade":
        return "#8B5CF6";
      case "11th Grade":
        return "#0F7490";
      case "10th Grade":
        return "#C9AE6C";
      default:
        return "#64748b";
    }
  };

  const getGPAColor = (gpa) => {
    if (gpa >= 3.7) return "#10b981";
    if (gpa >= 3.0) return "#f59e0b";
    return "#ef4444";
  };

  
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "green";
      case "blocked":
        return "red";
      case "inactive":
        return "orange";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={48}
            className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
          >
            {getInitials(name)}
          </Avatar>
          <div>
            <Text strong className="text-gray-900">
              {name}
            </Text>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <IdcardOutlined className="mr-1 text-xs" />
              {record.studentId}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "email",
      key: "email",
      render: (email, record) => (
        <div>
          <div className="text-sm text-blue-600 flex items-center mb-1">
            <MailOutlined className="mr-1 text-xs" />
            {email}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <PhoneOutlined className="mr-1 text-xs" />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Grade & GPA",
      key: "academic",
      render: (_, record) => (
        <div>
          <Tag
            className="mb-2 px-3 py-1 text-xs font-medium border-0"
            style={{
              backgroundColor: getGradeColor(record.grade),
              color: "white",
            }}
          >
            {record.grade}
          </Tag>
          <div className="flex items-center">
            <StarOutlined className="mr-1 text-yellow-500" />
            <span style={{ color: getGPAColor(record.gpa), fontWeight: "600" }}>
              {record.gpa} GPA
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={getStatusColor(status)}
          text={
            <span className="capitalize font-medium">
              {getStatusIcon(status)} {status}
            </span>
          }
        />
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (date) => (
        <div className="flex items-center text-gray-700">
          <CalendarOutlined className="mr-2 text-blue-500" />
          {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              className="bg-purple-600 hover:bg-purple-700 border-purple-600"
              onClick={() => handleViewStudent(record)}
            />
          </Tooltip>
          {record.status !== "blocked" ? (
            <Button
              type="danger"
              size="small"
              icon={<LockOutlined />}
              onClick={() => handleStatusChange(record.id, "blocked")}
            >
              Block
            </Button>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<UnlockOutlined />}
              className="bg-green-600 hover:bg-green-700 border-green-600"
              onClick={() => handleStatusChange(record.id, "active")}
            >
              Unblock
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-lg border-0">
      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => (
            <span className="text-gray-600">
              Showing {range[0]}-{range[1]} of {total} students
            </span>
          ),
        }}
        scroll={{ x: 800 }}
        className="custom-table"
      />
    </Card>
  );
};

export default StudentsTable;

"use client";

import { useState, useEffect, useMemo } from "react";
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
import {
  BarChart3,
  Book,
  Download,
  GraduationCap,
  Plus,
  Users,
} from "lucide-react";
import PageLayout from "../../../../../components/layout/PageLayout";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import Upload from "antd/es/upload/Upload";
import Button from "../../../../../components/atoms/Button";
import StudentsStats from "../../../../../components/Students/StudentsStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import StudentsTable from "../../../../../components/Students/StudentsTable";
import StudentsCards from "../../../../../components/Students/StudentsCards";
import AddStudentModal from "../../../../../components/Students/AddStudent.modal";
import { subjects } from "../../../../../data/subjects";
import { useParams } from "next/navigation";

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const StudentsManagement = () => {
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

  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [filteredStudents, setFilteredStudents] = useState(students);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [addStudentModal, setAddStuentModal] = useState(false);

  useEffect(() => {
    let filtered = students;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (student) => student.status === selectedStatus
      );
    }

    if (selectedGrade !== "all") {
      filtered = filtered.filter((student) => student.grade === selectedGrade);
    }

    if (searchText) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.email.toLowerCase().includes(searchText.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
          student.grade.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedStatus, selectedGrade, searchText]);

  const handleStatusChange = (studentId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      );
      const action = newStatus === "blocked" ? "blocked" : "unblocked";
      message.success(`Student ${action} successfully!`);
      setLoading(false);
    }, 500);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    console.log(subject);
    return subject;
  }, [id]);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubject?.name, href: "#" },
    { label: "Students", href: "#", current: true },
  ];

  return (
    <PageLayout>
      {/* Breadcrumbs */}

      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        title={
          <>
            Manage <span className="text-primary">{selectedSubject.name}</span>{" "}
            Students{" "}
          </>
        }
        subtitle={
          "Manage student profiles, enrollment status, and academic progress"
        }
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              onClick={() => setAddStuentModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Student
            </Button>
          </div>
        }
      />
      {/* students stats */}
      <StudentsStats />

      <SearchAndFilters
        mode={viewMode}
        setMode={setViewMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Table and grid */}

      {viewMode == "table" ? (
        <StudentsTable handleViewStudent={handleViewStudent} />
      ) : (
        <StudentsCards
          students={filteredStudents}
          loading={loading}
          onView={handleViewStudent}
          onChangeStatus={handleStatusChange}
        />
      )}

      {/* View Student Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800">
            Student Profile
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
        className="student-modal"
      >
        {selectedStudent && (
          <div className="py-6">
            {/* Student Header */}
            <div className="text-center mb-8">
              <Avatar
                size={100}
                className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-2xl mb-4"
              >
                {getInitials(selectedStudent.name)}
              </Avatar>
              <Title level={2} className="mb-2">
                {selectedStudent.name}
              </Title>
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Badge
                  status={getStatusColor(selectedStudent.status)}
                  text={
                    <span className="capitalize font-medium text-lg">
                      {getStatusIcon(selectedStudent.status)}{" "}
                      {selectedStudent.status}
                    </span>
                  }
                />
                <Tag
                  className="px-3 py-1 text-sm"
                  style={{
                    backgroundColor: getGradeColor(selectedStudent.grade),
                    color: "white",
                    border: "none",
                  }}
                >
                  {selectedStudent.grade}
                </Tag>
              </div>
              <div className="flex justify-center">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Text strong>Student ID: </Text>
                  <Text className="text-blue-600">
                    {selectedStudent.studentId}
                  </Text>
                </div>
              </div>
            </div>

            <Divider />

            {/* Student Information Grid */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <MailOutlined className="mr-2 text-blue-600" />
                    Email
                  </Text>
                  <Text className="text-blue-600">{selectedStudent.email}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <PhoneOutlined className="mr-2 text-green-600" />
                    Phone
                  </Text>
                  <Text>{selectedStudent.phone}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <CalendarOutlined className="mr-2 text-purple-600" />
                    Date of Birth
                  </Text>
                  <Text>
                    {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <HomeOutlined className="mr-2 text-indigo-600" />
                    Address
                  </Text>
                  <Text>{selectedStudent.address}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <CalendarOutlined className="mr-2 text-cyan-600" />
                    Enrolled At
                  </Text>
                  <Text>
                    {new Date(selectedStudent.enrolledAt).toLocaleDateString()}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <StarOutlined className="mr-2 text-yellow-600" />
                    GPA
                  </Text>
                  <div className="flex items-center space-x-2">
                    <Text
                      className="text-lg font-bold"
                      style={{ color: getGPAColor(selectedStudent.gpa) }}
                    >
                      {selectedStudent.gpa}
                    </Text>
                    <Progress
                      percent={(selectedStudent.gpa / 4) * 100}
                      strokeColor={getGPAColor(selectedStudent.gpa)}
                      size="small"
                      className="flex-1"
                    />
                  </div>
                </div>
              </Col>
            </Row>

            {/* Parent Information */}
            <Card className="mb-6" title="Parent/Guardian Information">
              <Row gutter={[24, 16]}>
                <Col span={12}>
                  <Text strong className="text-gray-700">
                    Parent Name:
                  </Text>
                  <div>{selectedStudent.parentName}</div>
                </Col>
                <Col span={12}>
                  <Text strong className="text-gray-700">
                    Parent Phone:
                  </Text>
                  <div>{selectedStudent.parentPhone}</div>
                </Col>
              </Row>
            </Card>

            {/* Subjects */}
            <Card className="mb-6" title="Enrolled Modules">
              <div className="flex flex-wrap gap-2">
                {selectedStudent.subjects.map((subject, index) => (
                  <Tag
                    key={index}
                    className="px-3 py-1 text-sm"
                    style={{
                      backgroundColor: "#C9AE6C",
                      color: "white",
                      border: "none",
                    }}
                  >
                    <BookOutlined className="mr-1" />
                    {subject}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              {selectedStudent.status !== "blocked" ? (
                <Button
                  type="danger"
                  size="large"
                  className="px-8"
                  icon={<LockOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedStudent.id, "blocked");
                    setViewModalVisible(false);
                  }}
                >
                  Block Student
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-600 hover:bg-green-700 border-green-600 px-8"
                  icon={<UnlockOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedStudent.id, "active");
                    setViewModalVisible(false);
                  }}
                >
                  Unblock Student
                </Button>
              )}
              <Button
                type="primary"
                size="large"
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 px-8"
                icon={<EditOutlined />}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <AddStudentModal
        open={addStudentModal}
        onCancel={() => setAddStuentModal(false)}
      />
    </PageLayout>
  );
};

export default StudentsManagement;

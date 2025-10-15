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
  Pagination,
  Button as AntButton,
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
  SyncOutlined,
} from "@ant-design/icons";
import {
  BarChart3,
  Book,
  Download,
  GraduationCap,
  Plus,
  User2,
  Users,
  Upload,
} from "lucide-react";
import PageLayout from "../../../../../components/layout/PageLayout";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import Button from "../../../../../components/atoms/Button";
import StudentsStats from "../../../../../components/Students/StudentsStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import StudentsTable from "../../../../../components/Students/StudentsTable";
import StudentsCards from "../../../../../components/Students/StudentsCards";
import AddStudentModal from "../../../../../components/Students/AddStudent.modal";
import { subjects } from "../../../../../data/subjects";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleGetModuleStudents } from "../../../../../features/modulesSlice";

const { Text, Title } = Typography;

const StudentsManagement = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // State for students data from API
  const [apiStudents, setApiStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [moduleInfo, setModuleInfo] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Transform API student data to match frontend format
  const transformStudentData = (apiStudent, moduleInfo) => {
    const getGrade = (student) => {
      if (student.grade) return student.grade;
      const birthDate = new Date(student.date_of_birth);
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthDate.getFullYear();

      if (age >= 17) return "12th Grade";
      if (age >= 16) return "11th Grade";
      if (age >= 15) return "10th Grade";
      return "9th Grade";
    };

    return {
      modules: apiStudent.modules,
      id: apiStudent.student_id,
      name: apiStudent.full_name,
      email: apiStudent.email,
      phone: apiStudent.phone,
      enrolledAt: apiStudent.enrollment_date || apiStudent.enrolled_at,
      status: apiStudent.status || apiStudent.enrollment_status,
      grade: getGrade(apiStudent),
      subjects: moduleInfo ? [moduleInfo.subject_name] : [],
      gpa: 3.5 + Math.random() * 0.5,
      address: apiStudent.address || "Address not specified",
      parentName: "Parent Name",
      parentPhone: "+20 XXX XXX XXXX",
      dateOfBirth: apiStudent.date_of_birth,
      studentId: `STU${apiStudent.student_id.toString().padStart(3, "0")}`,
      avatar: apiStudent.image_url,
      gender: apiStudent.gender,
      notes: apiStudent.notes,
      moduleInfo: moduleInfo,
    };
  };

  // Fetch students with pagination
  const fetchStudents = (page = 1, pageSize = 10) => {
    setLoading(true);
    // return the promise so callers can chain .then
    return dispatch(handleGetModuleStudents({ id, page, limit: pageSize }))
      .unwrap()
      .then((response) => {
        if (response.status === "success") {
          const { students, module, count, pagination: apiPagination } = response.data;

          // Set module info for display
          setModuleInfo(module);

          // Transform API data
          const transformedStudents = students.map((student) =>
            transformStudentData(student, module)
          );

          setApiStudents(transformedStudents);
          setFilteredStudents(transformedStudents);

          // Update pagination
          setPagination({
            current: apiPagination?.page || page,
            pageSize: apiPagination?.limit || pageSize,
            total: apiPagination?.total || count,
          });

          // return transformed for optional chaining
          return { transformed: transformedStudents };
        }
        return { transformed: [] };
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        message.error("Failed to load students. Please try again.");
        setApiStudents([]);
        setFilteredStudents([]);
        return { transformed: [] };
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents(1, 10);
  }, [id]);

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    fetchStudents(page, pageSize);
  };

  // Filter students based on search and status
  useEffect(() => {
    let filtered = apiStudents;

    if (searchText) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchText.toLowerCase()) ||
          student.email.toLowerCase().includes(searchText.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
          student.grade.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((student) => student.status === selectedStatus);
    }

    if (selectedGrade !== "all") {
      filtered = filtered.filter((student) => student.grade === selectedGrade);
    }

    setFilteredStudents(filtered);
  }, [searchText, selectedStatus, selectedGrade, apiStudents]);

  const handleStatusChange = async (studentId, newStatus) => {
    setLoading(true);
    try {
      // demo local update
      setApiStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId ? { ...student, status: newStatus } : student
        )
      );
      message.success(
        `Student ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully!`
      );
    } catch (error) {
      message.error("Failed to update student status");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setViewModalVisible(true);
  };

  const handleExport = () => {
    message.info("Export functionality will be implemented soon");
  };

  const handleImport = () => {
    message.info("Import functionality will be implemented soon");
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
      case "9th Grade":
        return "#64748b";
      default:
        return "#64748b";
    }
  };

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    return subject;
  }, [id]);

  // NEW: refresh parent list & keep open "View Student" modal in sync
  const handleModulesUpdated = () => {
    fetchStudents(pagination.current, pagination.pageSize).then((res) => {
      if (selectedStudent && res?.transformed?.length) {
        const updated = res.transformed.find((s) => s.id === selectedStudent.id);
        if (updated) setSelectedStudent(updated);
      }
    });
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubject?.name || "Module", href: "#" },
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
            Manage <span className="text-primary">{selectedSubject?.name || "Module"}</span>{" "}
            Students{" "}
          </>
        }
        subtitle={"Manage student profiles, enrollment status, and academic progress"}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />} onClick={handleImport}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Export
            </Button>
            <Button
              onClick={() => setAddStudentModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Student
            </Button>
          </div>
        }
      />

      {/* Module Information */}
      {moduleInfo && (
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Text strong className="text-lg">
                Module:{" "}
              </Text>
              <Text className="text-lg">{moduleInfo.subject_name}</Text>
              <Text className="text-gray-500 ml-2">({moduleInfo.subject_code})</Text>
            </div>
            <Tag color="blue" className="text-sm">
              {pagination.total} Students
            </Tag>
          </div>
        </Card>
      )}

      {/* Students stats */}
      <StudentsStats students={apiStudents} loading={loading} />

      {/* Search and Filters */}
      <SearchAndFilters
        mode={viewMode}
        setMode={setViewMode}
        searchTerm={searchText}
        setSearchTerm={setSearchText}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Progress type="circle" percent={75} size={60} />
          </div>
          <Text className="text-gray-500">Loading students...</Text>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredStudents.length === 0 && apiStudents.length === 0 && (
        <div className="text-center py-12">
          <User2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <Title level={4} className="text-gray-500">
            No students found
          </Title>
          <Text className="text-gray-400">No students are enrolled in this module yet.</Text>
          <div className="mt-4">
            <Button
              onClick={() => setAddStudentModal(true)}
              type="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              Add First Student
            </Button>
          </div>
        </div>
      )}

      {/* No Results State */}
      {!loading && filteredStudents.length === 0 && apiStudents.length > 0 && (
        <div className="text-center py-12">
          <SearchOutlined className="text-4xl text-gray-300 mb-4" />
          <Title level={4} className="text-gray-500">
            No matching students
          </Title>
          <Text className="text-gray-400">
            No students match your current filters. Try adjusting your search criteria.
          </Text>
        </div>
      )}

      {/* Students List */}
      {!loading && filteredStudents.length > 0 && (
        <>
          {viewMode === "table" ? (
            <StudentsTable
              students={filteredStudents}
              loading={loading}
              handleViewStudent={handleViewStudent}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <StudentsCards
              id={id}
              students={filteredStudents}
              loading={loading}
              onView={handleViewStudent}
              onChangeStatus={handleStatusChange}
              onModulesUpdated={handleModulesUpdated}  // ← hook up refresh
            />
          )}

          {/* Pagination */}
          {pagination.total > pagination.pageSize && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onChange={handlePaginationChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} students`}
              />
            </div>
          )}
        </>
      )}

      {/* View Student Modal */}
      <Modal
        title={<div className="text-xl font-semibold text-gray-800">Student Profile</div>}
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
                {selectedStudent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Avatar>
              <Title level={2} className="mb-2">
                {selectedStudent.name}
              </Title>
              <div className="flex justify-center items-center space-x-4 mb-4">
                <Badge
                  status={getStatusColor(selectedStudent.status)}
                  text={
                    <span className="capitalize font-medium text-lg">
                      {getStatusIcon(selectedStudent.status)} {selectedStudent.status}
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
                {selectedStudent.gender && <Tag color="blue" className="capitalize">{selectedStudent.gender}</Tag>}
              </div>
              <div className="flex justify-center">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <Text strong>Student ID: </Text>
                  <Text className="text-blue-600">{selectedStudent.id}</Text>
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
                  <Text>{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</Text>
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
                  <Text>{new Date(selectedStudent.enrolledAt).toLocaleDateString()}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <User2 className="mr-2 text-cyan-600" />
                    Grade
                  </Text>
                  <Text>{selectedStudent?.grade}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <BookOutlined className="mr-2 text-yellow-600" />
                    Module
                  </Text>
                  <Text>{selectedStudent.subjects[0]}</Text>
                </div>
              </Col>
            </Row>

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
        id={id}
        open={addStudentModal}
        onCancel={() => setAddStudentModal(false)}
        onSuccess={() => {
          setAddStudentModal(false);
          fetchStudents(pagination.current, pagination.pageSize); // Refresh the list
        }}
      />
    </PageLayout>
  );
};

export default StudentsManagement;

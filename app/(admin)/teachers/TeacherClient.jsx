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
} from "antd";
import DataTable from "./../../../components/layout/DataTable";
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
  CloseCircleOutlined,
} from "@ant-design/icons";
import PageLayout from "../../../components/layout/PageLayout";
import PagesHeader from "./../../../components/ui/PagesHeader";
import BreadcrumbsShowcase from "./../../../components/ui/BreadCrumbs";
import { BarChart3, Download, Plus, Upload, Users, CheckCircle, X } from "lucide-react";
import Button from "./../../../components/atoms/Button";
import TeacherStats from "../../../components/Teachers/TeachersStats";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import TeachersTable from "../../../components/Teachers/TeachersTable";
import TeacherCards from "../../../components/Teachers/TeachersGrid";
import { subjects } from "../../../data/subjects";
import AddTeacherModal from "../../../components/Teachers/AddTeacherModal.modal";
import EditTeacherModal from "../../../components/Teachers/EditTeacher.modal";

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TeachersManagementClient = () => {
  // Sample reviewer data
  const [reviewers] = useState([
    {
      id: 1,
      name: "Dr. Ali Farouk",
      email: "ali.farouk@school.edu",
      reviewSubject: "Math",
      status: "approved",
    },
    {
      id: 2,
      name: "Dr. Karim Saad",
      email: "karim.saad@school.edu",
      reviewSubject: "English",
      status: "approved",
    },
    {
      id: 3,
      name: "Dr. Fatima Ahmed",
      email: "fatima.ahmed@school.edu",
      reviewSubject: "Science",
      status: "approved",
    },
    {
      id: 4,
      name: "Dr. Omar Hassan",
      email: "omar.hassan@school.edu",
      reviewSubject: "History",
      status: "approved",
    },
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Mahmoud Saleh",
      email: "mahmoud.saleh@school.edu",
      phone: "+20 100 987 6543",
      subjects: ["History", "Geography", "Civics"],
      status: "pending",
      joinDate: "2024-04-10",
      experience: "7 years",
      qualification: "Masters in History",
      avatar: null,
    },
    {
      id: 2,
      name: "Laila Samir",
      email: "laila.samir@school.edu",
      phone: "+20 101 456 7890",
      subjects: ["Math", "Computer Science"],
      status: "approved",
      reviewer: {
        id: 1,
        name: "Dr. Ali Farouk",
        email: "ali.farouk@school.edu",
        phone: "+20 101 222 3344",
        reviewSubject: "Math",
        subjects: ["Math", "Physics"],
      },
      joinDate: "2023-08-15",
      experience: "10 years",
      qualification: "PhD in Computer Science",
      avatar: null,
    },
    {
      id: 3,
      name: "Hany Nasser",
      email: "hany.nasser@school.edu",
      phone: "+20 102 654 3210",
      subjects: ["Chemistry", "Physics"],
      status: "rejected",
      joinDate: "2024-01-25",
      experience: "2 years",
      qualification: "Bachelors in Chemistry",
      avatar: null,
    },
    {
      id: 4,
      name: "Mona Ezzat",
      email: "mona.ezzat@school.edu",
      phone: "+20 103 789 6541",
      subjects: ["English", "French"],
      status: "approved",
      reviewer: {
        id: 2,
        name: "Dr. Karim Saad",
        email: "karim.saad@school.edu",
        phone: "+20 101 555 7788",
        reviewSubject: "English",
        subjects: ["Linguistics", "English"],
      },
      joinDate: "2023-10-12",
      experience: "9 years",
      qualification: "Masters in Linguistics",
      avatar: null,
    },
    {
      id: 5,
      name: "Youssef Adel",
      email: "youssef.adel@school.edu",
      phone: "+20 104 112 2334",
      subjects: ["Art", "Music"],
      status: "pending",
      joinDate: "2024-02-18",
      experience: "5 years",
      qualification: "Bachelors in Fine Arts",
      avatar: null,
    },
  ]);
  

  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [editTeacherModal, setEditTeacherModal] = useState(false);
  const [addNewModal, setAddNewModal] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    experience: "",
    qualification: "",
    joinDate: "",
    subjects: [],
  });
  const [sortBy, setSortBy] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const handleStatusChange = (teacherId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
        )
      );
      message.success(`Teacher ${newStatus} successfully!`);
      setLoading(false);
    }, 500);
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
  };

  const handleAssignReviewer = async (payload) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === payload.teacherId
            ? {
                ...teacher,
                reviewer: payload.action === 'remove' ? null : {
                  id: payload.reviewerId,
                  name: payload.reviewer?.name,
                  email: payload.reviewer?.email,
                  reviewSubject: payload.reviewSubject || payload.reviewer?.reviewSubject,
                }
              }
            : teacher
        )
      );

      const actionText = payload.action === 'remove' ? 'removed' : 
                        payload.action === 'update' ? 'updated' : 'assigned';
      message.success(`Reviewer ${actionText} successfully!`);
    } catch (error) {
      message.error("Failed to update reviewer assignment.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = [...teachers];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.phone.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.qualification.toLowerCase().includes(searchText.toLowerCase()) ||
        teacher.subjects.some(subject => 
          subject.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(teacher => teacher.status === filters.status);
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter(teacher => {
        const years = parseInt(teacher.experience);
        switch (filters.experience) {
          case "0-2":
            return years >= 0 && years <= 2;
          case "3-5":
            return years >= 3 && years <= 5;
          case "6-10":
            return years >= 6 && years <= 10;
          case "10+":
            return years > 10;
          default:
            return true;
        }
      });
    }

    // Qualification filter
    if (filters.qualification) {
      filtered = filtered.filter(teacher => 
        teacher.qualification.toLowerCase().includes(filters.qualification.toLowerCase())
      );
    }

    // Join date filter
    if (filters.joinDate) {
      filtered = filtered.filter(teacher => {
        const teacherDate = new Date(teacher.joinDate);
        const filterDate = new Date(filters.joinDate);
        return teacherDate.toDateString() === filterDate.toDateString();
      });
    }

    // Subjects filter
    if (filters.subjects && filters.subjects.length > 0) {
      filtered = filtered.filter(teacher =>
        filters.subjects.some(subject => teacher.subjects.includes(subject))
      );
    }

    // Sort
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          case "joinDate_asc":
            return new Date(a.joinDate) - new Date(b.joinDate);
          case "joinDate_desc":
            return new Date(b.joinDate) - new Date(a.joinDate);
          case "experience_asc":
            return parseInt(a.experience) - parseInt(b.experience);
          case "experience_desc":
            return parseInt(b.experience) - parseInt(a.experience);
          case "status_asc":
            return a.status.localeCompare(b.status);
          case "status_desc":
            return b.status.localeCompare(a.status);
          default:
            return 0;
        }
      });
    }

    setFilteredTeachers(filtered);
  }, [searchText, filters, sortBy, teachers]);

  // Filter configuration
  const filterConfig = [
    {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
    {
      key: "experience",
      label: "Experience",
      type: "select",
      placeholder: "All Experience Levels",
      options: [
        { value: "", label: "All Experience Levels" },
        { value: "0-2", label: "0-2 years" },
        { value: "3-5", label: "3-5 years" },
        { value: "6-10", label: "6-10 years" },
        { value: "10+", label: "10+ years" },
      ],
    },
    {
      key: "qualification",
      label: "Qualification",
      type: "text",
      placeholder: "Search by qualification",
    },
    {
      key: "joinDate",
      label: "Join Date",
      type: "date",
      placeholder: "Select date",
    },
    {
      key: "subjects",
      label: "Subjects",
      type: "multiSelect",
      options: [
        { value: "Math", label: "Math" },
        { value: "Physics", label: "Physics" },
        { value: "Chemistry", label: "Chemistry" },
        { value: "Biology", label: "Biology" },
        { value: "English", label: "English" },
        { value: "History", label: "History" },
        { value: "Geography", label: "Geography" },
        { value: "Computer Science", label: "Computer Science" },
        { value: "Art", label: "Art" },
        { value: "Music", label: "Music" },
      ],
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "name_asc", label: "Name (A-Z)" },
    { value: "name_desc", label: "Name (Z-A)" },
    { value: "joinDate_asc", label: "Join Date (Oldest)" },
    { value: "joinDate_desc", label: "Join Date (Newest)" },
    { value: "experience_asc", label: "Experience (Low to High)" },
    { value: "experience_desc", label: "Experience (High to Low)" },
    { value: "status_asc", label: "Status (A-Z)" },
    { value: "status_desc", label: "Status (Z-A)" },
  ];

  // Bulk actions
  const bulkActions = [
    {
      key: "approve",
      label: "Approve",
      icon: CheckCircle,
    },
    {
      key: "reject",
      label: "Reject",
      icon: X,
    },
    {
      key: "export",
      label: "Export",
      icon: Download,
    },
  ];

  const handleBulkAction = (action, selectedItems) => {
    console.log(`Bulk action: ${action}`, selectedItems);
    // Implement bulk actions here
  };

  const handleRefresh = () => {
    console.log("Refreshing teachers...");
  };

  const handleExport = () => {
    console.log("Exporting teachers...");
  };

  const handleImport = () => {
    console.log("Importing teachers...");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <ClockCircleOutlined />;
      case "approved":
        return <CheckCircleOutlined />;
      case "rejected":
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Teachers", href: "/teachers", icon: Users, current: true },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      <PagesHeader
        title={"Manage Teachers"}
        subtitle={"Review and manage teacher applications and profiles"}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              onClick={() => setAddNewModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Teacher
            </Button>
          </div>
        }
      />
      <TeacherStats />
      <div className="mx-auto">
        {/* Filters Section */}

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchText}
          setSearchTerm={setSearchText}
          searchPlaceholder="Search teachers, email, phone, or subjects..."
          filters={filterConfig}
          onFiltersChange={setFilters}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          bulkActions={bulkActions}
          selectedItems={selectedTeachers}
          onBulkAction={handleBulkAction}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onImport={handleImport}
        />

        {/* Table */}

        {viewMode == "table" ? (
          <>
            <TeachersTable
              searchText={searchText}
              selectedStatus={selectedStatus}
              data={filteredTeachers}
              selectedTeachers={selectedTeachers}
              onSelectionChange={setSelectedTeachers}
            />
          </>
        ) : (
          <TeacherCards
            data={filteredTeachers}
            onView={(t) => {
              setSelectedTeacher(t);
              setViewModalVisible(true);
            }}
            onApprove={(t) => handleStatusChange(t.id, "approved")}
            onReject={(t) => handleStatusChange(t.id, "rejected")}
            onChangeStatus={(t, status) => handleStatusChange(t.id, status)}
            onDelete={(t) => console.log("delete", t)}
            onAssignReviewer={handleAssignReviewer}
            reviewerOptions={reviewers}
            subjectOptions={subjects}
          />
        )}

        {/* No Results */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No teachers found</h3>
            <p className="text-gray-500 mb-4">
              {searchText || Object.values(filters).some(f => f !== "" && f !== "all")
                ? "Try adjusting your search or filter criteria"
                : "No teachers available at the moment"}
            </p>
            {(searchText || Object.values(filters).some(f => f !== "" && f !== "all")) && (
              <Button
                onClick={() => {
                  setSearchText("");
                  setFilters({ status: "", experience: "", qualification: "", joinDate: "", subjects: [] });
                  setSortBy("");
                }}
                type="primary"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* View Teacher Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800">
            Teacher Details
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        className="teacher-modal"
      >
        {selectedTeacher && (
          <div className="py-6">
            {/* Teacher Header */}
            <div className="text-center mb-8">
              <Avatar
                size={100}
                className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-2xl mb-4"
              >
                {getInitials(selectedTeacher.name)}
              </Avatar>
              <Title level={2} className="mb-2">
                {selectedTeacher.name}
              </Title>
              <Badge
                status={getStatusColor(selectedTeacher.status)}
                text={
                  <span className="capitalize font-medium text-lg">
                    {getStatusIcon(selectedTeacher.status)}{" "}
                    {selectedTeacher.status}
                  </span>
                }
              />
            </div>

            <Divider />

            {/* Teacher Information Grid */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <BookOutlined className="mr-2 text-yellow-600" />
                    Modules
                  </Text>
                  <div className="flex flex-wrap items-center  space-y-2">
                    {selectedTeacher.subjects.map((item, i) => (
                      <Tag
                        key={i}
                        className="px-3 py-1 text-sm h-fit w-fit"
                        style={{
                          backgroundColor: "#C9AE6C",
                          color: "white",
                          border: "none",
                        }}
                      >
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-yellow-600" />
                    Experience
                  </Text>
                  <Text className="text-lg">{selectedTeacher.experience}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <MailOutlined className="mr-2 text-blue-600" />
                    Email
                  </Text>
                  <Text className="text-sm text-blue-600">
                    {selectedTeacher.email}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <PhoneOutlined className="mr-2 text-green-600" />
                    Phone
                  </Text>
                  <Text>{selectedTeacher.phone}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <CalendarOutlined className="mr-2 text-purple-600" />
                    Join Date
                  </Text>
                  <Text>
                    {new Date(selectedTeacher.joinDate).toLocaleDateString()}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-indigo-600" />
                    Qualification
                  </Text>
                  <Text>{selectedTeacher.qualification}</Text>
                </div>
              </Col>
            </Row>

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              {selectedTeacher.status !== "approved" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-600 hover:bg-green-700 border-green-600 px-8"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedTeacher.id, "approved");
                    setViewModalVisible(false);
                  }}
                >
                  Approve Teacher
                </Button>
              )}
              {selectedTeacher.status !== "rejected" && (
                <Button
                  danger
                  size="large"
                  className="px-8"
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedTeacher.id, "rejected");
                    setViewModalVisible(false);
                  }}
                >
                  Reject Teacher
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <AddTeacherModal
        open={addNewModal}
        onCancel={() => setAddNewModal(false)}
        subjectOptions={subjects}
        onSubmit={(payload) => console.log(payload)}
      />
    </PageLayout>
  );
};

export default TeachersManagementClient;

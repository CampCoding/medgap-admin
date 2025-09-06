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
import {
  MailOutlined,
  PhoneOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"; 
import PageLayout from "../../../../../components/layout/PageLayout";
import PagesHeader from "./../../../../../components/ui/PagesHeader";
import BreadcrumbsShowcase from "./../../../../../components/ui/BreadCrumbs";
import { BarChart3, Download, Plus, Upload, Users } from "lucide-react";
import Button from "./../../../../../components/atoms/Button";
import SearchAndFilters from "./../../../../../components/ui/SearchAndFilters";
import TeachersTable from "../../../../../components/Teachers/TeachersTable";
import TeacherCards from "../../../../../components/Teachers/TeachersGrid";
import { subjects } from "../../../../../data/subjects";
import AddTeacherModal from "../../../../../components/Teachers/AddTeacherModal.modal";
import TeacherStats from "../../../../../components/Teachers/TeachersStats";

const { Text, Title } = Typography;

const SubjectTeachers = () => {
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@school.edu",
      phone: "+20 100 123 4567",
      subjects: ["Math", "Physics", "Chemistry", "Biology", "English"],
      status: "pending",
      joinDate: "2024-01-15",
      experience: "5 years",
      qualification: "Masters in Mathematics",
      avatar: null,
    },
    {
      id: 2,
      name: "Nour Adel",
      email: "nour.adel@school.edu",
      phone: "+20 101 234 5678",
      subjects: ["Math", "Biology", "English"],
      status: "approved",
      joinDate: "2023-09-10",
      experience: "8 years",
      qualification: "PhD in Physics",
      avatar: null,
    },
    {
      id: 3,
      name: "Omar Salah",
      email: "omar.salah@school.edu",
      phone: "+20 102 345 6789",
      subjects: ["Biology", "English"],
      status: "rejected",
      joinDate: "2024-02-20",
      experience: "3 years",
      qualification: "Bachelors in Biology",
      avatar: null,
    },
    {
      id: 4,
      name: "Sarah Mohamed",
      email: "sarah.mohamed@school.edu",
      phone: "+20 103 456 7890",
      subjects: ["English"],
      status: "approved",
      joinDate: "2023-11-05",
      experience: "6 years",
      qualification: "Masters in Chemistry",
      avatar: null,
    },
    {
      id: 5,
      name: "Khaled Ali",
      email: "khaled.ali@school.edu",
      phone: "+20 104 567 8901",
      subjects: ["Math", "Physics"],
      status: "pending",
      joinDate: "2024-03-12",
      experience: "4 years",
      qualification: "Bachelors in English Literature",
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

        <SearchAndFilters mode={viewMode} setMode={setViewMode} />

        {/* Table */}

        {viewMode == "table" ? (
          <>
            <TeachersTable
              searchText={searchText}
              selectedStatus={selectedStatus}
            />
          </>
        ) : (
          <TeacherCards
            data={teachers}
            onView={(t) => {
              setSelectedTeacher(t);
              setViewModalVisible(true);
            }}
            onApprove={(t) => console.log("approve", t)}
            onReject={(t) => console.log("reject", t)}
          />
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

export default SubjectTeachers;

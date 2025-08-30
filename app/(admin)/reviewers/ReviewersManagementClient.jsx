"use client";

import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Tag,
  Modal,
  message,
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
import PageLayout from "../../../components/layout/PageLayout";
import PagesHeader from "./../../../components/ui/PagesHeader";
import BreadcrumbsShowcase from "./../../../components/ui/BreadCrumbs";
import { BarChart3, Download, Plus, Upload, Users } from "lucide-react";
import Button from "./../../../components/atoms/Button";
import TeacherStats from "../../../components/Teachers/TeachersStats";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import TeachersTable from "../../../components/Teachers/TeachersTable";
import TeacherCards from "../../../components/Teachers/TeachersGrid";
import { subjects } from "../../../data/subjects";
import AddTeacherModal from "../../../components/Teachers/AddTeacherModal.modal";
import EditTeacherModal from "../../../components/Teachers/EditTeacher.modal";
import RevsStats from "../../../components/Reviewers/RevStats";
import RevCards from "../../../components/Reviewers/RevCards";
import RevsTable from "../../../components/Reviewers/RevsTable";
import AddRevModal from "../../../components/Reviewers/AddRevModal.modal";

const { Text, Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ReviewersManagementClient = () => {
  // Sample teacher data for dropdown
  const availableTeachers = [
    { id: 1, name: "Fatima Youssef" },
    { id: 2, name: "Mohamed Ibrahim" },
    { id: 3, name: "Layla Karim" },
    { id: 4, name: "Omar Khaled" },
    { id: 5, name: "Mona Salem" },
    { id: 6, name: "Hassan Mostafa" },
    { id: 7, name: "Rania Saeed" },
    { id: 8, name: "Youssef Tarek" },
    { id: 9, name: "Khaled Fathy" },
    { id: 10, name: "Amira Nabil" },
    { id: 11, name: "Ali Mansour" },
    { id: 12, name: "Huda Salem" },
    { id: 13, name: "Omar Mahmoud" },
  ];

  const [reviewers, setReviewers] = useState([
    {
      id: 1,
      name: "Ahmed Hassan",
      email: "ahmed.hassan@school.edu",
      status: "pending",
      reviewSubject: "Math",
      assignedTeachers: [
        "Fatima Youssef",
        "Mohamed Ibrahim",
        "Layla Karim",
        "Omar Khaled",
        "Mona Salem",
      ],
    },
    {
      id: 2,
      name: "Nour Adel",
      email: "nour.adel@school.edu",
      status: "approved",
      reviewSubject: "Physics",
      assignedTeachers: ["Hassan Mostafa", "Rania Saeed", "Youssef Tarek"],
    },
    {
      id: 3,
      name: "Omar Salah",
      email: "omar.salah@school.edu",
      status: "rejected",
      reviewSubject: "Biology",
      assignedTeachers: ["Khaled Fathy", "Amira Nabil"],
    },
    {
      id: 4,
      name: "Sarah Mohamed",
      email: "sarah.mohamed@school.edu",
      status: "approved",
      reviewSubject: "English",
      assignedTeachers: ["Ali Mansour"],
    },
    {
      id: 5,
      name: "Khaled Ali",
      email: "khaled.ali@school.edu",
      status: "pending",
      reviewSubject: "Chemistry",
      assignedTeachers: ["Huda Salem", "Omar Mahmoud"],
    },
  ]);

  const [filteredReviewers, setFilteredReviewers] = useState(reviewers);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [editTeacherModal, setEditTeacherModal] = useState(false);
  const [addNewModal, setAddNewModal] = useState(false);

  const handleStatusChange = (reviewerId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setReviewers((prevReviewers) =>
        prevReviewers.map((reviewer) =>
          reviewer.id === reviewerId ? { ...reviewer, status: newStatus } : reviewer
        )
      );
      message.success(`Reviewer ${newStatus} successfully!`);
      setLoading(false);
    }, 500);
  };

  const handleViewReviewer = (reviewer) => {
    setSelectedReviewer(reviewer);
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
        title={"Manage Reviewers"}
        subtitle={"Review and manage reviewers"}
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
              Add New Reviewer
            </Button>
          </div>
        }
      />
      {/* <RevsStats /> */}
      <div className="mx-auto">
        {/* Filters Section */}

        <SearchAndFilters
          searchPlacehodler={"Search Reviewers"}
          mode={viewMode}
          setMode={setViewMode}
        />

        {/* Table */}

        {viewMode == "table" ? (
          <>
            <RevsTable
              searchText={searchText}
              selectedStatus={selectedStatus}
            />
          </>
        ) : (
          <RevCards
            data={reviewers}
            onView={(r) => {
              setSelectedReviewer(r);
              setViewModalVisible(true);
            }}
            onApprove={(r) => console.log("approve", r)}
            onReject={(r) => console.log("reject", r)}
            onChangeStatus={(r, status) => handleStatusChange(r.id, status)}
          />
        )}
      </div>

      {/* View Reviewer Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold text-gray-800">
            Reviewer Details
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        className="teacher-modal"
      >
        {selectedReviewer && (
          <div className="py-6">
            {/* Reviewer Header */}
            <div className="text-center mb-8">
              <Avatar
                size={100}
                className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-2xl mb-4"
              >
                {getInitials(selectedReviewer.name)}
              </Avatar>
              <Title level={2} className="mb-2">
                {selectedReviewer.name}
              </Title>
              <Badge
                status={getStatusColor(selectedReviewer.status)}
                text={
                  <span className="capitalize font-medium text-lg">
                    {getStatusIcon(selectedReviewer.status)}{" "}
                    {selectedReviewer.status}
                  </span>
                }
              />
            </div>

            <Divider />

            {/* Reviewer Information Grid */}
            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <BookOutlined className="mr-2 text-yellow-600" />
                    Review Subject
                  </Text>
                  <Tag
                    className="px-3 py-1 text-sm"
                    style={{
                      backgroundColor: "#C9AE6C",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {selectedReviewer.reviewSubject}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <MailOutlined className="mr-2 text-blue-600" />
                    Email
                  </Text>
                  <Text className="text-sm text-blue-600">
                    {selectedReviewer.email}
                  </Text>
                </div>
              </Col>
              <Col span={24}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-indigo-600" />
                    Assigned Teachers
                  </Text>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedReviewer.assignedTeachers?.map((teacher, i) => (
                      <Tag
                        key={i}
                        className="px-3 py-1 text-sm"
                        style={{
                          backgroundColor: "#0F74901A",
                          color: "#0F7490",
                          border: "1px solid #0F749020",
                        }}
                      >
                        {teacher}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              {selectedReviewer.status !== "approved" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-600 hover:bg-green-700 border-green-600 px-8"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedReviewer.id, "approved");
                    setViewModalVisible(false);
                  }}
                >
                  Approve Reviewer
                </Button>
              )}
              {selectedReviewer.status !== "rejected" && (
                <Button
                  danger
                  size="large"
                  className="px-8"
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedReviewer.id, "rejected");
                    setViewModalVisible(false);
                  }}
                >
                  Reject Reviewer
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <AddRevModal
        open={addNewModal}
        onCancel={() => setAddNewModal(false)}
        subjectOptions={subjects}
        teacherOptions={availableTeachers}
        onSubmit={(payload) => console.log(payload)}
      />
    </PageLayout>
  );
};

export default ReviewersManagementClient;

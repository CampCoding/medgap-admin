"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
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
  Statistic,
  Row,
  Col,
  Form,
  Badge,
  Typography,
} from "antd";
import DataTable from "./../../../components/layout/DataTable";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
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
  BarChartOutlined,
  CalendarOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { CheckCircle, Archive, Download } from "lucide-react";

const { Option } = Select;
const { Text, Title } = Typography;

const ExamManagerClint = () => {
  const [form] = Form.useForm();

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    subject: "",
    createdBy: "",
    createdDate: "",
    passRate: "",
  });
  const [sortBy, setSortBy] = useState("");
  const [filteredExams, setFilteredExams] = useState(exams);
  const [selectedExams, setSelectedExams] = useState([]);

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

  // Filter and search logic
  useEffect(() => {
    let filtered = [...exams];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(exam => exam.status === filters.status);
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter(exam => exam.subject === filters.subject);
    }

    // Created by filter
    if (filters.createdBy) {
      filtered = filtered.filter(exam => 
        exam.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())
      );
    }

    // Created date filter
    if (filters.createdDate) {
      filtered = filtered.filter(exam => {
        const examDate = new Date(exam.createdDate);
        const filterDate = new Date(filters.createdDate);
        return examDate.toDateString() === filterDate.toDateString();
      });
    }

    // Pass rate filter
    if (filters.passRate) {
      filtered = filtered.filter(exam => {
        switch (filters.passRate) {
          case "0-50":
            return exam.passRate >= 0 && exam.passRate <= 50;
          case "51-70":
            return exam.passRate >= 51 && exam.passRate <= 70;
          case "71-85":
            return exam.passRate >= 71 && exam.passRate <= 85;
          case "86-100":
            return exam.passRate >= 86 && exam.passRate <= 100;
          default:
            return true;
        }
      });
    }

    // Sort
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "title_asc":
            return a.title.localeCompare(b.title);
          case "title_desc":
            return b.title.localeCompare(a.title);
          case "subject_asc":
            return a.subject.localeCompare(b.subject);
          case "subject_desc":
            return b.subject.localeCompare(a.subject);
          case "created_asc":
            return new Date(a.createdDate) - new Date(b.createdDate);
          case "created_desc":
            return new Date(b.createdDate) - new Date(a.createdDate);
          case "questions_asc":
            return a.questions - b.questions;
          case "questions_desc":
            return b.questions - a.questions;
          case "duration_asc":
            return a.duration - b.duration;
          case "duration_desc":
            return b.duration - a.duration;
          case "passRate_asc":
            return a.passRate - b.passRate;
          case "passRate_desc":
            return b.passRate - a.passRate;
          case "attempts_asc":
            return a.attempts - b.attempts;
          case "attempts_desc":
            return b.attempts - a.attempts;
          default:
            return 0;
        }
      });
    }

    setFilteredExams(filtered);
  }, [searchTerm, filters, sortBy, exams]);

  // Filter configuration
  const filterConfig = [
    {
      key: "status",
      label: "Status",
      type: "select",
      placeholder: "All Statuses",
      options: [
        { value: "", label: "All Statuses" },
        { value: "Published", label: "Published" },
        { value: "Draft", label: "Draft" },
        { value: "Archived", label: "Archived" },
      ],
    },
    {
      key: "subject",
      label: "Subject",
      type: "select",
      placeholder: "All Subjects",
      options: [
        { value: "", label: "All Subjects" },
        { value: "Math", label: "Math" },
        { value: "Physics", label: "Physics" },
        { value: "Geography", label: "Geography" },
        { value: "Literature", label: "Literature" },
      ],
    },
    {
      key: "createdBy",
      label: "Created By",
      type: "text",
      placeholder: "Search by creator",
    },
    {
      key: "createdDate",
      label: "Created Date",
      type: "date",
      placeholder: "Select date",
    },
    {
      key: "passRate",
      label: "Pass Rate",
      type: "select",
      placeholder: "All Pass Rates",
      options: [
        { value: "", label: "All Pass Rates" },
        { value: "0-50", label: "0-50%" },
        { value: "51-70", label: "51-70%" },
        { value: "71-85", label: "71-85%" },
        { value: "86-100", label: "86-100%" },
      ],
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "title_asc", label: "Title (A-Z)" },
    { value: "title_desc", label: "Title (Z-A)" },
    { value: "subject_asc", label: "Subject (A-Z)" },
    { value: "subject_desc", label: "Subject (Z-A)" },
    { value: "created_asc", label: "Created (Oldest)" },
    { value: "created_desc", label: "Created (Newest)" },
    { value: "questions_asc", label: "Questions (Few to Many)" },
    { value: "questions_desc", label: "Questions (Many to Few)" },
    { value: "duration_asc", label: "Duration (Short to Long)" },
    { value: "duration_desc", label: "Duration (Long to Short)" },
    { value: "passRate_asc", label: "Pass Rate (Low to High)" },
    { value: "passRate_desc", label: "Pass Rate (High to Low)" },
    { value: "attempts_asc", label: "Attempts (Few to Many)" },
    { value: "attempts_desc", label: "Attempts (Many to Few)" },
  ];

  // Bulk actions
  const bulkActions = [
    {
      key: "publish",
      label: "Publish",
      icon: CheckCircle,
    },
    {
      key: "archive",
      label: "Archive",
      icon: Archive,
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
    console.log("Refreshing exams...");
  };

  const handleExport = () => {
    console.log("Exporting exams...");
  };

  const handleImport = () => {
    console.log("Importing exams...");
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
        <Space size="small">
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
            title="Delete Examss"
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
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const totalExams = exams.length;
  const publishedExams = exams.filter(
    (exam) => exam.status === "Published"
  ).length;
  const totalAttempts = exams.reduce((sum, exam) => sum + exam.attempts, 0);
  const avgPassRate =
    exams
      .filter((exam) => exam.attempts > 0)
      .reduce((sum, exam, _, arr) => sum + exam.passRate / arr.length, 0) || 0;

  return (
    <div style={{ backgroundColor: "#F9FAFC" }} className="min-h-screen ">
      <div className="bg-gradient-to-r from-accent rounded-md shadow-2xl to-cyan-600 !text-white relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-teal-200 rounded-full blur-lg opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-200 rounded-full blur-lg opacity-30 animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-blue-200 rounded-full blur-lg opacity-25 animate-ping delay-2000"></div>
          <div className="absolute top-20 right-1/3 w-8 h-8 bg-purple-200 rounded-full blur-lg opacity-30 animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
          <Title level={1} className="!text-white mb-2">
            Manage Exams
          </Title>
          <Text className="text-white text-lg">
            Create, monitor, and analyze your examination system
          </Text>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddExam}
              size="large"
              className="shadow-lg font-medium"
              style={{
                backgroundColor: "#0F7490",
                borderColor: "#0F7490",
                height: "48px",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
            >
              Create New Exam
            </Button>
          </div>
        </div> */}

        {/* Statistics Cards */}
        <ExamStatsRow
          stats={{
            totalExams: 12,
            publishedExams: 9,
            totalAttempts: 340,
            avgPassRate: 78.6,
          }}
        />

        {/* Search and Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Search exams, subjects, or creators..."
          filters={filterConfig}
          onFiltersChange={setFilters}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          bulkActions={bulkActions}
          selectedItems={selectedExams}
          onBulkAction={handleBulkAction}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onImport={handleImport}
          noMode={true}
        />

        {/* Exams Table */}
        <Card className="shadow-sm border-0">
          <div className="flex items-center justify-between mb-6">
            <div className="mb-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: "#202938" }}
              >
                Exam Overview
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and monitor all your examinations
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddExam}
              size="large"
              className="shadow-lg font-medium"
              style={{
                backgroundColor: "#0F7490",
                borderColor: "#0F7490",
                height: "48px",
                paddingLeft: "24px",
                paddingRight: "24px",
              }}
            >
              Create New Exam
            </Button>
          </div>

          <DataTable
            searchable={false}
            table={{
              header: columns,
              rows: filteredExams,
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
            rowSelection={{
              selectedRowKeys: selectedExams,
              onChange: setSelectedExams,
              type: "checkbox",
            }}
          />

          {/* No Results */}
          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <FileTextOutlined className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No exams found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.values(filters).some(f => f !== "" && f !== "all")
                  ? "Try adjusting your search or filter criteria"
                  : "No exams available at the moment"}
              </p>
              {(searchTerm || Object.values(filters).some(f => f !== "" && f !== "all")) && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ status: "", subject: "", createdBy: "", createdDate: "", passRate: "" });
                    setSortBy("");
                  }}
                  type="primary"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
          {/* 
          <Table
            columns={columns}
            dataSource={exams}
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
          /> */}
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          title={
            <div className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0F7490" }}
              >
                <PlusOutlined className="text-white" />
              </div>
              <span
                className="text-lg font-semibold"
                style={{ color: "#202938" }}
              >
                {editingExam ? "Edit Exam" : "Create New Exam"}
              </span>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
          className="top-8"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-6"
          >
            <Form.Item
              name="title"
              label={
                <span className="font-medium" style={{ color: "#202938" }}>
                  Exam Title
                </span>
              }
              rules={[{ required: true, message: "Please enter exam title" }]}
            >
              <Input placeholder="Enter exam title" className="h-10" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="subject"
                  label={
                    <span className="font-medium" style={{ color: "#202938" }}>
                      Subject
                    </span>
                  }
                  rules={[{ required: true, message: "Please select subject" }]}
                >
                  <Select placeholder="Select subject" className="h-10">
                    <Option value="Math">
                      <Space>{subjectIcons.Math} Math</Space>
                    </Option>
                    <Option value="Physics">
                      <Space>{subjectIcons.Physics} Physics</Space>
                    </Option>
                    <Option value="Geography">
                      <Space>{subjectIcons.Geography} Geography</Space>
                    </Option>
                    <Option value="Literature">
                      <Space>{subjectIcons.Literature} Literature</Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label={
                    <span className="font-medium" style={{ color: "#202938" }}>
                      Status
                    </span>
                  }
                  rules={[{ required: true, message: "Please select status" }]}
                >
                  <Select placeholder="Select status" className="h-10">
                    <Option value="Draft">
                      <Space>
                        <ClockCircleOutlined /> Draft
                      </Space>
                    </Option>
                    <Option value="Published">
                      <Space>
                        <CheckCircleOutlined /> Published
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="questions"
                  label={
                    <span className="font-medium" style={{ color: "#202938" }}>
                      Number of Questions
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please enter number of questions",
                    },
                  ]}
                >
                  <Input type="number" placeholder="25" className="h-10" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="duration"
                  label={
                    <span className="font-medium" style={{ color: "#202938" }}>
                      Duration (minutes)
                    </span>
                  }
                  rules={[{ required: true, message: "Please enter duration" }]}
                >
                  <Input type="number" placeholder="60" className="h-10" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="createdBy"
              label={
                <span className="font-medium" style={{ color: "#202938" }}>
                  Created By
                </span>
              }
              rules={[{ required: true, message: "Please enter creator name" }]}
            >
              <Input placeholder="Enter creator name" className="h-10" />
            </Form.Item>

            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                onClick={() => setIsModalVisible(false)}
                className="h-10 px-6 font-medium"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="h-10 px-6 font-medium"
                style={{
                  backgroundColor: "#0F7490",
                  borderColor: "#0F7490",
                }}
              >
                {editingExam ? "Update Exam" : "Create Exam"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default ExamManagerClint;

function ExamStatsRow({
  stats = {
    totalExams: 0,
    publishedExams: 0,
    totalAttempts: 0,
    avgPassRate: 0,
  },
}) {
  const examStatCards = [
    {
      title: "Total Exams",
      valueKey: "totalExams",
      icon: <FileTextOutlined className="text-white text-2xl" />,
      bgColor: "#0F7490",
      valueStyle: { color: "#0F7490" },
    },
    {
      title: "Published",
      valueKey: "publishedExams",
      icon: <CheckCircleOutlined className="text-white text-2xl" />,
      bgColor: "#22c55e",
      valueStyle: { color: "#22c55e" },
    },
    {
      title: "Total Attempts",
      valueKey: "totalAttempts",
      icon: <TeamOutlined className="text-white text-2xl" />,
      bgColor: "#8B5CF6",
      valueStyle: { color: "#8B5CF6" },
    },
    {
      title: "Avg Pass Rate",
      valueKey: "avgPassRate",
      icon: <TrophyOutlined className="text-white text-2xl" />,
      bgColor: "#C9AE6C",
      suffix: "%",
      formatter: (v) => Math.round(v),
      valueStyle: { color: "#C9AE6C" },
    },
  ];

  return (
    <Row gutter={[24, 24]} className="mb-8 mt-8">
      {examStatCards.map((c) => {
        const rawValue = stats[c.valueKey];
        const displayValue = c.formatter ? c.formatter(rawValue) : rawValue;
        return (
          <Col key={c.valueKey} xs={24} sm={12} md={6}>
            <Card className="text-center   border-1 border-primary/30  shadow-sm hover:shadow-md transition-shadow ">
              <div className="mb-3">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                  style={{ backgroundColor: c.bgColor }}
                >
                  {c.icon}
                </div>
              </div>
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">{c.title}</span>
                }
                value={displayValue}
                suffix={c.suffix}
                valueStyle={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  ...c.valueStyle,
                }}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

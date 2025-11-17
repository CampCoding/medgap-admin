import {
  Avatar,
  Badge,
  Card,
  Tag,
  Tooltip,
  Typography,
  Space,
  Modal,
  Divider,
  Row,
  Col,
} from "antd";
import React, { useEffect, useState } from "react";
import DataTable from "../layout/DataTable";
import { Mail } from "lucide-react";

import Button from '../atoms/Button';
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

const { Text, Title } = Typography;

const RevsTable = ({ searchText, selectedStatus }) => {
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
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
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

  useEffect(() => {
    let filtered = teachers;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (teacher) => teacher.status === selectedStatus
      );
    }

    if (searchText) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchText.toLowerCase()) ||
          teacher.subjects.includes(searchText.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
  }, [teachers, selectedStatus, searchText]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  
  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
  };


  const columns = [
    {
      title: "Reviewer",
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
            <Text className="text-gray-900">{name}</Text>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Mail className="mr-1 text-xs" />
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Modules",
      dataIndex: "subjects",
      key: "subjects",
      render: (subject) => (
        <div className="flex flex-wrap w-full max-w-[200px] gap-2">
          {subject.map((sub, i) => (
            <Tag
              key={i}
              className="px-3 py-1 w-fit text-xs font-medium border-0"
              style={{
                backgroundColor: "#26829B",
                color: "white",
              }}
            >
              {/* <BookOutlined className="mr-1" /> */}
              {sub}
            </Tag>
          ))}
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
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (experience) => (
        <div className="flex items-center text-gray-700">
          <TrophyOutlined className="mr-2 text-yellow-500" />
          {experience}
        </div>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
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
              className="bg-purple-600 !w-fit flex items-center justify-center hover:bg-purple-700 border-purple-600"
              onClick={() => handleViewTeacher(record)}
            />
          </Tooltip>
          {record.status !== "approved" && (
            <Button
              type="primary"
              size="small"
              className="bg-green-600 hover:bg-green-700 border-green-600"
              loading={loading}
              onClick={() => handleStatusChange(record.id, "approved")}
            >
              Approve
            </Button>
          )}
          {record.status !== "rejected" && (
            <Button
              danger
              size="small"
              loading={loading}
              onClick={() => handleStatusChange(record.id, "rejected")}
            >
              Reject
            </Button>
          )}
        </Space>
      ),
    },
  ];

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

  return (
    <>
      <Card className="shadow-lg border-0">
        <DataTable
          searchable={false}
          table={{ header: columns, rows: filteredTeachers }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600">
                Showing {range[0]}-{range[1]} of {total} teachers
              </span>
            ),
          }}
        />
      </Card>

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
    </>
  );
};

export default RevsTable;

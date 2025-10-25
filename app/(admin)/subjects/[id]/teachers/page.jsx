"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Modal,
  message,
  Row,
  Col,
  Avatar,
  Badge,
  Typography,
  Divider,
  Pagination,
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { handleGetModuleTeachers } from "../../../../../features/modulesSlice";
import DeleteTeacherModal from "../../../../../components/Teachers/DeleteTeacherModal";
import { handleChangeReviewerStatus } from "../../../../../features/reviewersSlice";
import { toast } from "react-toastify";

const { Text, Title } = Typography;

const SubjectTeachers = () => {
  const { id } = useParams();

  // State for teachers data from API
  const [apiTeachers, setApiTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [addNewModal, setAddNewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  function handleDelete(teacher) {
    setOpenDeleteModal(teacher);
  }

  const dispatch = useDispatch();

  // Transform API teacher data to match frontend format
  const transformTeacherData = (apiTeacher, moduleInfo) => {
    return {
      id: apiTeacher.teacher_id,
      name: apiTeacher.full_name,
      email: apiTeacher.email,
      phone: apiTeacher.phone,
      subjects: moduleInfo ? [moduleInfo.subject_name] : [],
      status: apiTeacher.status,
      joinDate: apiTeacher.join_date,
      experience: `${apiTeacher.experience_years} years`,
      qualification: apiTeacher.qualification,
      avatar: apiTeacher.image_url,
      notes: apiTeacher.notes,
      assignment_status: apiTeacher.assignment_status,
      moduleInfo: moduleInfo,
      _original: apiTeacher, // Keep original data for API calls
    };
  };

  // Fetch teachers with pagination
  const fetchTeachers = (page = 1, pageSize = 10) => {
    setLoading(true);
    dispatch(handleGetModuleTeachers({ id, page, limit: pageSize }))
      .unwrap()
      .then((response) => {
        if (response.status === "success") {
          const { teachers, module, count, pagination: apiPagination } = response.data;
          
          // Transform API data to match frontend format
          const transformedTeachers = teachers.map(teacher => 
            transformTeacherData(teacher, module)
          );
          
          setApiTeachers(transformedTeachers);
          setFilteredTeachers(transformedTeachers);
          
          // Update pagination
          setPagination({
            current: apiPagination?.page || page,
            pageSize: apiPagination?.limit || pageSize,
            total: apiPagination?.total || count,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
        message.error("Failed to load teachers");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle status change for teachers
  const handleStatusChange = async (teacherId, newStatus) => {
    console.log("Changing status:", teacherId, newStatus);
    setLoading(true);
    try {
      // Use the reviewer status change API for teachers
      await dispatch(
        handleChangeReviewerStatus({
          id: teacherId?.id,
          body: {
            status: newStatus,
          },
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.status === "success") {
            toast.success(res?.message || "Status updated successfully");
            // Refresh the teachers list
            fetchTeachers(pagination.current, pagination.pageSize);
          } else {
            throw new Error(res?.message || "Failed to update status");
          }
        });
    } catch (error) {
      console.error("Status change error:", error);
      message.error(error?.message || `Failed to update teacher status`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(1, 10);
  }, [id]);

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    fetchTeachers(page, pageSize);
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

  // Filter teachers based on search and status
  useEffect(() => {
    let filtered = apiTeachers;

    // Filter by search text
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter(teacher => teacher.status === selectedStatus);
    }

    setFilteredTeachers(filtered);
  }, [searchTerm, selectedStatus, apiTeachers]);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/modules", icon: Users },
    { label: "Module Teachers", href: `/modules/${id}/teachers`, icon: Users, current: true },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      <PagesHeader
        title={"Manage Module Teachers"}
        subtitle={`Review and manage teachers for ${apiTeachers[0]?.moduleInfo?.subject_name || 'this module'}`}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              onClick={() => setAddNewModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add Teacher to Module
            </Button>
          </div>
        }
      />
      
      {/* Teacher Stats */}
      <TeacherStats teachers={apiTeachers} />

      <div className="mx-auto">
        {/* Search and Filters */}
        <SearchAndFilters 
          mode={viewMode} 
          setMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchPlacehodler="Search teachers by name, email, or qualification..."
        />

        {/* Filter Section - Conditionally rendered */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Teachers</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              {/* Add more filter options here as needed */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">Experience</label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div>Loading teachers...</div>
          </div>
        )}

        {/* Teachers List */}
        {!loading && (
          <>
            {viewMode === "table" ? (
              <TeachersTable
                data={filteredTeachers}
                loading={loading}
                onView={handleViewTeacher}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <TeacherCards
                onDelete={(t) => handleDelete(t)}
                data={filteredTeachers}
                onChangeStatus={(teacher, status) =>
                  handleStatusChange(teacher, status)
                }
                onView={handleViewTeacher}
                onApprove={(teacher) =>
                  handleStatusChange(teacher, "approved")
                }
                onReject={(teacher) =>
                  handleStatusChange(teacher, "rejected")
                }
                id={id}
              />
            )}

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  current={pagination.current}
                  pageSize={pagination.pageSize}
                  total={pagination.total}
                  onChange={handlePaginationChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} teachers`
                  }
                />
              </div>
            )}
          </>
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
                    Module
                  </Text>
                  <div className="flex flex-wrap items-center space-y-2">
                    {selectedTeacher.subjects.map((subject, i) => (
                      <Tag
                        key={i}
                        className="px-3 py-1 text-sm h-fit w-fit"
                        style={{
                          backgroundColor: "#C9AE6C",
                          color: "white",
                          border: "none",
                        }}
                      >
                        {subject}
                      </Tag>
                    ))}
                  </div>
                  {selectedTeacher.moduleInfo && (
                    <div className="mt-2 text-xs text-gray-600">
                      Code: {selectedTeacher.moduleInfo.subject_code}
                    </div>
                  )}
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
              {selectedTeacher.notes && (
                <Col span={24}>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Text strong className="text-gray-700 flex items-center mb-2">
                      Notes
                    </Text>
                    <Text>{selectedTeacher.notes}</Text>
                  </div>
                </Col>
              )}
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
                    handleStatusChange(selectedTeacher._original.teacher_id, "approved");
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
                    handleStatusChange(selectedTeacher._original.teacher_id, "rejected");
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

      <DeleteTeacherModal 
        data={openDeleteModal}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        id={id}
      />
    </PageLayout>
  );
};

export default SubjectTeachers;
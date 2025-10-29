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
  Pagination,
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
import {
  BarChart3,
  Download,
  Plus,
  Upload,
  Users,
  CheckCircle,
  X,
  Notebook,
  User,
} from "lucide-react";
import Button from "./../../../components/atoms/Button";
import TeacherStats from "../../../components/Teachers/TeachersStats";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import TeachersTable from "../../../components/Teachers/TeachersTable";
import TeacherCards from "../../../components/Teachers/TeachersGrid";
import { subjects } from "../../../data/subjects";
import AddTeacherModal from "../../../components/Teachers/AddTeacherModal.modal";
import EditTeacherModal from "../../../components/Teachers/EditTeacher.modal";
import { useDispatch, useSelector } from "react-redux";
import {
  handleChangeTeacherStatus,
  handleGetAllTeachers,
  updateTeacherStatus,
} from "../../../features/teachersSlice";
import { toast } from "react-toastify";
import DeleteTeacherModal from "../../../components/Teachers/DeleteTeacherModal";

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
  
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const { all_teachers_loading, teachers_list } = useSelector(
    (state) => state?.teachers
  );

  const [filteredTeachers, setFilteredTeachers] = useState([]);
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

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [apiFilters, setApiFilters] = useState({
    limit: 10,
    offset: 0,
    search: "",
    status: "",
  });

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  // Transform API data to match your frontend structure
  const transformTeacherData = (apiTeachers) => {
    return (
      apiTeachers?.map((teacher) => ({
        id: teacher.teacher_id,
        name: teacher.full_name,
        email: teacher.email,
        phone: teacher.phone,
        subjects: teacher.subjects || [],
        status: teacher.status,
        joinDate: teacher.join_date,
        experience: `${teacher.experience_years} years`,
        qualification: teacher.qualification,
        avatar: teacher.full_image_url,
        notes: teacher.notes,
        _original: teacher, // Keep original data for API calls
      })) || []
    );
  };

  const handleStatusChange = async (teacherId, newStatus) => {
    setLoading(true);
    try {
      await dispatch(
        handleChangeTeacherStatus({
          id: teacherId,
          body: {
            status: newStatus,
          },
        })
      )
        .unwrap()
        .then((res) => {
          if (res?.status == "success") {
            toast.success(res?.message);
            dispatch(handleGetAllTeachers());
            window.location.reload();
          }
        });
    } catch (error) {
      message.error(error || `Failed to update teacher status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(selectedTeacher);
  }, [selectedTeacher]);

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
  };

  const handleAssignReviewer = async (payload) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // If you have an API for assigning reviewers, implement it here
      message.success(
        `Reviewer ${
          payload.action === "remove" ? "removed" : "assigned"
        } successfully!`
      );
    } catch (error) {
      message.error("Failed to update reviewer assignment.");
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    const newOffset = (page - 1) * pageSize;
    setApiFilters((prev) => ({
      ...prev,
      limit: pageSize,
      offset: newOffset,
    }));
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  // Fetch teachers with pagination and filters
  const fetchTeachers = () => {
    dispatch(handleGetAllTeachers(apiFilters));
  };

  // Update teachers data when API response changes
  useEffect(() => {
    if (teachers_list?.data?.teachers) {
      const transformedTeachers = transformTeacherData(
        teachers_list.data.teachers
      );
      setFilteredTeachers(transformedTeachers);

      // Update pagination from API response
      if (teachers_list.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: teachers_list.pagination.total || 0,
          current: teachers_list.pagination.page || 1,
          pageSize: teachers_list.pagination.limit || 10,
        }));
      }
    }
  }, [teachers_list]);

  // Fetch teachers when API filters change
  useEffect(() => {
    fetchTeachers();
  }, [apiFilters]);

  // Update API filters when search or filters change (for server-side filtering)
  useEffect(() => {
    setApiFilters((prev) => ({
      ...prev,
      search: searchText,
      status: filters.status || "",
      offset: 0, // Reset to first page when filters change
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchText, filters.status]);

  // Client-side filtering for additional filters (experience, qualification, etc.)
  useEffect(() => {
    if (!teachers_list?.data?.teachers) return;

    let filtered = transformTeacherData(teachers_list.data.teachers);

    // Experience filter (client-side)
    if (filters.experience) {
      filtered = filtered.filter((teacher) => {
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

    // Qualification filter (client-side)
    if (filters.qualification) {
      filtered = filtered.filter((teacher) =>
        teacher.qualification
          .toLowerCase()
          .includes(filters.qualification.toLowerCase())
      );
    }

    // Join date filter (client-side)
    if (filters.joinDate) {
      filtered = filtered.filter((teacher) => {
        const teacherDate = new Date(teacher.joinDate);
        const filterDate = new Date(filters.joinDate);
        return teacherDate.toDateString() === filterDate.toDateString();
      });
    }

    // Subjects filter (client-side)
    if (filters.subjects && filters.subjects.length > 0) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.subjects &&
          filters.subjects.some((subject) => teacher.subjects.includes(subject))
      );
    }

    // Sort (client-side)
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
  }, [
    filters.experience,
    filters.qualification,
    filters.joinDate,
    filters.subjects,
    sortBy,
    teachers_list,
  ]);

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
    fetchTeachers();
    message.success("Teachers list refreshed!");
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

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Teachers", href: "/teachers", icon: Users, current: true },
  ];

  function handleDelete(teacher) {
    console.log(teacher);
    setOpenDeleteModal(teacher);
  }

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      <PagesHeader
        title={"Manage Teachers"}
        subtitle={"Review and manage teacher applications and profiles"}
        extra={
          <div className="flex items-center space-x-4">
            {/* <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button> */}
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
      <TeacherStats  />
      <div className="mx-auto">
        {/* Search and Filters */}
        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchText}
          setSearchTerm={setSearchText}
          searchPlaceholder="Search teachers, email, phone, or subjects..."
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          onRefresh={handleRefresh}
        />

        {/* Filters Section - Conditionally Rendered */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Teachers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end mt-4">
              <Button
                type="default"
                onClick={() => {
                  setFilters({
                    status: "",
                    experience: "",
                    qualification: "",
                    joinDate: "",
                    subjects: [],
                  });
                  setSortBy("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === "table" ? (
          <TeachersTable
            data={teachers_list?.data?.teachers || []}
            loading={all_teachers_loading}
            searchText={searchText}
            selectedStatus={filters.status}
            onView={handleViewTeacher}
            onApprove={(t) =>
              handleStatusChange(t._original.teacher_id, "approved")
            }
            onReject={(t) =>
              handleStatusChange(t._original.teacher_id, "rejected")
            }
            onChangeStatus={(t, s) =>
              handleStatusChange(t._original.teacher_id, s)
            }
            onEdit={(t) => {
              setSelectedTeacher(t); // for your EditTeacherModal
              setEditTeacherModal(true);
            }}
            onDelete={(t) => handleDelete(t)} // opens your DeleteTeacherModal
          />
        ) : (
          <TeacherCards
            data={teachers_list?.data?.teachers || []}
            loading={all_teachers_loading}
            onView={(teacher) => handleViewTeacher(teacher)}
            onApprove={(teacher) =>
              handleStatusChange(teacher._original.teacher_id, "approved")
            }
            onReject={(teacher) =>
              handleStatusChange(teacher._original.teacher_id, "rejected")
            }
            onChangeStatus={(teacher, status) =>
              handleStatusChange(teacher._original.teacher_id, status)
            }
            onDelete={(teacher) => handleDelete(teacher)}
            onAssignReviewer={handleAssignReviewer}
            reviewerOptions={reviewers}
            subjectOptions={subjects}
          />
        )}

        {/* Pagination */}
        {teachers_list?.pagination?.total > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={teachers_list.pagination.total}
              onChange={handlePaginationChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        )}

        {/* No Results */}
        {/* {!all_teachers_loading && filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No teachers found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchText ||
              Object.values(filters).some((f) => f !== "" && f !== "all")
                ? "Try adjusting your search or filter criteria"
                : "No teachers available at the moment"}
            </p>
            {(searchText ||
              Object.values(filters).some((f) => f !== "" && f !== "all")) && (
              <Button
                onClick={() => {
                  setSearchText("");
                  setFilters({
                    status: "",
                    experience: "",
                    qualification: "",
                    joinDate: "",
                    subjects: [],
                  });
                  setSortBy("");
                }}
                type="primary"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )} */}
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
              {selectedTeacher?.avatar ? (
                <img
                  src={selectedTeacher?.avatar}
                  className="w-[120px] h-[120px] object-cover mx-auto rounded-full"
                />
              ) : (
                <Avatar
                  size={100}
                  className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-2xl mb-4"
                >
                  {getInitials(selectedTeacher?.name)}
                </Avatar>
              )}
              <Title level={2} className="mb-2">
                {selectedTeacher?.name}
              </Title>
              <Badge
                status={getStatusColor(selectedTeacher?.status)}
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
                    <Notebook className="mr-2 text-yellow-600" />
                    Notes
                  </Text>
                  <Text className="text-lg">{selectedTeacher?.notes}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text
                    strong
                    className="text-gray-700 flex flex-row !items-center mb-2"
                  >
                    <Notebook className="mr-2 text-yellow-600" />
                    Modules
                  </Text>
                  <div className="flex gap-2 flex-wrap items-center">
                    {selectedTeacher?._original?.active_modules?.map((item) => (
                      <Tag>{item?.subject_name}</Tag>
                    ))}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text
                    strong
                    className="text-gray-700 flex flex-row !items-center mb-2"
                  >
                    <TrophyOutlined className="mr-2 text-yellow-600" />
                    Experience
                  </Text>
                  <Text className="text-lg">{selectedTeacher.experience}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text
                    strong
                    className="text-gray-700 flex !flex-row !items-center mb-2"
                  >
                    <User className="mr-2 text-yellow-600" />
                    Role
                  </Text>
                  <Text className="text-lg">
                    {selectedTeacher._original?.role}
                  </Text>
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
                    handleStatusChange(
                      selectedTeacher._original.teacher_id,
                      "approved"
                    );
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
                    handleStatusChange(
                      selectedTeacher._original.teacher_id,
                      "rejected"
                    );
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
      />
    </PageLayout>
  );
};

export default TeachersManagementClient;
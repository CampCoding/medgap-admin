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
// import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import TeachersTable from "../../../components/Teachers/TeachersTable";
import TeacherCards from "../../../components/Teachers/TeachersGrid";
import { subjects } from "../../../data/subjects";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DeleteTeacherModal from "../../../components/Teachers/DeleteTeacherModal";
import {
  handleChangeReviewerStatus,
  handleGetAllReviewers,
} from "../../../features/reviewersSlice";
import AddReviewerModal from "../../../components/Reviewers/AddRevModal.modal";
import DeleteReviewerModal from "../../../components/Reviewers/DeleteReviewerModal";
import ReviewersTable from "../../../components/Reviewers/ReviewersTable";

const { Text, Title } = Typography;

const ReviewersManagementClient = () => {
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

  const dispatch = useDispatch();
  const { all_reviewers_loading, reviewers_list } = useSelector(
    (state) => state?.reviwers
  );

  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | table
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
  
  useEffect(() => {
    console.log(selectedTeacher);
   } , [selectedTeacher])

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

  // Transform API data to match your frontend structure (used only in some places)
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
        handleChangeReviewerStatus({
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
            dispatch(handleGetAllReviewers());
          }
        });
    } catch (error) {
      message.error(error || `Failed to update teacher status: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeacher = (teacher) => {
    console.log(teacher);
    setSelectedTeacher(
      // normalize for the modal preview (expects transformed)
      {
        id: teacher.teacher_id,
        name: teacher?.name || teacher?.full_name,
        email: teacher.email,
        phone: teacher.phone,
        subjects: teacher.subjects || [],
        status: teacher.status,
        joinDate: teacher.join_date,
        experience:
          typeof teacher.experience_years === "number"
            ? `${teacher.experience_years} years`
            : teacher.experience,
        qualification: teacher.qualification,
        avatar: teacher.full_image_url,
        notes: teacher.notes,
        _original: teacher,
      }
    );
    setViewModalVisible(true);
  };

  const handleAssignReviewer = async (payload) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
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

  // Pagination change
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

  // Fetch (server)
  const fetchTeachers = () => {
    dispatch(handleGetAllReviewers());
  };

  // Update teachers when API response changes
  useEffect(() => {
    if (reviewers_list?.data?.teachers) {
      // Keep RAW API rows here; we’ll filter locally and pass downstream
      const raw = reviewers_list.data.teachers;
      setFilteredTeachers(raw);

      if (reviewers_list.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: reviewers_list.pagination.total || 0,
          current: reviewers_list.pagination.page || 1,
          pageSize: reviewers_list.pagination.limit || 10,
        }));
      }
    }
  }, [reviewers_list]);

  // Fetch when API filters change (status/limit/offset)
  useEffect(() => {
    fetchTeachers();
  }, [apiFilters]);

  // Only status should influence server-side filters; search is local now.
  useEffect(() => {
    setApiFilters((prev) => ({
      ...prev,
      status: filters.status || "",
      offset: 0,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status]);

  // 🔎 CLIENT-SIDE FILTERING (search + other filters + sort) over RAW API rows
  useEffect(() => {
    const src = reviewers_list?.data?.teachers;
    if (!Array.isArray(src)) return;

    let filtered = [...src];

    // Text search across many fields
    const q = (searchText || "").trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((t) => {
        const haystack = [
          t.full_name,
          t.email,
          t.phone,
          t.qualification,
          t.notes,
          t.status,
          t.role,
          String(t.experience_years ?? ""),
          t.join_date,
          ...(Array.isArray(t.subjects) ? t.subjects : []),
          ...(Array.isArray(t.active_modules)
            ? t.active_modules.map((m) => m.subject_name)
            : []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    // Status (also applied server-side; keep here so UI reflects instantly)
    if (filters.status) {
      filtered = filtered.filter(
        (t) => (t.status || "").toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Experience filter (use numeric years)
    if (filters.experience) {
      filtered = filtered.filter((t) => {
        const years = parseInt(t.experience_years ?? 0, 10);
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

    // Qualification
    if (filters.qualification) {
      const f = filters.qualification.toLowerCase();
      filtered = filtered.filter((t) =>
        (t.qualification || "").toLowerCase().includes(f)
      );
    }

    // Join date (exact day match)
    if (filters.joinDate) {
      const filterDate = new Date(filters.joinDate).toDateString();
      filtered = filtered.filter(
        (t) => new Date(t.join_date).toDateString() === filterDate
      );
    }

    // Subjects: match either explicit subjects or active module subject names
    if (filters.subjects && filters.subjects.length > 0) {
      filtered = filtered.filter((t) => {
        const subjectsFromRow = new Set([
          ...(Array.isArray(t.subjects) ? t.subjects : []),
          ...(Array.isArray(t.active_modules)
            ? t.active_modules.map((m) => m.subject_name)
            : []),
        ]);
        return filters.subjects.some((s) => subjectsFromRow.has(s));
      });
    }

    // Sort
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "name_asc":
            return (a.full_name || "").localeCompare(b.full_name || "");
          case "name_desc":
            return (b.full_name || "").localeCompare(a.full_name || "");
          case "joinDate_asc":
            return new Date(a.join_date) - new Date(b.join_date);
          case "joinDate_desc":
            return new Date(b.join_date) - new Date(a.join_date);
          case "experience_asc":
            return (a.experience_years ?? 0) - (b.experience_years ?? 0);
          case "experience_desc":
            return (b.experience_years ?? 0) - (a.experience_years ?? 0);
          case "status_asc":
            return (a.status || "").localeCompare(b.status || "");
          case "status_desc":
            return (b.status || "").localeCompare(a.status || "");
          default:
            return 0;
        }
      });
    }

    setFilteredTeachers(filtered);
  }, [
    reviewers_list,
    searchText,
    filters.status,
    filters.experience,
    filters.qualification,
    filters.joinDate,
    filters.subjects,
    sortBy,
  ]);

  // Filter configuration (kept in case you re-enable SearchAndFilters)
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
  };

  const handleRefresh = () => {
    fetchTeachers();
    message.success("Reviwers list refreshed!");
  };

  const handleExport = () => {
    console.log("Exporting Reviwers...");
  };

  const handleImport = () => {
    console.log("Importing Reviwers...");
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
    return name?.split(" ")?.map((n) => n[0]).join("").toUpperCase();
  };

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Reviwers", href: "/reviewers", icon: Users, current: true },
  ];

  function handleDelete(teacher) {
    setOpenDeleteModal(teacher);
  }

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      <PagesHeader
        title={"Manage reviewers"}
        subtitle={"Review and manage reviewers applications and profiles"}
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
              Add New reviewers
            </Button>
          </div>
        }
      />

      <TeacherStats data={reviewers_list?.data?.teachers} role="reviewer" />

      <div className="mx-auto">
        {/* 🔎 Global Search (client-side across all fields) */}
        <div className="mb-4">
          <Input
            placeholder="Search name, email, phone, qualification, notes, status, role, subjects, modules…"
            allowClear
            enterButton
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(v) => setSearchText(v)}
          />
        </div>

        {/* You can re-enable your full filter bar if needed */}
        {/* <SearchAndFilters ... /> */}

        {/* Content */}
        {viewMode === "table" ? (
          <ReviewersTable
            data={filteredTeachers || []}                 
            loading={all_reviewers_loading}
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
              setSelectedTeacher(t);
              setEditTeacherModal(true);
            }}
            onDelete={(t) => handleDelete(t)}
          />
        ) : (
          <TeacherCards
            data={filteredTeachers || []}               
            loading={all_reviewers_loading}
            onView={(teacher) => handleViewTeacher(teacher)}
            onApprove={(teacher) =>
              handleStatusChange(teacher.teacher_id ?? teacher._original?.teacher_id, "approved")
            }
            entityType="reviewer"
            onReject={(teacher) =>
              handleStatusChange(teacher.teacher_id ?? teacher._original?.teacher_id, "rejected")
            }
            onChangeStatus={(teacher, status) =>
              handleStatusChange(teacher.teacher_id ?? teacher._original?.teacher_id, status)
            }
            onDelete={(teacher) => handleDelete(teacher)}
            onAssignReviewer={handleAssignReviewer}
            reviewerOptions={reviewers}
            subjectOptions={subjects}
          />
        )}

        {/* Pagination */}
        {reviewers_list?.pagination?.total > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={reviewers_list.pagination.total}
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
        {/* {!all_reviewers_loading && filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No reviewers found
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
            reviewers Details
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
                  <div className="flex gap-2 items-center">
                    {selectedTeacher?._original?._original?.active_modules?.map((item) => (
                      <Tag key={item?.module_id}>{item?.subject_name}</Tag>
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
                    Reviewer
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
                    {new Date(selectedTeacher.join_date).toLocaleDateString()}
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
                  Approve Reviewer
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
                  Reject Reviewer
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <AddReviewerModal
        open={addNewModal}
        onCancel={() => setAddNewModal(false)}
        subjectOptions={subjects}
        onSubmit={(payload) => console.log(payload)}
      />

      <DeleteReviewerModal
        data={openDeleteModal}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
      />
    </PageLayout>
  );
};

export default ReviewersManagementClient;

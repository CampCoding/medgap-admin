"use client";

import React, { useEffect, useState } from "react";
import PageLayout from "../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../components/ui/BreadCrumbs";
import {
  BarChart3,
  Book,
  BookOpen,
  Calendar,
  Download,
  Edit3,
  FileText,
  Plus,
  Search,
  Upload,
  Users,
  X,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import PagesHeader from "./../../../components/ui/PagesHeader";
import Button from "../../../components/atoms/Button";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
import Table from "../../../components/ui/Table";
import SubjectCard from "../../../components/ui/Cards/SubjectCard";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import AddSubjectForm from "../../../components/Subjects/AddNewSubject.modal.jsx";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import AdvancedSubjectsFilters from "../../../components/ui/AdvancedFilters";
import InActiveSubjectModal from "../../../components/Subjects/InActiveSubjectModal";
import EditSubjectForm from "../../../components/Subjects/EditNewSubjectModal"; // ✅ edit modal
import { Card, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  handleGetAllModules,
  handleGetAllModulesStatistics,
} from "../../../features/modulesSlice";
import { useRouter } from "next/navigation";

const SubjectsManagementClient = () => {
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book, current: true },
  ];

  const router = useRouter();

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [NewModal, setNewModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalType, setModalType] = useState(null); // 'delete' or 'deactivate'

  // Edit modal state (used by table)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editRow, setEditRow] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    difficulty: "all",
    sortBy: "name",
    sortOrder: "asc",
    dateRange: "all",
    studentRange: "all",
    questionRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [openInactiveModal, setOpenInActiveModal] = useState(false);

  // Redux
  const dispatch = useDispatch();
  const {
    list_module_loading,
    list_module_data,
    list_module_error,
    modules_statistic,
  } = useSelector((state) => state?.modules);

  useEffect(() => {
    // Fetch modules with pagination parameters
    dispatch(handleGetAllModules({ page: currentPage, limit: pageSize }));
    dispatch(handleGetAllModulesStatistics());
  }, [dispatch, currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  // Handle subject actions coming from Card & Table
  const handleSubjectAction = (subject, actionType) => {
    if (actionType === "edit") {
      setEditRow(subject);
      setOpenEditModal(true);
      return;
    }
    if (actionType === "deactivate") {
      setOpenInActiveModal(subject);
      return;
    }
    // default: delete
    setSelectedSubject(subject);
    setModalType(actionType);
  };

  const handleCloseModal = () => {
    setSelectedSubject(null);
    setModalType(null);
  };

  // Transform API data to match component expectations
  const transformApiData = (apiData) => {
    if (!apiData?.modules) return [];

    return apiData.modules.map((module) => ({
      id: module.module_id,
      name: module.subject_name,
      code: module.subject_code,
      color: module.subject_color,
      description: module.description || "No description available",
      status: module.status || "draft",
      difficulty: "Medium",
      students: module.students_count || 0,
      questions: module.questions_count || 0,
      units: module.units_count || 0,
      lastUpdated: module.updated_at || new Date().toISOString(),
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "green";
      case "Medium":
        return "gold";
      case "Hard":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "blue";
      case "draft":
        return "purple";
      case "archived":
        return "default";
      default:
        return "default";
    }
  };

  // Data + pagination from API
  const subjectsData = transformApiData(list_module_data?.data);
  const paginationInfo = list_module_data?.data?.pagination;

  // Search + filter
  const searchSubjects = (subjects, term) => {
    if (!term.trim()) return subjects;
    const q = term.toLowerCase();
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  };

  const filterSubjects = (subjects, f) =>
    subjects.filter((s) => {
      if (f.status !== "all" && s.status !== f.status) return false;
      if (f.difficulty !== "all" && s.difficulty !== f.difficulty) return false;

      if (f.studentRange !== "all") {
        const n = s.students;
        if (f.studentRange === "0-50" && !(n <= 50)) return false;
        if (f.studentRange === "51-100" && !(n >= 51 && n <= 100)) return false;
        if (f.studentRange === "101-200" && !(n >= 101 && n <= 200)) return false;
        if (f.studentRange === "200+" && !(n >= 201)) return false;
      }

      if (f.questionRange !== "all") {
        const n = s.questions;
        if (f.questionRange === "0-50" && !(n <= 50)) return false;
        if (f.questionRange === "51-100" && !(n >= 51 && n <= 100)) return false;
        if (f.questionRange === "101-200" && !(n >= 101 && n <= 200)) return false;
        if (f.questionRange === "200+" && !(n >= 201)) return false;
      }

      return true;
    });

  const sortSubjects = (subjects, sortBy, sortOrder) => {
    return [...subjects].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "code":
          aValue = a.code.toLowerCase();
          bValue = b.code.toLowerCase();
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          aValue = difficultyOrder[a.difficulty] || 0;
          bValue = difficultyOrder[b.difficulty] || 0;
          break;
        case "students":
          aValue = a.students;
          bValue = b.students;
          break;
        case "questions":
          aValue = a.questions;
          bValue = b.questions;
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getFilteredSubjects = () => {
    let filtered = searchSubjects(subjectsData, searchTerm);
    filtered = filterSubjects(filtered, filters);
    filtered = sortSubjects(filtered, filters.sortBy, filters.sortOrder);
    return filtered;
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "all",
      difficulty: "all",
      sortBy: "name",
      sortOrder: "asc",
      dateRange: "all",
      studentRange: "all",
      questionRange: "all",
    });
  };

  const hasActiveFilters = () =>
    searchTerm ||
    filters.status !== "all" ||
    filters.difficulty !== "all" ||
    filters.studentRange !== "all" ||
    filters.questionRange !== "all";

  // TABLE COLUMNS (now with full actions parity)
  const columns = [
    {
      title: "Module",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: record.color }}
          >
            {record.name.substring(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-[#202938]">{text}</div>
            <div className="text-xs text-[#202938]/60">Code: {record.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div className="max-w-xs">
          <p className="text-sm text-[#202938]/80 line-clamp-2">{text}</p>
        </div>
      ),
    },
    {
      title: "Stats",
      key: "stats",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <BookOpen className="w-3 h-3" />
            <span>{record.units} units</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Users className="w-3 h-3" />
            <span>{record.students} students</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <FileText className="w-3 h-3" />
            <span>{record.questions} questions</span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) => (
        <Badge color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      ),
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: true,
      render: (date) => (
        <div className="flex items-center space-x-1 text-sm text-[#202938]/60">
          <Calendar className="w-3 h-3" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          {/* Details */}
          <Button
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
            onClick={() => router.push(`/subjects/${record.id}/units`)}
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Edit */}
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
            onClick={() => {
              setEditRow(record);
              setOpenEditModal(true);
            }}
            title="Edit module"
          >
            <Edit3 className="w-4 h-4" />
          </Button>

          {/* Delete */}
          <Button
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
            onClick={() => handleSubjectAction(record, "delete")}
            title="Delete module"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Inactive (only if active) */}
          {record?.status === "active" && (
            <Button
              type="text"
              size="small"
              className="text-orange-500 hover:bg-orange-50"
              onClick={() => setOpenInActiveModal(record)}
              title="Set inactive"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        title={"Modules Management"}
        subtitle={"Organize and manage your teaching modules"}
        extra={
          <div className="flex items-center space-x-4">
            {/* <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button> */}
            <Button
              onClick={() => setNewModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Module
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <SubjectsStats subjects={modules_statistic?.data?.stats} />

      {/* Search and Filters */}
      <SearchAndFilters
        mode={viewMode}
        setMode={setViewMode}
        searchTerm={searchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setSearchTerm={setSearchTerm}
        searchPlacehodler="Search modules, codes, descriptions..."
      />

      {/* Advanced Filter Controls */}
      <AdvancedSubjectsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={getFilteredSubjects().length}
        totalCount={paginationInfo?.total || 0}
      />

      {/* Loading state */}
      {list_module_loading && (
        <Card className="p-12  text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading modules...</p>
          </div>
        </Card>
      )}

      {/* Error state */}
      {list_module_error && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error loading modules
              </h3>
              <p className="text-gray-500">{list_module_error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Content */}
      {!list_module_loading && !list_module_error && (
        <>
          {getFilteredSubjects().length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Modules found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || hasActiveFilters()
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "No modules are available at the moment."}
                  </p>
                  {(searchTerm || hasActiveFilters()) && (
                    <Button
                      type="primary"
                      onClick={clearAllFilters}
                      icon={<X className="w-4 h-4" />}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ) : viewMode === "table" ? (
            <>
              <Table
                columns={columns}
                dataSource={getFilteredSubjects()}
                rowKey="code"
                pagination={false}
                className="shadow-sm mb-4"
              />
              <div className="flex justify-end mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={paginationInfo?.total || 0}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `Showing ${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {getFilteredSubjects().map((subject) => (
                  <SubjectCard
                    key={subject.code}
                    subject={subject}
                    setSelectedSubject={(s) => handleSubjectAction(s, "delete")}
                    setInactive={setOpenInActiveModal}
                  />
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={paginationInfo?.total || 0}
                  onChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) =>
                    `Showing ${range[0]}-${range[1]} of ${total} items`
                  }
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      <AddSubjectForm open={NewModal} setOpen={setNewModal} />

      <DeleteSubjectModal
        selectedSubject={selectedSubject}
        setSelectedSubject={handleCloseModal}
      />

      <InActiveSubjectModal
        selectedSubject={openInactiveModal}
        setSelectedSubject={setOpenInActiveModal}
      />

      {/* ✅ Edit modal (used by table + can also be opened from card if desired) */}
      <EditSubjectForm
        open={openEditModal}
        setOpen={setOpenEditModal}
        rowData={editRow}
        setRowData={setEditRow}
      />
    </PageLayout>
  );
};

export default SubjectsManagementClient;

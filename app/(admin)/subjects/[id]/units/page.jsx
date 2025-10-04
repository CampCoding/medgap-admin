"use client";

import React, { useEffect, useMemo, useState } from "react";
import PageLayout from "../../../../../components/layout/PageLayout";
import {
  BarChart3,
  Book,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Plus,
  Search,
  Upload,
  Users,
  X,
  Eye,
  Trash2,
  Edit3,
  HelpCircle,
  MoreVertical,
} from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import Button from "../../../../../components/atoms/Button";
import { useParams, useRouter } from "next/navigation";
import { subjects } from "../../../../../data/subjects";
import UnitsStats from "../../../../../components/Units/UnitStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import UnitCard from "../../../../../components/ui/Cards/UnitCard";
import AddUnitForm from "./../../../../../components/Units/AddNewUnit.modal";
import DeleteUnitModal from "../../../../../components/Units/DeleteUnit.modal";
import Table from "../../../../../components/ui/Table";
import Badge from "../../../../../components/atoms/Badge";
import AdvancedUnitsFilters from "../../../../../components/ui/AdvancedUnitsFilters";
import { Card, Pagination, Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { handleGetModuleUnits } from "../../../../../features/modulesSlice";
import EditUnitForm from "../../../../../components/Units/EditNewUnitModal";

const Units = () => {
  const { id } = useParams();
  const router = useRouter();

  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [newUnitModal, setNewUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const { module_unit_loading, module_units } = useSelector(
    (state) => state?.modules
  );

  useEffect(() => {
    dispatch(
      handleGetModuleUnits({
        id,
        page: currentPage,
        limit: pageSize,
      })
    );
  }, [id, currentPage, pageSize, dispatch]);

  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    difficulty: "all",
    sortBy: "name",
    sortOrder: "asc",
    dateRange: "all",
    studentRange: "all",
    questionRange: "all",
    topicRange: "all",
    digitalLibraryRange: "all",
    flashcardRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    return subject;
  }, [id]);

  // Transform API data to match component expectations
  const transformApiData = (apiData) => {
    if (!apiData?.units) return [];

    return apiData.units.map((unit) => ({
      id: unit.unit_id,
      name: unit.unit_name,
      description: unit.unit_description || "No description available",
      status: unit.status || "active",
      order: unit.unit_order,
      lastUpdated: unit.updated_at || unit.created_at,
      topics: Array.isArray(unit.topics) ? unit.topics : [],
      students: 0, // placeholder
      questions: unit.questions_count || 0,
      topics_count: unit.topics_count || 0,
      created_at: unit.created_at,
      updated_at: unit.updated_at,
    }));
  };

  // Helpers
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
  const unitsData = transformApiData(module_units?.data);
  const paginationInfo = module_units?.data?.pagination;
  const [editOpen, setEditOpen] = useState(false);

  // Search & filters
  const searchUnits = (units, term) => {
    if (!term.trim()) return units;
    const q = term.toLowerCase();
    return units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.description.toLowerCase().includes(q) ||
        u.students.toString().includes(q) ||
        u.questions.toString().includes(q) ||
        (u.topics &&
          u.topics.some(
            (t) =>
              t.name?.toLowerCase().includes(q) ||
              t.digital_library?.toString().includes(q) ||
              t.questions?.toString().includes(q) ||
              t.flashcards?.toString().includes(q)
          ))
    );
  };

  const filterUnits = (units, f) =>
    units.filter((unit) => {
      if (f.status !== "all" && unit.status !== f.status) return false;

      if (
        f.difficulty !== "all" &&
        selectedSubject?.difficulty !== f.difficulty
      )
        return false;

      if (f.dateRange !== "all") {
        const unitDate = new Date(unit.lastUpdated);
        const now = new Date();
        const daysDiff = Math.floor((now - unitDate) / (1000 * 60 * 60 * 24));
        if (f.dateRange === "today" && daysDiff !== 0) return false;
        if (f.dateRange === "week" && daysDiff > 7) return false;
        if (f.dateRange === "month" && daysDiff > 30) return false;
        if (f.dateRange === "year" && daysDiff > 365) return false;
      }

      if (f.questionRange !== "all") {
        const n = unit.questions;
        if (f.questionRange === "0-50" && !(n <= 50)) return false;
        if (f.questionRange === "51-100" && !(n >= 51 && n <= 100))
          return false;
        if (f.questionRange === "101-200" && !(n >= 101 && n <= 200))
          return false;
        if (f.questionRange === "200+" && !(n >= 201)) return false;
      }

      if (f.topicRange !== "all") {
        const n = unit.topics_count || unit.topics.length;
        if (f.topicRange === "1-2" && !(n >= 1 && n <= 2)) return false;
        if (f.topicRange === "3-4" && !(n >= 3 && n <= 4)) return false;
        if (f.topicRange === "5+" && !(n >= 5)) return false;
      }

      if (f.digitalLibraryRange !== "all") {
        const total =
          unit.topics?.reduce((sum, t) => sum + (t.digital_library || 0), 0) ||
          0;
        if (f.digitalLibraryRange === "0-50" && !(total <= 50)) return false;
        if (
          f.digitalLibraryRange === "51-100" &&
          !(total >= 51 && total <= 100)
        )
          return false;
        if (
          f.digitalLibraryRange === "101-200" &&
          !(total >= 101 && total <= 200)
        )
          return false;
        if (f.digitalLibraryRange === "200+" && !(total >= 201)) return false;
      }

      if (f.flashcardRange !== "all") {
        const total =
          unit.topics?.reduce((sum, t) => sum + (t.flashcards || 0), 0) || 0;
        if (f.flashcardRange === "0-50" && !(total <= 50)) return false;
        if (f.flashcardRange === "51-100" && !(total >= 51 && total <= 100))
          return false;
        if (f.flashcardRange === "101-200" && !(total >= 101 && total <= 200))
          return false;
        if (f.flashcardRange === "200+" && !(total >= 201)) return false;
      }

      return true;
    });

  const sortUnits = (units, sortBy, sortOrder) => {
    return [...units].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "questions":
          aValue = a.questions;
          bValue = b.questions;
          break;
        case "topics":
          aValue = a.topics_count || a.topics.length;
          bValue = b.topics_count || b.topics.length;
          break;
        case "digitalLibrary":
          aValue =
            a.topics?.reduce((sum, t) => sum + (t.digital_library || 0), 0) ||
            0;
          bValue =
            b.topics?.reduce((sum, t) => sum + (t.digital_library || 0), 0) ||
            0;
          break;
        case "flashcards":
          aValue =
            a.topics?.reduce((sum, t) => sum + (t.flashcards || 0), 0) || 0;
          bValue =
            b.topics?.reduce((sum, t) => sum + (t.flashcards || 0), 0) || 0;
          break;
        case "lastUpdated":
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case "order":
          aValue = a.order;
          bValue = b.order;
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

  // Handle page change
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
      setCurrentPage(1);
    }
  };

  // Get filtered & sorted units
  const getFilteredUnits = () => {
    if (!unitsData || unitsData.length === 0) return [];
    let filtered = searchUnits(unitsData, searchTerm);
    filtered = filterUnits(filtered, filters);
    filtered = sortUnits(filtered, filters.sortBy, filters.sortOrder);
    return filtered;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
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
      topicRange: "all",
      digitalLibraryRange: "all",
      flashcardRange: "all",
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = () =>
    searchTerm ||
    filters.status !== "all" ||
    filters.difficulty !== "all" ||
    filters.dateRange !== "all" ||
    filters.studentRange !== "all" ||
    filters.questionRange !== "all" ||
    filters.topicRange !== "all" ||
    filters.digitalLibraryRange !== "all" ||
    filters.flashcardRange !== "all";

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    {
      label: module_units?.data?.module?.subject_name,
      href: "#",
      current: true,
    },
    { label: "Subjects", href: "#" },
  ];

  // Dropdown menu factory for table Actions
  const tableActionMenu = (record) => ({
    items: [
      { key: "topics", label: "Topics", icon: <BookOpen size={14} /> },
      { key: "questions", label: "Questions", icon: <HelpCircle size={14} /> },
      { key: "flashcards", label: "Flashcards", icon: <FileText size={14} /> },
      { type: "divider" },
      { key: "edit", label: "Edit", icon: <Edit3 size={14} /> },
      {
        key: "delete",
        label: "Delete",
        icon: <Trash2 size={14} />,
        danger: true,
      },
    ],
    onClick: ({ key }) => {
      const base = `/subjects/${id}/units/${record.id}`;
      if (key === "topics") return router.push(`${base}/topics`);
      if (key === "questions") return router.push(`${base}/questions`);
      if (key === "flashcards") return router.push(`${base}/flashcards`);
      if (key === "edit") {
        setSelectedUnit(record);
        setEditOpen(true); // << open modal with selectedUnit prefilled
        return;
      }
      if (key === "delete") {
        setSelectedUnit(record);
        setDeleteModal(true);
      }
    },
  });

  const columns = [
    {
      title: "Subject",
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F7490] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {record.name.substring(0, 2)}
          </div>
          <div>
            <div className="font-semibold text-[#202938]">{text}</div>
            <div className="text-xs text-[#202938]/60">
              {record.topics_count || record.topics.length} topics
            </div>
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
      render: (_, record) => {
        const totalDigitalLibrary =
          record.topics?.reduce(
            (sum, topic) => sum + (topic.digital_library || 0),
            0
          ) || 0;
        const totalFlashcards =
          record.topics?.reduce(
            (sum, topic) => sum + (topic.flashcards || 0),
            0
          ) || 0;

        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <BookOpen className="w-3 h-3" />
              <span>{record.topics_count || record.topics.length} topics</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <Users className="w-3 h-3" />
              <span>{record.students} students</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <FileText className="w-3 h-3" />
              <span>{record.questions} questions</span>
            </div>
            {totalDigitalLibrary > 0 && (
              <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
                <Book className="w-3 h-3" />
                <span>{totalDigitalLibrary} digital</span>
              </div>
            )}
            {totalFlashcards > 0 && (
              <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
                <FileText className="w-3 h-3" />
                <span>{totalFlashcards} flashcards</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      render: (status) => (
        <Badge color={getStatusColor(status)}>
          {status?.charAt(0).toUpperCase() + status?.slice(1)}
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
    // ✅ Actions with dropdown
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-1">
          {/* Quick view to Topics (optional) */}
          <Button
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
            onClick={() =>
              router.push(`/subjects/${id}/units/${record.id}/topics`)
            }
            title="View topics"
          >
            <Eye className="w-4 h-4" />
          </Button>

          {/* Dropdown for more actions */}
          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            menu={tableActionMenu(record)}
          >
            <Button
              type="text"
              size="small"
              className="hover:bg-gray-100"
              title="More"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </Dropdown>
        </div>
      ),
    },
  ];

  const filteredUnits = getFilteredUnits();

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />
      {/* Header */}
      <PagesHeader
        title={<>Module: {module_units?.data?.module?.subject_name}</>}
        subtitle={"Organize and manage your teaching subjects"}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              onClick={() => setNewUnitModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Subject
            </Button>
          </div>
        }
      />
      {/* Search and Filters */}
      <SearchAndFilters
        mode={mode}
        setMode={setMode}
        searchTerm={searchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setSearchTerm={setSearchTerm}
        searchPlacehodler="Search subjects, topics, students, questions, digital library, flashcards..."
      />
      {/* Advanced Filter Controls */}
      <AdvancedUnitsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredUnits.length}
        totalCount={paginationInfo?.total || 0}
      />
      {/* Loading state */}
      {module_unit_loading && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500">Loading subjects...</p>
          </div>
        </Card>
      )}
      {/* Content */}
      {!module_unit_loading && (
        <>
          {filteredUnits.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No subjects found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || hasActiveFilters()
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "No subjects are available at the moment."}
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
          ) : mode === "table" ? (
            <>
              <Table
                columns={columns}
                dataSource={filteredUnits}
                rowKey="id"
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
                {filteredUnits.map((unit) => (
                  <UnitCard
                  subject_id={id}
                    key={unit.id}
                    onDeleteClick={(e, data) => {
                      setSelectedUnit(data);
                      setDeleteModal(true);
                    }}
                      onEditClick={(data) => { setSelectedUnit(data); setEditOpen(true); }} // optional, if using modal edit
                    moduleId={id}
                    unit={unit}
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
      <AddUnitForm
        id={id}
        open={newUnitModal}
        onCancel={() => setNewUnitModal(false)}
        onSubmit={() => null}
        subjects={subjects}
      />
      <EditUnitForm
        open={editOpen}
        id={id}
        unitId={selectedUnit?.id}
        initialUnit={{
          unit_name: selectedUnit?.name,
          unit_description: selectedUnit?.description,
          unit_order: selectedUnit?.order,
          status: selectedUnit?.status,
        }}
        onCancel={() => setEditOpen(false)}
        subjects={subjects}
      />{" "}
      <DeleteUnitModal
        open={deleteModal}
        setOpne={setDeleteModal}
        data={selectedUnit}
        module_id={id}
      />
    </PageLayout>
  );
};

export default Units;

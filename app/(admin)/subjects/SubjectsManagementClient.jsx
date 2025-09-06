"use client";

import React, { useState } from "react";
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
  MoreVertical,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import PagesHeader from "./../../../components/ui/PagesHeader";
import SubjectsPage from "../../../components/drafts/Subjects.draft";
import { subjects } from "../../../data/subjects";
import Button from "../../../components/atoms/Button";
import SubjectsStats from "../../../components/Subjects/SubjectStats";
import Table from "../../../components/ui/Table";
import SubjectCard from "../../../components/ui/Cards/SubjectCard";
import SearchAndFilters from "./../../../components/ui/SearchAndFilters";
import Badge from "../../../components/atoms/Badge";
import AddSubjectForm from "../../../components/Subjects/AddNewSubject.modal.jsx";
import DeleteSubjects from "../../../components/Subjects/DeleteSubject.modal.jsx";
import DeleteSubjectModal from "../../../components/Subjects/DeleteSubject.modal.jsx";
import AdvancedSubjectsFilters from "../../../components/ui/AdvancedFilters";
import { Card } from "antd";

const SubjectsManagementClient = () => {
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [NewModal, setNewModal] = useState(false);
  const [deleteMdoal, setDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

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

  // Search and filter functions
  const searchSubjects = (subjects, searchTerm) => {
    if (!searchTerm.trim()) return subjects;

    const term = searchTerm.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(term) ||
        subject.code.toLowerCase().includes(term) ||
        subject.description.toLowerCase().includes(term) ||
        subject.status.toLowerCase().includes(term) ||
        subject.difficulty.toLowerCase().includes(term) ||
        subject.units.some(
          (unit) =>
            unit.name.toLowerCase().includes(term) ||
            unit.topics.some((topic) => topic.name.toLowerCase().includes(term))
        )
    );
  };

  const filterSubjects = (subjects, filters) => {
    return subjects.filter((subject) => {
      // Status filter
      if (filters.status !== "all" && subject.status !== filters.status) {
        return false;
      }

      // Difficulty filter
      if (
        filters.difficulty !== "all" &&
        subject.difficulty !== filters.difficulty
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const subjectDate = new Date(subject.lastUpdated);
        const now = new Date();
        const daysDiff = Math.floor(
          (now - subjectDate) / (1000 * 60 * 60 * 24)
        );

        switch (filters.dateRange) {
          case "today":
            if (daysDiff !== 0) return false;
            break;
          case "week":
            if (daysDiff > 7) return false;
            break;
          case "month":
            if (daysDiff > 30) return false;
            break;
          case "year":
            if (daysDiff > 365) return false;
            break;
        }
      }

      // Student range filter
      if (filters.studentRange !== "all") {
        const students = subject.students;
        switch (filters.studentRange) {
          case "0-50":
            if (students > 50) return false;
            break;
          case "51-100":
            if (students < 51 || students > 100) return false;
            break;
          case "101-200":
            if (students < 101 || students > 200) return false;
            break;
          case "200+":
            if (students < 201) return false;
            break;
        }
      }

      // Question range filter
      if (filters.questionRange !== "all") {
        const questions = subject.questions;
        switch (filters.questionRange) {
          case "0-50":
            if (questions > 50) return false;
            break;
          case "51-100":
            if (questions < 51 || questions > 100) return false;
            break;
          case "101-200":
            if (questions < 101 || questions > 200) return false;
            break;
          case "200+":
            if (questions < 201) return false;
            break;
        }
      }

      return true;
    });
  };

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

  // Get filtered and sorted subjects
  const getFilteredSubjects = () => {
    let filtered = searchSubjects(subjects, searchTerm);
    filtered = filterSubjects(filtered, filters);
    filtered = sortSubjects(filtered, filters.sortBy, filters.sortOrder);
    return filtered;
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
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

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      filters.status !== "all" ||
      filters.difficulty !== "all" ||
      filters.dateRange !== "all" ||
      filters.studentRange !== "all" ||
      filters.questionRange !== "all"
    );
  };

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
            <span>{record.units.length} units</span>
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
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      sorter: true,
      render: (difficulty) => (
        <Badge color={getDifficultyColor(difficulty)}>{difficulty}</Badge>
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
          <span>{date}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center space-x-1">
          <Button
            type="text"
            size="small"
            className="text-[#0F7490] hover:bg-[#0F7490]/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#C9AE6C] hover:bg-[#C9AE6C]/10"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            type="text"
            size="small"
            className="text-[#202938]/60 hover:bg-gray-100"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
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
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button
              onClick={() => setNewModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Subject
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <SubjectsStats subjects={subjects} />

      {/* Search and Filters */}
      <SearchAndFilters
        mode={viewMode}
        setMode={setViewMode}
        searchTerm={searchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setSearchTerm={setSearchTerm}
        searchPlacehodler="Search subjects, codes, descriptions, units, topics..."
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
        totalCount={subjects.length}
      />

      {/* Content */}
      {getFilteredSubjects().length === 0 ? (
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
      ) : viewMode === "table" ? (
        <Table
          columns={columns}
          dataSource={getFilteredSubjects()}
          rowKey="code"
          pagination={{ pageSize: 10 }}
          className="shadow-sm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredSubjects().map((subject) => (
            <SubjectCard
              setSelectedSubject={setSelectedSubject}
              subject={subject}
              key={subject.code}
            />
          ))}
        </div>
      )}
      <AddSubjectForm open={NewModal} setOpen={setNewModal} />
      <DeleteSubjectModal
        selectedSubject={selectedSubject}
        setSelectedSubject={setSelectedSubject}
      />
    </PageLayout>
  );
};

export default SubjectsManagementClient;

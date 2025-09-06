"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../../../../components/layout/PageLayout";
import { BarChart3, Book, BookOpen, Calendar, Download, FileText, Plus, Search, Upload, Users, X } from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import Button from "../../../../../components/atoms/Button";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../data/subjects";
import UnitsStats from "../../../../../components/Units/UnitStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import UnitCard from "../../../../../components/ui/Cards/UnitCard";
import AddUnitForm from "./../../../../../components/Units/AddNewUnit.modal";
import DeleteUnitModal from "../../../../../components/Units/DeleteUnit.modal";
import Table from "../../../../../components/ui/Table";
import Badge from "../../../../../components/atoms/Badge";
import AdvancedUnitsFilters from "../../../../../components/ui/AdvancedUnitsFilters";
import { Card } from "antd";

const Units = () => {
  const { id } = useParams();
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [newUnitModal, setNewUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

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
    console.log(subject);
    return subject;
  }, [id]);

  // Helper functions for colors
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
  const searchUnits = (units, searchTerm) => {
    if (!searchTerm.trim()) return units;

    const term = searchTerm.toLowerCase();
    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(term) ||
        unit.students.toString().includes(term) ||
        unit.questions.toString().includes(term) ||
        unit.topics.some((topic) => 
          topic.name.toLowerCase().includes(term) ||
          topic.digital_library.toString().includes(term) ||
          topic.questions.toString().includes(term) ||
          (topic.flashcards && topic.flashcards.toString().includes(term))
        )
    );
  };

  const filterUnits = (units, filters) => {
    return units.filter((unit) => {
      // Status filter (units have their own status)
      if (filters.status !== "all" && unit.status !== filters.status) {
        return false;
      }

      // Difficulty filter (units inherit subject difficulty)
      if (
        filters.difficulty !== "all" &&
        selectedSubject?.difficulty !== filters.difficulty
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const unitDate = new Date(unit.lastUpdated);
        const now = new Date();
        const daysDiff = Math.floor(
          (now - unitDate) / (1000 * 60 * 60 * 24)
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

  

      // Question range filter
      if (filters.questionRange !== "all") {
        const questions = unit.questions;
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

      // Topic count range filter
      if (filters.topicRange !== "all") {
        const topicCount = unit.topics.length;
        switch (filters.topicRange) {
          case "1-2":
            if (topicCount < 1 || topicCount > 2) return false;
            break;
          case "3-4":
            if (topicCount < 3 || topicCount > 4) return false;
            break;
          case "5+":
            if (topicCount < 5) return false;
            break;
        }
      }

      // Digital library range filter (based on total digital library content)
      if (filters.digitalLibraryRange !== "all") {
        const totalDigitalLibrary = unit.topics.reduce((sum, topic) => sum + (topic.digital_library || 0), 0);
        switch (filters.digitalLibraryRange) {
          case "0-50":
            if (totalDigitalLibrary > 50) return false;
            break;
          case "51-100":
            if (totalDigitalLibrary < 51 || totalDigitalLibrary > 100) return false;
            break;
          case "101-200":
            if (totalDigitalLibrary < 101 || totalDigitalLibrary > 200) return false;
            break;
          case "200+":
            if (totalDigitalLibrary < 201) return false;
            break;
        }
      }

      // Flashcard range filter (based on total flashcards)
      if (filters.flashcardRange !== "all") {
        const totalFlashcards = unit.topics.reduce((sum, topic) => sum + (topic.flashcards || 0), 0);
        switch (filters.flashcardRange) {
          case "0-50":
            if (totalFlashcards > 50) return false;
            break;
          case "51-100":
            if (totalFlashcards < 51 || totalFlashcards > 100) return false;
            break;
          case "101-200":
            if (totalFlashcards < 101 || totalFlashcards > 200) return false;
            break;
          case "200+":
            if (totalFlashcards < 201) return false;
            break;
        }
      }

      return true;
    });
  };

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
          aValue = a.topics.length;
          bValue = b.topics.length;
          break;
        case "digitalLibrary":
          aValue = a.topics.reduce((sum, topic) => sum + (topic.digital_library || 0), 0);
          bValue = b.topics.reduce((sum, topic) => sum + (topic.digital_library || 0), 0);
          break;
        case "flashcards":
          aValue = a.topics.reduce((sum, topic) => sum + (topic.flashcards || 0), 0);
          bValue = b.topics.reduce((sum, topic) => sum + (topic.flashcards || 0), 0);
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

  // Get filtered and sorted units
  const getFilteredUnits = () => {
    if (!selectedSubject?.units) return [];
    let filtered = searchUnits(selectedSubject.units, searchTerm);
    filtered = filterUnits(filtered, filters);
    filtered = sortUnits(filtered, filters.sortBy, filters.sortOrder);
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
      topicRange: "all",
      digitalLibraryRange: "all",
      flashcardRange: "all",
    });
  };

  const hasActiveFilters = () => {
    return (
      searchTerm ||
      filters.status !== "all" ||
      filters.difficulty !== "all" ||
      filters.dateRange !== "all" ||
      filters.studentRange !== "all" ||
      filters.questionRange !== "all" ||
      filters.topicRange !== "all" ||
      filters.digitalLibraryRange !== "all" ||
      filters.flashcardRange !== "all"
    );
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubject?.name, href: "#", current: true },
  ];

  const columns = [
    {
      title: "Unit",
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
              {record.topics.length} topics
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Stats",
      key: "stats",
      render: (_, record) => {
        const totalDigitalLibrary = record.topics.reduce((sum, topic) => sum + (topic.digital_library || 0), 0);
        const totalFlashcards = record.topics.reduce((sum, topic) => sum + (topic.flashcards || 0), 0);
        return (
          <div className="space-y-1">
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <BookOpen className="w-3 h-3" />
              <span>{record.topics.length} topics</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <Users className="w-3 h-3" />
              <span>{record.students} students</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <FileText className="w-3 h-3" />
              <span>{record.questions} questions</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
              <Book className="w-3 h-3" />
              <span>{totalDigitalLibrary} digital</span>
            </div>
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
      title: "Subject Difficulty",
      key: "subjectDifficulty",
      render: () => (
        <Badge color={getDifficultyColor(selectedSubject?.difficulty)}>
          {selectedSubject?.difficulty}
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
          <span>{date}</span>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        title={<>Subject: {selectedSubject?.name}</>}
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
              Add New Unit
            </Button>
          </div>
        }
      />

      <UnitsStats units={selectedSubject.units} />

      {/* Search and Filters */}
      <SearchAndFilters
        mode={mode}
        setMode={setMode}
        searchTerm={searchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setSearchTerm={setSearchTerm}
        searchPlacehodler="Search units, topics, students, questions, digital library, flashcards..."
      />

      {/* Advanced Filter Controls */}
      <AdvancedUnitsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={getFilteredUnits().length}
        totalCount={selectedSubject?.units?.length || 0}
      />

      {/* Content */}
      {getFilteredUnits().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No units found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || hasActiveFilters()
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "No units are available at the moment."}
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
        <Table
          columns={columns}
          dataSource={getFilteredUnits()}
          rowKey="name"
          pagination={{ pageSize: 10 }}
          className="shadow-sm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredUnits().map((unit, index) => (
            <UnitCard
              onDeleteClick={(e , data) => {
                setSelectedUnit(data);
                console.log( "selectedData" , data)
                setDeleteModal(true);
              }}
              unit={unit}
              key={index}
            />
          ))}
        </div>
      )}

      <AddUnitForm
        open={newUnitModal}
        onCancel={() => setNewUnitModal(false)}
        onSubmit={() => null}
        subjects={subjects}
      />

      <DeleteUnitModal
        open={deleteModal}
        setOpne={setDeleteModal}
        data={selectedUnit}
      />
    </PageLayout>
  );
};

export default Units;

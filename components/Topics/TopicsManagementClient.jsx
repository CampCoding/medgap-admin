"use client";

import React, { useState } from "react";
import PageLayout from "../layout/PageLayout";
import BreadcrumbsShowcase from "../ui/BreadCrumbs";
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
  Filter,
  List,
  Grid,
} from "lucide-react";
import PagesHeader from "../ui/PagesHeader";
import { subjects } from "../../data/subjects";
import Button from "../atoms/Button";
import Table from "../ui/Table";
import SearchAndFilters from "../ui/SearchAndFilters";
import Badge from "../atoms/Badge";
import AdvancedTopicsFilters from "../ui/AdvancedTopicsFilters";
import { Card } from "antd";
import {
  getTopicsBySubjectAndUnit,
  getAllTopics,
  searchTopics,
  filterTopics,
  sortTopics,
  getFilteredTopics,
  hasActiveFilters,
  getDefaultFilters,
} from "../../utils/topicsUtils";

const TopicsManagementClient = ({ subjectId, unitId }) => {
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: "Topics", icon: BookOpen, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState(getDefaultFilters());

  // Get all topics from the selected subject and unit
  const topics = subjectId 
    ? getTopicsBySubjectAndUnit(subjectId, unitId)
    : getAllTopics();

  // Get filtered and sorted topics
  const getFilteredTopicsData = () => {
    return getFilteredTopics(topics, searchTerm, filters);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilters(getDefaultFilters());
  };

  const hasActiveFiltersData = () => {
    return hasActiveFilters(searchTerm, filters);
  };

  const columns = [
    {
      title: "Topic",
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
            {record.unitName && (
              <div className="text-xs text-[#202938]/60">Unit: {record.unitName}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Stats",
      key: "stats",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <FileText className="w-3 h-3" />
            <span>{record.questions} questions</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <BookOpen className="w-3 h-3" />
            <span>{record.digital_library} digital items</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Book className="w-3 h-3" />
            <span>{record.flashcards || 0} flashcards</span>
          </div>
        </div>
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
        title={"Topics Management"}
        subtitle={"Organize and manage your learning topics"}
        extra={
          <div className="flex items-center space-x-4">
      
            {/* <Button
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Topic
            </Button> */}
          </div>
        }
      />

      {/* Search and Filters */}
      <SearchAndFilters
        mode={viewMode}
        setMode={setViewMode}
        searchTerm={searchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        setSearchTerm={setSearchTerm}
        searchPlacehodler="Search topics, units, subjects..."
      />

      {/* Advanced Filter Controls */}
      <AdvancedTopicsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearAllFilters}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFiltersData}
        filteredCount={getFilteredTopicsData().length}
        totalCount={topics.length}
      />

      {/* Content */}
      {getFilteredTopicsData().length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No topics found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || hasActiveFiltersData()
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "No topics are available at the moment."}
              </p>
              {(searchTerm || hasActiveFiltersData()) && (
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
          dataSource={getFilteredTopicsData()}
          rowKey={(record) => `${record.name}-${record.unitName || 'default'}`}
          pagination={{ pageSize: 10 }}
          className="shadow-sm"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTopicsData().map((topic, index) => (
            <Card key={`${topic.name}-${index}`} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0F7490] to-[#8B5CF6] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {topic.name.substring(0, 2)}
                </div>
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
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-[#202938] mb-2">{topic.name}</h3>
              
              {topic.unitName && (
                <p className="text-sm text-[#202938]/60 mb-4">Unit: {topic.unitName}</p>
              )}
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0F7490]">{topic.questions}</div>
                  <div className="text-xs text-[#202938]/60">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#8B5CF6]">{topic.digital_library}</div>
                  <div className="text-xs text-[#202938]/60">Digital</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9AE6C]">{topic.flashcards || 0}</div>
                  <div className="text-xs text-[#202938]/60">Flashcards</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-[#202938]/60">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{topic.lastUpdated}</span>
                </div>
                <Button
                  type="text"
                  size="small"
                  className="text-[#202938]/60 hover:bg-gray-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default TopicsManagementClient;

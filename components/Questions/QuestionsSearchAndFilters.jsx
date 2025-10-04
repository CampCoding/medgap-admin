"use client";
import React from "react";
import Card from "../atoms/Card";
import Input from "../atoms/Input";
import { Search, Filter, X, Calendar } from "lucide-react";
import Select from "../atoms/Select";
import Button from "../atoms/Button";

const QuestionsSearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedReviewStatus,
  setSelectedReviewStatus,
  selectedCreatedBy,
  setSelectedCreatedBy,
  selectedReviewedBy,
  setSelectedReviewedBy,
  selectedUsageRange,
  setSelectedUsageRange,
  dateRange,
  setDateRange,
  questions = [],
  isLoading = false
}) => {
  // Safe data extraction with fallbacks
  const safeQuestions = Array.isArray(questions) ? questions : [];

  // Dynamic options based on actual question data with safe access
  const subjectOptions = [
    { value: "", label: "All Subjects" },
    ...Array.from(new Set(safeQuestions.map((q) => q.subject || q.topic_name || 'Unknown')))
      .filter(Boolean)
      .map((subject) => ({
        value: subject.toLowerCase().replace(/\s+/g, '-'),
        label: subject,
      })),
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    ...Array.from(new Set(safeQuestions.map((q) => {
      if (q.question_type === 'multiple_choice') return 'MCQ';
      if (q.question_type === 'essay') return 'Essay';
      if (q.question_type === 'true_false') return 'True/False';
      return q.type || 'Unknown';
    })))
    .filter(Boolean)
    .map((type) => ({
      value: type.toLowerCase().replace(/\s+/g, '-'),
      label: type,
    })),
  ];

  const difficultyOptions = [
    { value: "", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const reviewStatusOptions = [
    { value: "", label: "All Review Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending Review" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
  ];

  const createdByOptions = [
    { value: "", label: "All Creators" },
    ...Array.from(new Set(safeQuestions.map((q) => q.created_by_name || q.createdBy || 'Unknown')))
      .filter(Boolean)
      .map((creator) => ({ 
        value: creator.toLowerCase().replace(/\s+/g, '-'), 
        label: creator 
      })),
  ];

  const reviewedByOptions = [
    { value: "", label: "All Reviewers" },
    ...Array.from(new Set(safeQuestions.filter((q) => q.reviewed_by || q.reviewedBy).map((q) => q.reviewed_by || q.reviewedBy)))
      .filter(Boolean)
      .map((reviewer) => ({ 
        value: reviewer.toLowerCase().replace(/\s+/g, '-'), 
        label: reviewer 
      })),
  ];

  const usageRangeOptions = [
    { value: "", label: "All Usage Levels" },
    { value: "0-5", label: "Low Usage (0-5)" },
    { value: "6-15", label: "Medium Usage (6-15)" },
    { value: "16-25", label: "High Usage (16-25)" },
    { value: "25+", label: "Very High Usage (25+)" },
  ];

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedSubject("");
    setSelectedType("");
    setSelectedDifficulty("");
    setSelectedReviewStatus("");
    setSelectedCreatedBy("");
    setSelectedReviewedBy("");
    setSelectedUsageRange("");
    setDateRange({ from: "", to: "" });
  };

  // Count active filters
  const activeFiltersCount = [
    searchTerm,
    selectedSubject,
    selectedType,
    selectedDifficulty,
    selectedReviewStatus,
    selectedCreatedBy,
    selectedReviewedBy,
    selectedUsageRange,
    dateRange.from,
    dateRange.to,
  ].filter((filter) => filter && filter !== "").length;

  // Handle date range change with validation
  const handleDateChange = (type, value) => {
    setDateRange(prev => {
      const newRange = { ...prev, [type]: value };
      
      // Validate date range (to date shouldn't be before from date)
      if (newRange.from && newRange.to && new Date(newRange.from) > new Date(newRange.to)) {
        if (type === 'from') {
          newRange.to = value; // Reset to date if from date is after to date
        }
      }
      
      return newRange;
    });
  };

  return (
    <div className="mb-8">
      {/* Search and Filters Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-[#0F7490]" />
          <h3 className="text-lg font-semibold text-[#202938]">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-[#0F7490] text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount} active
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            type="text"
            size="small"
            onClick={clearAllFilters}
            className="text-red-500 hover:bg-red-50"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-6 mb-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="w-full">
            <Input
              placeholder="Search questions by ID, title, content, tags, or keywords..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
              disabled={isLoading}
            />
          </div>

          {/* Basic Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              placeholder="Filter by Subject"
              options={subjectOptions}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isLoading}
            />
            <Select
              placeholder="Filter by Type"
              options={typeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={isLoading}
            />
            <Select
              placeholder="Filter by Difficulty"
              options={difficultyOptions}
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              disabled={isLoading}
            />
            <Select
              placeholder="Filter by Review Status"
              options={reviewStatusOptions}
              value={selectedReviewStatus}
              onChange={(e) => setSelectedReviewStatus(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* <Select
              placeholder="Filter by Creator"
              options={createdByOptions}
              value={selectedCreatedBy}
              onChange={(e) => setSelectedCreatedBy(e.target.value)}
              disabled={isLoading || createdByOptions.length <= 1}
            />
            <Select
              placeholder="Filter by Reviewer"
              options={reviewedByOptions}
              value={selectedReviewedBy}
              onChange={(e) => setSelectedReviewedBy(e.target.value)}
              disabled={isLoading || reviewedByOptions.length <= 1}
            /> */}
            {/* <Select
              placeholder="Filter by Usage Level"
              options={usageRangeOptions}
              value={selectedUsageRange}
              onChange={(e) => setSelectedUsageRange(e.target.value)}
              disabled={isLoading}
            /> */}
            {/* <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="From Date"
                  value={dateRange.from}
                  onChange={(e) => handleDateChange('from', e.target.value)}
                  disabled={isLoading}
                  max={dateRange.to || undefined}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="To Date"
                  value={dateRange.to}
                  onChange={(e) => handleDateChange('to', e.target.value)}
                  disabled={isLoading}
                  min={dateRange.from || undefined}
                />
              </div>
            </div> */}
          </div>

          {/* Quick Stats */}
          {safeQuestions.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {safeQuestions.length} question{safeQuestions.length !== 1 ? 's' : ''}
              </div>
              <div className="flex space-x-4 text-xs text-gray-500">
                <span>MCQ: {safeQuestions.filter(q => q.question_type === 'multiple_choice').length}</span>
                <span>Essay: {safeQuestions.filter(q => q.question_type === 'essay').length}</span>
                <span>Active: {safeQuestions.filter(q => q.status === 'active').length}</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuestionsSearchAndFilters;
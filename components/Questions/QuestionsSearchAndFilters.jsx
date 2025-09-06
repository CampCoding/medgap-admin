import React from "react";
import Card from "../atoms/Card";
import Input from "../atoms/Input";
import { Search, Filter, X } from "lucide-react";
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
  questions,
}) => {
  // Dynamic options based on actual question data
  const subjectOptions = [
    { value: "", label: "All Subjects" },
    ...Array.from(new Set(questions.map((q) => q.subject))).map((subject) => ({
      value: subject.toLowerCase(),
      label: subject,
    })),
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    ...Array.from(new Set(questions.map((q) => q.type))).map((type) => ({
      value: type.toLowerCase().replace("/", ""),
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
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "pending", label: "Pending Review" },
  ];

  const createdByOptions = [
    { value: "", label: "All Creators" },
    ...Array.from(new Set(questions.map((q) => q.createdBy))).map(
      (creator) => ({ value: creator, label: creator })
    ),
  ];

  const reviewedByOptions = [
    { value: "", label: "All Reviewers" },
    ...Array.from(
      new Set(questions.filter((q) => q.reviewedBy).map((q) => q.reviewedBy))
    ).map((reviewer) => ({ value: reviewer, label: reviewer })),
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
              placeholder="Search questions by ID, title, content, or tags..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
          </div>

          {/* Basic Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              placeholder="Filter by Subject"
              options={subjectOptions}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            />
            <Select
              placeholder="Filter by Type"
              options={typeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />
            <Select
              placeholder="Filter by Difficulty"
              options={difficultyOptions}
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            />
            <Select
              placeholder="Filter by Review Status"
              options={reviewStatusOptions}
              value={selectedReviewStatus}
              onChange={(e) => setSelectedReviewStatus(e.target.value)}
            />
          </div>

          {/* Advanced Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              placeholder="Filter by Creator"
              options={createdByOptions}
              value={selectedCreatedBy}
              onChange={(e) => setSelectedCreatedBy(e.target.value)}
            />
            <Select
              placeholder="Filter by Reviewer"
              options={reviewedByOptions}
              value={selectedReviewedBy}
              onChange={(e) => setSelectedReviewedBy(e.target.value)}
            />
            <Select
              placeholder="Filter by Usage Level"
              options={usageRangeOptions}
              value={selectedUsageRange}
              onChange={(e) => setSelectedUsageRange(e.target.value)}
            />
            <div className="flex space-x-2">
              <Input
                type="date"
                placeholder="From Date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
              <Input
                type="date"
                placeholder="To Date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionsSearchAndFilters;

import React from "react";
import { Filter, X } from "lucide-react";
import { Card } from "antd";
import Button from "../atoms/Button";

const AdvancedUnitsFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}) => {

  if(!showFilters) return null;

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              type="text"
              icon={<X className="w-4 h-4" />}
              onClick={onClearFilters}
              className="text-red-500 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => onFilterChange("difficulty", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange("dateRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
        
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
            <select
              value={filters.questionRange}
              onChange={(e) => onFilterChange("questionRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ranges</option>
              <option value="0-50">0-50 Questions</option>
              <option value="51-100">51-100 Questions</option>
              <option value="101-200">101-200 Questions</option>
              <option value="200+">200+ Questions</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
            <select
              value={filters.topicRange}
              onChange={(e) => onFilterChange("topicRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ranges</option>
              <option value="1-2">1-2 Topics</option>
              <option value="3-4">3-4 Topics</option>
              <option value="5+">5+ Topics</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Digital Library</label>
            <select
              value={filters.digitalLibraryRange}
              onChange={(e) => onFilterChange("digitalLibraryRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ranges</option>
              <option value="0-50">0-50 Items</option>
              <option value="51-100">51-100 Items</option>
              <option value="101-200">101-200 Items</option>
              <option value="200+">200+ Items</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Flashcards</label>
            <select
              value={filters.flashcardRange}
              onChange={(e) => onFilterChange("flashcardRange", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ranges</option>
              <option value="0-50">0-50 Cards</option>
              <option value="51-100">51-100 Cards</option>
              <option value="101-200">101-200 Cards</option>
              <option value="200+">200+ Cards</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange("sortBy", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="questions">Questions</option>
              <option value="topics">Topics</option>
              <option value="digitalLibrary">Digital Library</option>
              <option value="flashcards">Flashcards</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} units
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Order:</span>
            <Button
              type="text"
              size="small"
              onClick={() => onFilterChange("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center space-x-1"
            >
              {filters.sortOrder === "asc" ? (
                <span>Ascending</span>
              ) : (
                <span>Descending</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdvancedUnitsFilters;

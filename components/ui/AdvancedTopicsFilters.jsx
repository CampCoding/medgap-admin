import React from "react";
import { Filter, X } from "lucide-react";
import { Card } from "antd";
import Button from "../atoms/Button";

const AdvancedTopicsFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  showFilters,
  setShowFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
}) => {
  if (!showFilters) return null;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
              <option value="0-10">0-10 Questions</option>
              <option value="11-20">11-20 Questions</option>
              <option value="21-30">21-30 Questions</option>
              <option value="30+">30+ Questions</option>
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
              <option value="0-10">0-10 Items</option>
              <option value="11-20">11-20 Items</option>
              <option value="21-30">21-30 Items</option>
              <option value="30+">30+ Items</option>
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
              <option value="0-10">0-10 Flashcards</option>
              <option value="11-20">11-20 Flashcards</option>
              <option value="21-30">21-30 Flashcards</option>
              <option value="30+">30+ Flashcards</option>
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
              <option value="digital_library">Digital Library</option>
              <option value="flashcards">Flashcards</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => onFilterChange("sortOrder", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredCount} of {totalCount} topics
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

export default AdvancedTopicsFilters;

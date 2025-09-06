import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Settings,
  BookOpen,
  Users,
  FileText,
  Calendar,
  MoreVertical,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  List,
  Grid,
} from "lucide-react";
import SubjectCard from "./Cards/SubjectCard";
import Table from "../ui/Table";
import Button from "./../atoms/Button";
import Badge from "../atoms/Badge";
import PagesHeader from "./../ui/PagesHeader";
import Card from "../atoms/Card";
import SubjectsStats from "../Subjects/SubjectStats";
import { subjects } from "../../data/subjects";
import Input from "../atoms/Input";

const SearchAndFilters = ({
  mode: viewMode,
  setMode: setViewMode,
  searchTerm,
  setSearchTerm,
  searchPlacehodler,
  noMode,
  hideFilters,
  showFilters,
  setShowFilters,
}) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              placeholder={searchPlacehodler || "Search subjects..."}
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!hideFilters && (
            <Button
            type={showFilters ? "primary" : "default"}
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          )}
        </div>
        {noMode ? null : (
          <div className="flex items-center space-x-2 ml-4">
            <Button
              type={viewMode === "table" ? "primary" : "default"}
              size="small"
              onClick={() => setViewMode("table")}
              icon={<List className="w-4 h-4" />}
            >
              Table
            </Button>
            <Button
              type={viewMode === "grid" ? "primary" : "default"}
              size="small"
              onClick={() => setViewMode("grid")}
              icon={<Grid className="w-4 h-4" />}
            >
              Grid
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SearchAndFilters;

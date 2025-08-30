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
import SubjectCard from "../ui/Cards/SubjectCard";
import Table from "../ui/Table";
import Button from "./../atoms/Button";
import Badge from "../atoms/Badge";
import PagesHeader from "./../ui/PagesHeader";
import Card from "../atoms/Card";
import SubjectsStats from "../Subjects/SubjectStats";
import { subjects } from "../../data/subjects";
import Input from "../atoms/Input";
import SearchAndFilters from "../ui/SearchAndFilters";

const SubjectsPage = () => {
  const [viewMode, setViewMode] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");

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

  const totalStudents = subjects.reduce(
    (sum, subject) => sum + subject.students,
    0
  );
  const totalQuestions = subjects.reduce(
    (sum, subject) => sum + subject.questions,
    0
  );
  const activeSubjects = subjects.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen bg-[#F9FAFC] p-6">
      <div className="max-w-7xl mx-auto">
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
          setSearchTerm={setSearchTerm}
        />
        {/* Content */}
        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={subjects}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="shadow-sm"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard subject={subject} key={subject.code} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;

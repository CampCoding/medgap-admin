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
  Settings,
  Trash2,
  Upload,
  Users,
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

const SubjectsManagementClient = () => {
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book, current: true },
  ];

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [NewModal, setNewModal] = useState(false);
  const [deleteMdoal, setDeleteModal] = useState(false);
  const [selectedSubject , setSelectedSubject] = useState(null)

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
            <SubjectCard  setSelectedSubject={setSelectedSubject} subject={subject} key={subject.code} />
          ))}
        </div>
      )}
      <AddSubjectForm open={NewModal} setOpen={setNewModal} />
      <DeleteSubjectModal  selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject}  />
    </PageLayout>
  );
};

export default SubjectsManagementClient;

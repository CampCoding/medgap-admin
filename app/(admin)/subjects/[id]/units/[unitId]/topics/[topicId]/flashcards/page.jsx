"use client";
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Play,
  Eye,
  BookOpen,
  Download,
  Filter,
  Grid,
  List,
  X,
  ChevronDown,
  ChevronUp,
  Book,
  Upload,
  Edit3,
  Trash2,
  Info,
  Clock,
  User2,
  FolderOpenDot,
  Gauge,
  Tag,
} from "lucide-react";
import { useParams } from "next/navigation";
import BreadcrumbsShowcase from "@/components/ui/BreadCrumbs";
import Link from "next/link";
import PageLayout from "../../../../../../../../../components/layout/PageLayout";
import Button from "../../../../../../../../../components/atoms/Button";
import PagesHeader from "../../../../../../../../../components/ui/PagesHeader";
import { useDispatch, useSelector } from "react-redux";
import { handleFlashcardTopics } from "../../../../../../../../../features/topicsSlice";
import FlashCardStatistics from "../../../../../../../../../components/Flashcardas/FlashCardStatistics";
import { Modal } from "antd";
import { toast } from "react-toastify";

// Thunks — adjust names if your slice uses different ones
import {
  handleCreateFlashCard,
  handleEditFlashCard,
  handleDeleteFlashCard,
  handleGetAllFlashCards,
} from "../../../../../../../../../features/flashcardsSlice";

const FlashCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Add/Edit modal state
  const [libraryModalOpen, setLibraryModalOpen] = useState(false);
  const [creatingOrSaving, setCreatingOrSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    library_name: "",
    description: "",
    difficulty_level: "medium",
    estimated_time: 30,
    status: "active",
  };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Details modal
  const [detailsModal, setDetailsModal] = useState({ open: false, deck: null });

  // Delete modal (normal controlled modal instead of Modal.confirm)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { topicId } = useParams();
  const dispatch = useDispatch();
  // const { all_flashcards } = useSelector((state) => state?.topics);
  const {all_flashcards , flashcard_loading} = useSelector(state => state?.flashcards);

  useEffect(() => {
    dispatch(handleFlashcardTopics({ id: topicId, page: currentPage, limit: itemsPerPage }));
    dispatch(handleGetAllFlashCards({topic_id : topicId}));
  }, [dispatch, topicId, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const getSortedAndFilteredFlashcards = () => {
    if (!all_flashcards?.data?.libraries) return [];

    let filtered = all_flashcards?.data?.libraries.filter((deck) => {
      const s = (searchTerm || "").toLowerCase();
      const matchesSearch =
        !searchTerm ||
        deck.library_name?.toLowerCase().includes(s) ||
        deck.library_description?.toLowerCase().includes(s) ||
        deck.topic_name?.toLowerCase().includes(s);

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        deck.difficulty_level?.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const filteredFlashcards = getSortedAndFilteredFlashcards();
  const totalPages = all_flashcards?.pagination?.totalPages || 1;
  const totalItems = all_flashcards?.pagination?.total || 0;
  const handlePageChange = (page) => setCurrentPage(page);

  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || "").toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "draft":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const breadcrumbs = [
    { label: "Modules", href: "/subjects", icon: Book },
    // { label: all_flashcards?.data?.topic?.topic_name, href: "#" },
    { label: "Flashcard Library", href: "#", current: true },
  ];

  const renderSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  // ====== Modal helpers ======
  const validateForm = () => {
    const e = {};
    if (!form.library_name.trim()) e.library_name = "Library name is required.";
    if (!["easy", "medium", "hard"].includes(form.difficulty_level)) e.difficulty_level = "Select a valid level.";
    const t = Number(form.estimated_time);
    if (!Number.isFinite(t) || t <= 0) e.estimated_time = "Enter a positive number.";
    if (!["active", "inactive", "draft"].includes(form.status)) e.status = "Select a valid status.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setLibraryModalOpen(true);
  };

  const mapDeckToForm = (deck) => ({
    library_name: deck?.library_name || "",
    description: deck?.library_description || deck?.description || "",
    difficulty_level: deck?.difficulty_level || "medium",
    estimated_time: deck?.estimated_time ?? 30,
    status: deck?.status || "active",
  });

  const openEditModal = (deck) => {
    setIsEditing(true);
    setEditingId(deck?.flashcard_id);
    setForm(mapDeckToForm(deck));
    setErrors({});
    setLibraryModalOpen(true);
  };

  const openDetails = (deck) => setDetailsModal({ open: true, deck });
  const closeDetails = () => setDetailsModal({ open: false, deck: null });

  const openDeleteModal = (deck) => {
    setDeleteTarget(deck);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const refreshList = () =>
    dispatch(handleFlashcardTopics({ id: topicId, page: currentPage, limit: itemsPerPage }));

  const submitCreate = async () => {
    if (!validateForm()) return;
    setCreatingOrSaving(true);
    try {
      const payload = {
        topic_id: topicId,
        library_name: form.library_name.trim(),
        description: form.description?.trim(),
        library_description: form.description?.trim(),
        difficulty_level: form.difficulty_level,
        estimated_time: Number(form.estimated_time),
        status: form.status,
      };

      const res =
        (await dispatch(handleCreateFlashCard({ body: payload })).unwrap?.()) ||
        (await dispatch(handleCreateFlashCard({ body: payload })));

      const status = res?.status || res?.data?.status || "success";
      if (status === "success") {
        toast.success(res?.message || "Flashcard library created.");
        setLibraryModalOpen(false);
        dispatch(handleGetAllFlashCards({topic_id : topicId}));
        refreshList();
        resetForm();
      } else {
        toast.error(res?.message || "Failed to create library.");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred while creating the library.");
    } finally {
      setCreatingOrSaving(false);
    }
  };

  const submitUpdate = async () => {
    if (!validateForm() || !editingId) return;
    setCreatingOrSaving(true);
    try {
      const body = {
        library_name: form.library_name.trim(),
        description: form.description?.trim(),
        library_description: form.description?.trim(),
        difficulty_level: form.difficulty_level,
        estimated_time: Number(form.estimated_time),
        status: form.status,
      };

      const res =
        (await dispatch(handleEditFlashCard({ id: editingId, body })).unwrap?.()) ||
        (await dispatch(handleEditFlashCard({ id: editingId, body })));

      const status = res?.status || res?.data?.status || "success";
      if (status === "success") {
        toast.success(res?.message || "Flashcard library updated.");
        setLibraryModalOpen(false);
        dispatch(handleGetAllFlashCards({topic_id : topicId}));
        refreshList();
        resetForm();
      } else {
        toast.error(res?.message || "Failed to update library.");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred while updating the library.");
    } finally {
      setCreatingOrSaving(false);
    }
  };

  const performDelete = async () => {
    if (!deleteTarget?.flashcard_id) return;
    setDeleteLoading(true);
    try {
      const res =
        (await dispatch(handleDeleteFlashCard({ id: deleteTarget.flashcard_id })).unwrap?.()) ||
        (await dispatch(handleDeleteFlashCard({ id: deleteTarget.flashcard_id })));
      const status = res?.status || res?.data?.status || "success";
      if (status === "success") {
        toast.success(res?.message || "Flashcard library deleted.");
        dispatch(handleGetAllFlashCards({topic_id : topicId}));
        closeDeleteModal();
        refreshList();
      } else {
        toast.error(res?.message || "Failed to delete library.");
      }
    } catch (err) {
      toast.error(err?.message || "An error occurred while deleting the library.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalOk = () => (isEditing ? submitUpdate() : submitCreate());

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "—";
    }
  };

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      <PagesHeader
        title={<>Flashcard Library</>}
        // subtitle={`${totalItems} flashcards available for "${all_flashcards?.data?.topic?.topic_name}"`}
        extra={
          <div className="flex items-center space-x-4">
            <Button type="default" icon={<Upload className="w-4 h-4" />}>
              Import
            </Button>
            <Button type="secondary" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
            <Button onClick={openCreateModal} type="primary" size="large" icon={<Plus className="w-5 h-5" />}>
              Add New Flashcard
            </Button>
          </div>
        }
      />

      <FlashCardStatistics />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search flashcards by name, description, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                showFilters ? "bg-teal-50 border-teal-200 text-teal-700" : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="flex bg-white border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-colors ${viewMode === "grid" ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:text-gray-900"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-3 transition-colors ${viewMode === "table" ? "bg-teal-50 text-teal-600" : "text-gray-600 hover:text-gray-900"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-wrap gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value={6}>6 items</option>
                  <option value={12}>12 items</option>
                  <option value={24}>24 items</option>
                  <option value={50}>50 items</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">Showing {filteredFlashcards.length} of {totalItems} flashcards</div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredFlashcards.map((deck) => (
              <div
                key={deck.flashcard_id}
                className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Top-right action icons (always clickable; opacity only for hover) */}
                <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    title="Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(deck);
                    }}
                    className="p-2 bg-white/90 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Info className="w-4 h-4 text-sky-600" />
                  </button>
                  <button
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(deck);
                    }}
                    className="p-2 bg-white/90 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Edit3 className="w-4 h-4 text-amber-600" />
                  </button>
                  <button
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(deck);
                    }}
                    className="p-2 bg-white/90 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="p-6 relative flex flex-col justify-between h-full">
                  <div className="absolute left-0 top-0 blur-3xl bg-gradient-to-br w-20 h-20 rounded-full bg-teal-500 opacity-10" />
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2">
                      {deck.library_name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{deck.library_description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Topic</span>
                      <span className="text-xs font-medium text-gray-900">{deck.topic_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Difficulty</span>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(deck.difficulty_level)}`}>
                        {deck.difficulty_level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">Created by</span>
                      <span className="text-xs text-gray-900">{deck.created_by_name}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </button>
                    <Link
                      href={`flashcards/${deck?.library_id}/flash-card-preview`}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                    >
                      <Play className="w-4 h-4" />
                      Study
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("library_name")}
                    >
                      <div className="flex items-center gap-1">Flashcard Name {renderSortIndicator("library_name")}</div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("topic_name")}
                    >
                      <div className="flex items-center gap-1">Topic {renderSortIndicator("topic_name")}</div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("difficulty_level")}
                    >
                      <div className="flex items-center gap-1">Difficulty {renderSortIndicator("difficulty_level")}</div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center gap-1">Created {renderSortIndicator("created_at")}</div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredFlashcards.map((deck) => (
                    <tr key={deck.flashcard_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{deck.library_name}</div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2">{deck.library_description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{deck.topic_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(deck.difficulty_level)}`}>
                          {deck.difficulty_level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(deck.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetails(deck)}
                            className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                            title="Details"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(deck)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(deck)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowPreviewModal(true)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                            title="Quick View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            href={`flashcards/${deck.flashcard_id}/flash-card-preview`}
                            className="p-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-all"
                            title="Study Flashcard"
                          >
                            <Play className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredFlashcards.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No flashcards found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedDifficulty !== "all"
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "No flashcards available for this topic yet."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-700">Showing page {currentPage} of {totalPages}</div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      currentPage === pageNum ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Preview Modal (simple example) */}
      {showPreviewModal && filteredFlashcards.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full min-h-[60vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Flashcard Preview</h2>
                <p className="text-sm text-gray-600 mt-1">{filteredFlashcards[0]?.library_name}</p>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Front:</h3>
                <p className="text-gray-700">{filteredFlashcards[0]?.front_text}</p>
              </div>

              <div className="bg-teal-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Back:</h3>
                <p className="text-gray-700">{filteredFlashcards[0]?.back_text}</p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowPreviewModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  Close
                </button>
                <Link
                  href={`flashcards/${filteredFlashcards[0]?.flashcard_id}/flash-card-preview`}
                  className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
                >
                  Study Full Deck
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Details Modal — improved design */}
      <Modal
        title={null}
        open={detailsModal.open}
        onCancel={closeDetails}
        footer={null}
        destroyOnClose
        className="!top-10"
      >
        {detailsModal.deck ? (
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <FolderOpenDot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-tight">
                    {detailsModal.deck.library_name}
                  </h2>
                  <p className="text-white/80 text-xs">
                    Flashcard Library • {detailsModal.deck.topic_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 bg-white">
              {/* Description */}
              <div className="rounded-xl border bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">Description</span>
                </div>
                <p className="text-gray-700 text-sm">
                  {detailsModal.deck.library_description || "—"}
                </p>
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MetaItem
                  icon={<Gauge className="w-4 h-4 text-red-600" />}
                  label="Difficulty"
                  value={detailsModal.deck.difficulty_level}
                  badgeClass={getDifficultyColor(detailsModal.deck.difficulty_level)}
                />
                <MetaItem
                  icon={<Clock className="w-4 h-4 text-amber-600" />}
                  label="Estimated Time"
                  value={`${detailsModal.deck.estimated_time ?? 0} min`}
                />
                <MetaItem
                  icon={<User2 className="w-4 h-4 text-emerald-600" />}
                  label="Created By"
                  value={detailsModal.deck.created_by_name || "—"}
                />
                <MetaItem
                  icon={<Clock className="w-4 h-4 text-sky-600" />}
                  label="Created At"
                  value={formatDate(detailsModal.deck.created_at)}
                />
                <MetaItem
                  icon={<Book className="w-4 h-4 text-indigo-600" />}
                  label="Topic"
                  value={detailsModal.deck.topic_name || "—"}
                />
                <MetaItem
                  icon={<FolderOpenDot className="w-4 h-4 text-teal-600" />}
                  label="Status"
                  value={detailsModal.deck.status || "—"}
                  badgeClass={getStatusColor(detailsModal.deck.status)}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="default" onClick={closeDetails}>
                  Close
                </Button>
                <Button type="secondary" onClick={() => { closeDetails(); openEditModal(detailsModal.deck); }}>
                  Edit
                </Button>
                <Button
                  type="danger"
                  onClick={() => {
                    closeDetails();
                    openDeleteModal(detailsModal.deck);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-600">No details.</div>
        )}
      </Modal>

      {/* 🔸 Delete Modal — controlled, reliable */}
      <Modal
        title={null}
        open={deleteModalOpen}
        onCancel={closeDeleteModal}
        destroyOnClose
        footer={null}
        className="!top-24"
      >
        <div className="p-1">
          <div className="rounded-2xl overflow-hidden border border-red-100">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Delete Flashcard Library</h3>
                  <p className="text-white/80 text-xs">
                    This action can’t be undone. Please confirm you want to proceed.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6">
              <p className="text-gray-700">
                You are about to delete:
              </p>
              <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <div className="text-sm">
                  <span className="text-gray-500 mr-1">Library:</span>
                  <span className="font-medium text-gray-900">
                    {deleteTarget?.library_name || "—"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ID: {deleteTarget?.flashcard_id ?? "—"}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button type="text" onClick={closeDeleteModal} disabled={deleteLoading}>
                  Cancel
                </Button>
                <Button
                  type="danger"
                  onClick={performDelete}
                  disabled={deleteLoading}
                  loading={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create/Edit Flashcard Library Modal */}
      <Modal
        title={isEditing ? "Edit Flashcard Library" : "Add Flashcard Library"}
        open={libraryModalOpen}
        onCancel={() => {
          setLibraryModalOpen(false);
          resetForm();
        }}
        onOk={handleModalOk}
        okText={creatingOrSaving ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save Changes" : "Create"}
        okButtonProps={{ className: "!bg-blue-500 text-white", disabled: creatingOrSaving, loading: creatingOrSaving }}
        cancelButtonProps={{ disabled: creatingOrSaving }}
        destroyOnClose
      >
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Library Name <span className="text-red-500">*</span>
            </label>
            <input
              value={form.library_name}
              onChange={(e) => setForm((f) => ({ ...f, library_name: e.target.value }))}
              placeholder="USMLE Step 1 - Pathology"
              className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 ${
                errors.library_name ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.library_name && <p className="text-xs text-red-500 mt-1">{errors.library_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Comprehensive pathology review for Step 1 exam preparation"
              rows={3}
              className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                value={form.difficulty_level}
                onChange={(e) => setForm((f) => ({ ...f, difficulty_level: e.target.value }))}
                className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.difficulty_level ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              {errors.difficulty_level && <p className="text-xs text-red-500 mt-1">{errors.difficulty_level}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Est. Time (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={form.estimated_time}
                onChange={(e) => setForm((f) => ({ ...f, estimated_time: Number(e.target.value) }))}
                className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.estimated_time ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.estimated_time && <p className="text-xs text-red-500 mt-1">{errors.estimated_time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className={`mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.status ? "border-red-300" : "border-gray-300"
                }`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
            </div>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
};

function MetaItem({ icon, label, value, badgeClass }) {
  const isBadge = Boolean(badgeClass);
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      {isBadge ? (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${badgeClass}`}>
          {value || "—"}
        </span>
      ) : (
        <div className="text-sm font-medium text-gray-900">{value || "—"}</div>
      )}
    </div>
  );
}

export default FlashCards;

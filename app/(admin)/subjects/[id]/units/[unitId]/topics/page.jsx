"use client";

import React, { useMemo, useState } from "react";
import BreadcrumbsShowcase from "../../../../../../../components/ui/BreadCrumbs";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../../../data/subjects";
import { BarChart3, Book, Download, Plus, Upload, Search, X } from "lucide-react";
import PageLayout from "../../../../../../../components/layout/PageLayout";
import Button from "../../../../../../../components/atoms/Button";
import PagesHeader from "../../../../../../../components/ui/PagesHeader";
import TopicsStats from "../../../../../../../components/Topics/TopicsStats";
import SearchAndFilters from "./../../../../../../../components/ui/SearchAndFilters";
import AdvancedTopicsFilters from "../../../../../../../components/ui/AdvancedTopicsFilters";
import UnitCard from "../../../../../../../components/ui/Cards/UnitCard";
import TopicCard from "../../../../../../../components/ui/Cards/TopicCard";
import AddTopicForm from "../../../../../../../components/Topics/AddNewTopic.modal";
import DeleteTopicModal from "../../../../../../../components/Topics/DeleteTopic.modal";
import { Card } from "antd";
import {
  searchTopics,
  filterTopics,
  sortTopics,
  hasActiveFilters,
  getDefaultFilters,
} from "../../../../../../../utils/topicsUtils";

const TopicsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const { id, unitId } = useParams();
  const [addTopicModal, setAddTopicModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState(getDefaultFilters());
  const [showFilters, setShowFilters] = useState(false);
  const selectedSubjectAndUnit = useMemo(() => {
    const subject = subjects.find(
      (subject) => subject.code == decodeURIComponent(id)
    );
    const unit = subject?.units.find(
      (unit) => unit.name == decodeURIComponent(unitId)
    );

    console.log("unitId", decodeURIComponent(unitId));
    return { subject, unit };
  }, [id, unitId]);

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubjectAndUnit?.subject?.name, href: "#" },
    { label: selectedSubjectAndUnit?.unit?.name, href: "#", current: true },
  ];

  // Get topics from the selected unit
  const topics = useMemo(() => {
    return selectedSubjectAndUnit?.unit?.topics?.map(topic => ({
      ...topic,
      unitName: selectedSubjectAndUnit.unit.name,
      subjectName: selectedSubjectAndUnit.subject.name,
      subjectCode: selectedSubjectAndUnit.subject.code
    })) || [];
  }, [selectedSubjectAndUnit]);

  // Filter and search functions
  const getFilteredTopics = () => {
    let filtered = searchTopics(topics, searchTerm);
    filtered = filterTopics(filtered, filters);
    filtered = sortTopics(filtered, filters.sortBy, filters.sortOrder);
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
    setFilters(getDefaultFilters());
  };

  const hasActiveFiltersData = () => {
    return hasActiveFilters(searchTerm, filters);
  };
  return (
    <div>
      <PageLayout>
        <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

        {/* Header */}
        <PagesHeader
          title={<> Unit: {selectedSubjectAndUnit?.unit?.name}</>}
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
                onClick={() => setAddTopicModal(true)}
                type="primary"
                size="large"
                icon={<Plus className="w-5 h-5" />}
              >
                Add New Topic
              </Button>
            </div>
          }
        />

        <TopicsStats topics={selectedSubjectAndUnit?.unit?.topics} />

        <SearchAndFilters
          mode={viewMode}
          setMode={setViewMode}
          searchTerm={searchTerm}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          setSearchTerm={setSearchTerm}
          searchPlacehodler="Search topics, descriptions..."
        />

        {/* Advanced Filter Controls */}
        <AdvancedTopicsFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearAllFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          hasActiveFilters={hasActiveFiltersData}
          filteredCount={getFilteredTopics().length}
          totalCount={topics.length}
        />

        {/* Content */}
        {getFilteredTopics().length === 0 ? (
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
          ""
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTopics().map((topic, index) => (
              <TopicCard
                onDeleteTopic={(e, data) => {
                  setDeleteModal(true);
                  setSelectedData(data);
                }}
                topic={topic}
                key={index}
              />
            ))}
          </div>
        )}

        <AddTopicForm
          open={addTopicModal}
          onCancel={() => setAddTopicModal(false)}
          defaultUnitId={1}
        />
        <DeleteTopicModal
          data={selectedData}
          open={deleteModal}
          setOpen={setDeleteModal}
        />
      </PageLayout>
    </div>
  );
};

export default TopicsPage;

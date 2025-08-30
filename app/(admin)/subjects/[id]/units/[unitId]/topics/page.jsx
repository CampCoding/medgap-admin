"use client";

import React, { useMemo, useState } from "react";
import BreadcrumbsShowcase from "../../../../../../../components/ui/BreadCrumbs";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../../../data/subjects";
import { BarChart3, Book, Download, Plus, Upload } from "lucide-react";
import PageLayout from "../../../../../../../components/layout/PageLayout";
import Button from "../../../../../../../components/atoms/Button";
import PagesHeader from "../../../../../../../components/ui/PagesHeader";
import TopicsStats from "../../../../../../../components/Topics/TopicsStats";
import SearchAndFilters from "./../../../../../../../components/ui/SearchAndFilters";
import UnitCard from "../../../../../../../components/ui/Cards/UnitCard";
import TopicCard from "../../../../../../../components/ui/Cards/TopicCard";
import AddTopicForm from "../../../../../../../components/Topics/AddNewTopic.modal";
import DeleteTopicModal from "../../../../../../../components/Topics/DeleteTopic.modal";

const TopicsPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const { id, unitId } = useParams();
  const [addTopicModal, setAddTopicModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
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
          setSearchTerm={setSearchTerm}
        />

        {viewMode == "table" ? (
          ""
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedSubjectAndUnit?.unit?.topics?.map((topic, index) => (
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

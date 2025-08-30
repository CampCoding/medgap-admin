"use client";

import React, { useMemo, useState } from "react";
import PageLayout from "../../../../../components/layout/PageLayout";
import { BarChart3, Book, Download, Plus, Upload } from "lucide-react";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import Button from "../../../../../components/atoms/Button";
import { useParams } from "next/navigation";
import { subjects } from "../../../../../data/subjects";
import UnitsStats from "../../../../../components/Units/UnitStats";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
import UnitCard from "../../../../../components/ui/Cards/UnitCard";
import AddUnitForm from "./../../../../../components/Units/AddNewUnit.modal";
import DeleteUnitModal from "../../../../../components/Units/DeleteUnit.modal";

const Units = () => {
  const { id } = useParams();
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [newUnitModal, setNewUnitModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const selectedSubject = useMemo(() => {
    const subject = subjects.find((subject) => subject.code === id);
    console.log(subject);
    return subject;
  }, [id]);
  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: "Modules", href: "/subjects", icon: Book },
    { label: selectedSubject?.name, href: "#", current: true },
  ];

  return (
    <PageLayout>
      <BreadcrumbsShowcase items={breadcrumbs} variant="pill" />

      {/* Header */}
      <PagesHeader
        title={<>Subject: {selectedSubject?.name}</>}
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
              onClick={() => setNewUnitModal(true)}
              type="primary"
              size="large"
              icon={<Plus className="w-5 h-5" />}
            >
              Add New Unit
            </Button>
          </div>
        }
      />

      <UnitsStats units={selectedSubject.units} />

      <SearchAndFilters
        mode={mode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setMode={setMode}
      />

      {/* Content */}
      {mode === "table" ? (
        ""
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedSubject?.units?.map((unit, index) => (
            <UnitCard
              onDeleteClick={(e , data) => {
                setSelectedUnit(data);
                console.log( "selectedData" , data)
                setDeleteModal(true);
              }}
              unit={unit}
              key={index}
            />
          ))}
        </div>
      )}

      <AddUnitForm
        open={newUnitModal}
        onCancel={() => setNewUnitModal(false)}
        onSubmit={() => null}
        subjects={subjects}
      />

      <DeleteUnitModal
        open={deleteModal}
        setOpne={setDeleteModal}
        data={selectedUnit}
      />
    </PageLayout>
  );
};

export default Units;

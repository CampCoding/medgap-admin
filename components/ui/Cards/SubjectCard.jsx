"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "../../atoms/Card";
import Badge from "../../atoms/Badge";
import {
  Calendar,
  Edit3,
  Settings,
  Trash2,
  BookOpen,
  Layers,
  MoreHorizontal,
} from "lucide-react";
import Button from "../../atoms/Button";
import Link from "next/link";
import PreserveSubjectLink from "../../PreserveSubjectLink";
import EditSubjectForm from "../../Subjects/EditNewSubjectModal";

const SubjectCard = ({
  subject,
  setSelectedSubject,
  setInactive, // kept in props, not used in dropdown per your request
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

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

  return (
    <>
      <Card
        key={subject.id}
  className={`relative p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${menuOpen ? "z-50" : ""}`}
      >
        {/* Clickable main body -> Units */}
        <PreserveSubjectLink href={`/subjects/${subject?.id}/units`}>
          <div className="flex items-start justify-between mb-4">
            <div
              style={{ backgroundColor: subject?.color }}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
            >
              {subject.name.substring(0, 2)}
            </div>
            <div className="flex space-x-1">
              <Badge color={getStatusColor(subject.status)}>
                {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
              </Badge>
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#202938] mb-1">{subject.name}</h3>
          <p className="text-sm text-[#202938]/60 mb-1">Code: {subject.code}</p>
          <p className="text-sm text-[#202938]/80 mb-4 line-clamp-2">
            {subject.description}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#0F7490]">{subject?.units}</p>
              <p className="text-xs text-[#202938]/60">Subjects</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#C9AE6C]">{subject?.students}</p>
              <p className="text-xs text-[#202938]/60">Students</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#8B5CF6]">{subject.questions}</p>
              <p className="text-xs text-[#202938]/60">Questions</p>
            </div>
          </div>
        </PreserveSubjectLink>

        {/* Footer: last updated + dropdown */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-1 text-xs text-[#202938]/60">
            <Calendar className="w-3 h-3" />
            <span>{new Date(subject.lastUpdated).toLocaleString()}</span>
          </div>

          <div className="relative" ref={menuRef}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((s) => !s);
              }}
              type="text"
              size="small"
              className="text-[#202938] hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Open subject actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-[70] mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg p-1">
                {/* Digital Library */}
                {/* <Link
                  href={`/subjects/${subject?.id}/digital-library`}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-700"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Digital Library
                </Link> */}

                {/* Units */}
                <PreserveSubjectLink
                  href={`/subjects/${subject?.id}/units`}
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-700"
                  onClick={() => setMenuOpen(false)}
                  role="menuitem"
                >
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Subjects
                </PreserveSubjectLink>

                {/* Divider */}
                <div className="my-1 h-px bg-gray-100" />

                {/* Edit */}
                <button
                  onClick={() => {
                    setRowData(subject);
                    setOpenEditModal(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-700"
                  role="menuitem"
                >
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    setSelectedSubject(subject);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-red-50 text-sm text-red-600"
                  role="menuitem"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Edit modal (kept as-is) */}
      <EditSubjectForm
        open={openEditModal}
        setOpen={setOpenEditModal}
        rowData={rowData}
        setRowData={setRowData}
      />
    </>
  );
};

export default SubjectCard;

"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BarChart3, User, Users, CalendarClock, BookOpen, Circle } from "lucide-react";
import { Pagination, Table, Tag, Button, Empty, Spin } from "antd";

import PageLayout from "../../../../../components/layout/PageLayout";
import BreadcrumbsShowcase from "../../../../../components/ui/BreadCrumbs";
import PagesHeader from "../../../../../components/ui/PagesHeader";
import SearchAndFilters from "../../../../../components/ui/SearchAndFilters";
// ⛔ Removed: SubjectCard import
// import SubjectCard from "../../../../../components/ui/Cards/SubjectCard";
import { handleGetTeacherModules } from "../../../../../features/teachersSlice";
import DeleteTeacherModal from "../../../../../components/Teachers/DeleteTeacherModal";
import DeleteTeacheModuleModal from "../../../../../components/Teachers/DeleteTeacherModuleModal";

export default function TeacherModulesPage() {
  const [mode, setMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // grid default

  const { id } = useParams();
  const dispatch = useDispatch();
  const { teacher_modules_loading, teacher_modules } = useSelector(
    (state) => state?.teachers
  );

  // Normalize payload shape: support both {data:{...}} and flat {...}
  const dataPayload = teacher_modules?.data ?? teacher_modules ?? {};
  const modules = dataPayload?.modules ?? [];
  const teacher = dataPayload?.teacher ?? null;
  const apiPagination = dataPayload?.pagination ?? null; // { total, page, limit, totalPages }

  // Fetch list (server pagination if available)
  useEffect(() => {
    dispatch(
      handleGetTeacherModules({
        id,
        page,
        limit: pageSize,
        q: searchTerm?.trim() || undefined,
      })
    );
  }, [id, page, pageSize, searchTerm, dispatch]);

  // If API provides pagination meta, use it; otherwise fall back to client-side pagination
  const isServerPaginated =
    apiPagination && Number(apiPagination?.total) > 0 && Number(apiPagination?.limit) > 0;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (isServerPaginated) return modules; // server already filtered/paged
    if (!normalizedSearch) return modules;
    return modules.filter((m) =>
      [m.subject_name, m.subject_code, m.description]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(normalizedSearch))
    );
  }, [isServerPaginated, modules, normalizedSearch]);
 const [openDeleteModal , setOpenDeleteModal] = useState(false);

  const clientTotal = filtered.length;
  const clientSliceStart = (page - 1) * pageSize;
  const clientSliceEnd = clientSliceStart + pageSize;
  const displayData = isServerPaginated ? modules : filtered.slice(clientSliceStart, clientSliceEnd);

  const totalItems = isServerPaginated ? Number(apiPagination.total) : clientTotal;
  const currentPage = isServerPaginated ? Number(apiPagination.page || page) : page;
  const currentPageSize = isServerPaginated ? Number(apiPagination.limit || pageSize) : pageSize;

  const handleChangePage = (p, ps) => {
    setPage(p);
    setPageSize(ps);
  };

  const handleSubjectAction = (record, action) => {
    // TODO: wire to your modals/routes
    // e.g., router.push(`/modules/${record.module_id}`)
    console.log(action, record);
  };

  const breadcrumbs = [
    { label: "Home", href: "/", icon: BarChart3 },
    { label: teacher?.full_name || "Teacher", icon: User, href: "/teachers" },
    { label: "Modules", href: "#", current: true },
  ];

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    } catch {
      return String(d);
    }
  };

  // --- Fresh Card Component (built from scratch) ---
  function ModuleCard({ mod, onOpen, onEdit, onDelete, onSetInactive }) {
    return (
      <div className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-4 flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-2 items-start justify-between">
          <div className="w-10 flex justify-center items-center text-white font-bold h-10 rounded-lg" style={{backgroundColor : mod.subject_color}}>
            {mod.subject_name.slice(0,2)}
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: mod.subject_color || "#999" }}
              title={mod.subject_color || ""}
            />
            <h3 className="text-base font-semibold leading-tight">
              {mod.subject_name || "-"}
            </h3>
          </div>
          <Tag bordered={false}>{mod.subject_code || "-"}</Tag>
        </div>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          {mod.description || "—"}
        </p>

        {/* Meta grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{mod.students_count ?? 0} students</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarClock size={16} />
            <span>{formatDate(mod.assigned_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} />
            <Tag color={mod.status === "active" ? "green" : "red"} className="m-0">
              {mod.status || "-"}
            </Tag>
          </div>
          <div className="flex items-center gap-2">
            <Circle size={16} />
            <span style={{ color: mod.subject_color || "#999" }}>
              {mod.subject_color || "-"}
            </span>
          </div>
        </div>

        <Button size="small" className="mt-4 w-fit ms-auto" danger onClick={() => setOpenDeleteModal(mod)}>
            Delete
          </Button>
      </div>
    );
  }
  // --- End Card ---

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject_name",
      key: "subject_name",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ background: record.subject_color || "#999" }}
          />
          <span>{text}</span>
        </div>
      ),
    },
    { title: "Code", dataIndex: "subject_code", key: "subject_code" },
    { title: "Students", dataIndex: "students_count", key: "students_count" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color={s === "active" ? "green" : "red"}>{s || "-"}</Tag>,
    },
    {
      title: "Assigned At",
      dataIndex: "assigned_at",
      key: "assigned_at",
      render: (d) => formatDate(d),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
         
          <Button size="small" danger onClick={() => setOpenDeleteModal(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <div dir="ltr">
        <BreadcrumbsShowcase variant="pill" items={breadcrumbs} />
        <PagesHeader title="Teacher Modules" subtitle="Manage and organize teacher modules" />

        <SearchAndFilters
          mode={mode}
          setMode={setMode}
          searchTerm={searchTerm}
          setSearchTerm={(v) => {
            setPage(1); // reset page on search
            setSearchTerm(v);
          }}
        />

        {teacher_modules_loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" />
          </div>
        ) : displayData?.length === 0 ? (
          <div className="py-16">
            <Empty description="No modules found" />
          </div>
        ) : mode === "grid" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {displayData.map((m) => (
                <ModuleCard
                  key={m.module_id}
                  mod={m}
                  onOpen={() => handleSubjectAction(m, "open")}
                  onEdit={() => handleSubjectAction(m, "edit")}
                  onDelete={() => handleSubjectAction(m, "delete")}
                  onSetInactive={() => handleSubjectAction(m, "setInactive")}
                />
              ))}
            </div>

            <div className="flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={currentPageSize}
                total={totalItems}
                showSizeChanger
                onChange={handleChangePage}
              />
            </div>
          </>
        ) : (
          <>
            <Table
              rowKey="module_id"
              dataSource={displayData}
              columns={columns}
              pagination={false}
              size="middle"
            />
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                pageSize={currentPageSize}
                total={totalItems}
                showSizeChanger
                onChange={handleChangePage}
              />
            </div>
          </>
        )}
      </div>

      <DeleteTeacheModuleModal 
      teacher_id = {id}
      data={openDeleteModal}
      open={openDeleteModal}
      setOpen={setOpenDeleteModal}
      />
    </PageLayout>
  );
}

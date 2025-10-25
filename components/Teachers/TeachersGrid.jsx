"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Tag,
  Button,
  Tooltip,
  Avatar,
  Pagination,
  Select,
  ConfigProvider,
  Dropdown,
  Modal,
  Segmented,
  Badge,
  Skeleton,
  message,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  CalendarOutlined,
  UserOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";

// ⬇ keep if you still edit TEACHERS inside this card
import EditTeacherModal from "./EditTeacher.modal";

// ⬇ new: edit REVIEWERS inside this card (update the path if different)

import AssignReviewerModal from "./AssignReviewerModal.modal";
import { subjects } from "../../data/subjects";
import { BookPlus, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import EditReviewerModal from "../Reviewers/EditRev.modal";

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

// --- Status helpers ---
const toStatus = (s) => (s ?? "").toString().trim().toLowerCase();

const STATUS_META = {
  approved: { color: "success", dot: "🟢", label: "Approved" },
  pending: { color: "warning", dot: "🟡", label: "Pending" },
  rejected: { color: "error", dot: "🔴", label: "Rejected" },
};

function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("");
}

// Transform API data to match frontend structure
const transformTeacherData = (apiTeachers) => {
  console.log(apiTeachers);
  return (apiTeachers || []).map((teacher) => ({
    id: teacher?.teacher_id || teacher?.id,
    name: teacher?.name|| teacher?.full_name,
    email: teacher.email,
    phone: teacher.phone,
    subjects:
      teacher.subjects ||
      (teacher.active_modules || []).map((m) => m.subject_name) ||
      [],
    status: teacher.status,
    joinDate: teacher.joinDate || teacher?.join_date,
    experience: teacher.experience ?? teacher?.experience_years ?? 0, // keep numeric for sorting
    qualification: teacher.qualification,
    avatar: teacher?.avatar || teacher?.full_image_url,
    notes: teacher.notes,
    reviewer: teacher.reviewer || null,
    // Keep original API data for reference
    _original: teacher,
  }));
};

function TeacherCards({
  id,
  data = [],
  loading = false,
  pageSizeOptions = [6, 9, 12],
  defaultPageSize = 9,
  entityType = "teacher", // ⬅️ NEW: 'teacher' | 'reviewer'
  onView,
  onApprove,
  onReject,
  onChangeStatus,
  onDelete,
  onAssignReviewer,
  onEditSuccess, // ⬅️ optional: refresh list after editing
  reviewerOptions = [],
  subjectOptions = [],
}) {
  const [page, setPage] = useState(1);
  const [ps, setPs] = useState(defaultPageSize);

  // local modal state
  const [editTeacherOpen, setEditTeacherOpen] = useState(false);
  const [editReviewerOpen, setEditReviewerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [assignReviewerModal, setAssignReviewerModal] = useState(false);
  const [selectedTeacherForReviewer, setSelectedTeacherForReviewer] =
    useState(null);

  // Transform API data to match frontend structure
  const transformedData = useMemo(() => transformTeacherData(data), [data]);
  const router = useRouter();


  // normalize once
  const normalizedData = useMemo(
    () =>
      (transformedData || []).map((t) => ({
        ...t,
        _status: toStatus(t.status),
      })),
    [transformedData]
  );

  // counts for badges
  const counts = useMemo(() => {
    const c = {
      approved: 0,
      pending: 0,
      rejected: 0,
      all: normalizedData.length,
    };
    normalizedData.forEach((t) => {
      c[t._status] = (c[t._status] || 0) + 1;
    });
    return c;
  }, [normalizedData]);

  // filtering
  const filtered = useMemo(() => {
    if (statusFilter === "all") return normalizedData;
    return normalizedData.filter((t) => t._status === statusFilter);
  }, [normalizedData, statusFilter]);

  const total = filtered.length;

  // pagination slice
  const pageData = useMemo(() => {
    const start = (page - 1) * ps;
    return filtered?.slice(start, start + ps);
  }, [filtered, page, ps]);
  
    useEffect(() => {
    console.log(data ,pageData)
  } , [data, pageData])
  // keep page valid when filter/page size changes
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / ps));
    if (page > maxPage) setPage(1);
  }, [total, ps, page]);

  const STATUS_OPTIONS = Object.keys(STATUS_META).map((k) => ({
    label: `${STATUS_META[k].dot} ${STATUS_META[k].label}`,
    value: k,
  }));

  // ⬇️ compute modules base path by entity type
  const modulesBase = entityType === "reviewer" ? "reviewers" : "teachers";

  const moreMenu = (row) => ({
    items: [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: entityType === "reviewer" ? "Edit Reviewer" : "Edit Teacher",
      },
      {
        key: "status",
        icon: <SyncOutlined />,
        label: "Change Status",
        children: STATUS_OPTIONS.map((s) => ({
          key: `status:${s.value}`,
          label: s.label,
        })),
      },
      id && {
        key: "modules",
        icon: <BookPlus className="w-4 h-4" />,
        label: "Modules",
      },
      ...(entityType === "teacher"
        ? [{ type: "divider" }, 
          // { key: "assign", icon: <UserCheck className="w-4 h-4" />, label: "Assign Reviewer" }
        ]
        : [{ type: "divider" }]),
      {
        key: "delete",
        danger: true,
        icon: <DeleteOutlined />,
        label: entityType === "reviewer" ? "Delete Reviewer" : "Delete Teacher",
      },
    ],
    onClick: ({ key }) => {
      if (key === "edit") {
        setSelectedRow(row);
        if (entityType === "reviewer") setEditReviewerOpen(true);
        else setEditTeacherOpen(true);
        return;
      }
      if (key.startsWith("status")) {
        console.log(row);
        const newStatus = key.split(":")[1];
        onChangeStatus?.(row, newStatus);
        return;
      }
      if (key === "modules") {
        router.push(`/${modulesBase}/${row?.id}/modules`);
        return;
      }
      if (key === "assign" && entityType === "teacher") {
        setAssignReviewerModal(true);
        setSelectedTeacherForReviewer(row);
        return;
      }
      if (key === "delete") {
        onDelete?.(row);
        return;
      }
    },
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Fix avatar display - check both avatar and image_url
  const getAvatarSrc = (row) => {
    return row.avatar || row._original?.full_image_url;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-sm border border-gray-200"
          >
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </div>
    );
  }

  // noun for empty states
  const noun = entityType === "reviewer" ? "reviewers" : "teachers";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 14,
          colorText: PALETTE.text,
        },
      }}
    >
      <div className="space-y-4">
        {/* Header filters */}
        <div className="flex items-center justify-between">
          <Segmented
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            options={[
              {
                label: (
                  <div className="flex items-center gap-2 px-5">
                    <span>All</span>
                    <Badge count={counts.all} />{" "}
                  </div>
                ),
                value: "all",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <span>🟢 Approved</span>
                    <Badge count={counts.approved} />
                  </div>
                ),
                value: "approved",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <span>🟡 Pending</span>
                    <Badge count={counts.pending} />
                  </div>
                ),
                value: "pending",
              },
              {
                label: (
                  <div className="flex items-center gap-2">
                    <span>🔴 Rejected</span>
                    <Badge count={counts.rejected} />
                  </div>
                ),
                value: "rejected",
              },
            ]}
          />

          {/* Page size */}
          <Select
            value={ps}
            onChange={(v) => {
              setPs(v);
              setPage(1);
            }}
            options={pageSizeOptions.map((n) => ({
              label: `${n} / page`,
              value: n,
            }))}
            className="min-w-[130px] rounded-lg"
          />
        </div>

        {/* Grid */}
        {pageData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No {noun} found
            </h3>
            <p className="text-gray-500">
              {statusFilter !== "all"
                ? `No ${statusFilter} ${noun} available`
                : `No ${noun} available at the moment`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {pageData.map((t) => {
                const meta = STATUS_META[t._status] || STATUS_META.pending;
                const avatarSrc = getAvatarSrc(t);
                console.log(t);
                return (
                  <Card
                    key={t.id}
                    className="rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200 hover:shadow-md transition-all"
                    bodyStyle={{ padding: 16, height: "100%" }}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={t?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <Avatar
                          size={48}
                          style={{
                            background:
                              "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                          }}
                        >
                          {initials(t.name)}
                        </Avatar>
                      )}

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-[#202938] m-0">
                            {t.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Tag
                              color={meta.color}
                              className="rounded-full px-3 py-1 text-[12px]"
                            >
                              <span className="mr-1">{meta.dot}</span>
                              {meta.label}
                            </Tag>

                            {/* Only show reviewer badge if this is a TEACHER card */}
                            {entityType === "teacher" && t.reviewer && (
                              <Tooltip
                                title={`${t.reviewer.name} is assigned as a reviewer for this teacher`}
                              >
                                <UserCheck className="!w-6 p-1 !h-6 rounded-full border text-green-700 border-green-700 cursor-pointer" />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm m-0">{t.email}</p>
                      </div>
                    </div>

                    {/* Qualification */}
                    {t.qualification && (
                      <div className="mt-3">
                        <Tag
                          className="rounded-full px-3 py-1 text-[12px] border-0"
                          style={{
                            backgroundColor: "#0F74900F",
                            color: PALETTE.primary,
                          }}
                        >
                          {t.qualification}
                        </Tag>
                      </div>
                    )}

                    <div className="mt-auto">
                      {/* Meta row */}
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-[#202938]">
                          <TrophyOutlined style={{ color: PALETTE.secondary }} />
                          <span className="text-sm">{t.experience} years</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#202938]">
                          <CalendarOutlined style={{ color: PALETTE.accent }} />
                          <span className="text-sm">{formatDate(t.joinDate)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-between">
                        <Tooltip title="View profile">
                          <Button
                            icon={<EyeOutlined />}
                            onClick={() => onView?.(t)}
                            className="rounded-lg"
                          >
                            View
                          </Button>
                        </Tooltip>

                        <div className="flex items-center gap-2">
                          {t._status !== "approved" && (
                            <Button
                              type="primary"
                              className="bg-green-600 hover:!bg-green-700 rounded-lg"
                              icon={<CheckCircleOutlined />}
                              onClick={() => onApprove?.(t)}
                            >
                              Approve
                            </Button>
                          )}
                          {t._status !== "rejected" && (
                            <Button
                              className="rounded-lg"
                              icon={<CloseCircleOutlined />}
                              onClick={() => onReject?.(t)}
                            >
                              Reject
                            </Button>
                          )}

                          <Dropdown
                            trigger={["click"]}
                            placement="bottomRight"
                            menu={moreMenu(t)}
                          >
                            <Button className="rounded-lg" icon={<MoreOutlined />} />
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Footer: pagination + range info */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {total === 0 ? 0 : (page - 1) * ps + 1}-
                  {Math.min(page * ps, total)}
                </span>{" "}
                of <span className="font-medium">{total}</span>{" "}
                {statusFilter === "all" ? noun : `${statusFilter} ${noun}`}
              </div>

              <Pagination
                current={page}
                pageSize={ps}
                total={total}
                showSizeChanger={false}
                onChange={(p) => setPage(p)}
                showQuickJumper={total > 50}
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modals (auto-pick based on entityType) */}
      {entityType === "teacher" ? (
        <EditTeacherModal
        id={id}
          open={editTeacherOpen}
          onCancel={() => setEditTeacherOpen(false)}
          teacher={selectedRow}
          subjectOptions={subjects}
          onSuccess={() => {
            setEditTeacherOpen(false);
            onEditSuccess?.();
          }}
        />
      ) : (
        <EditReviewerModal
          open={editReviewerOpen}
          onCancel={() => setEditReviewerOpen(false)}
          reviewer={selectedRow}
          subjectOptions={subjectOptions}
          onSuccess={() => {
            setEditReviewerOpen(false);
            onEditSuccess?.();
          }}
        />
      )}

      {/* Assign Reviewer Modal — only relevant when viewing TEACHERS */}
      {entityType === "teacher" && (
        <AssignReviewerModal
          open={assignReviewerModal}
          onCancel={() => {
            setAssignReviewerModal(false);
            setSelectedTeacherForReviewer(null);
          }}
          teacher={selectedTeacherForReviewer}
          reviewerOptions={reviewerOptions}
          subjectOptions={subjectOptions}
          onSubmit={(payload) => {
            onAssignReviewer?.(payload);
            setAssignReviewerModal(false);
          }}
        />
      )}
    </ConfigProvider>
  );
}

export default TeacherCards;

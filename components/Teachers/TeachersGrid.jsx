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
import EditTeacherModal from "./EditTeacher.modal";
import AssignReviewerModal from "./AssignReviewerModal.modal";
import { subjects } from "../../data/subjects";
import { UserCheck } from "lucide-react";

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

function TeacherCards({
  data = [],
  pageSizeOptions = [6, 9, 12],
  defaultPageSize = 9,
  onView,
  onApprove,
  onReject,
  onChangeStatus,
  onDelete,
  onAssignReviewer,
  reviewerOptions = [],
  subjectOptions = [],
}) {
  const [page, setPage] = useState(1);
  const [ps, setPs] = useState(defaultPageSize);
  const [edit, setEdit] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "approved" | "pending" | "rejected"
  const [assignReviewerModal, setAssignReviewerModal] = useState(false);
  const [selectedTeacherForReviewer, setSelectedTeacherForReviewer] =
    useState(null);

  // normalize once
  const normalizedData = useMemo(
    () =>
      (data || []).map((t) => ({
        ...t,
        _status: toStatus(t.status),
      })),
    [data]
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
    return filtered.slice(start, start + ps);
  }, [filtered, page, ps]);

  // keep page valid when filter/page size changes
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(total / ps));
    if (page > maxPage) setPage(1);
  }, [total, ps, page]);

  const STATUS_OPTIONS = Object.keys(STATUS_META).map((k) => ({
    label: `${STATUS_META[k].dot} ${STATUS_META[k].label}`,
    value: k,
  }));

  const moreMenu = (teacher) => ({
    items: [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
      },
      {
        key: "reviewer",
        icon: <UserCheck className="w-4 h-4" />,
        label: teacher.reviewer ? "Edit Reviewer" : "Assign Reviewer",
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
      { type: "divider" },
      {
        key: "delete",
        danger: true,
        icon: <DeleteOutlined />,
        label: "Delete",
      },
    ],
    onClick: ({ key }) => {
      if (key === "edit") {
        setEdit(true);
        setSelectedTeacher(teacher);
        return;
      }
      if (key === "reviewer") {
        setAssignReviewerModal(true);
        setSelectedTeacherForReviewer(teacher);
        return;
      }
      if (key.startsWith("status:")) {
        const newStatus = key.split(":")[1]; // approved | pending | rejected
        onChangeStatus?.(teacher, newStatus);
        return;
      }
      if (key === "delete") {
        Modal.confirm({
          title: "Delete teacher?",
          content: `This will permanently remove ${teacher.name}.`,
          okText: "Delete",
          okType: "danger",
          cancelText: "Cancel",
          onOk: () => onDelete?.(teacher),
        });
      }
    },
  });

  



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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pageData.map((t) => {
            const meta = STATUS_META[t._status] || STATUS_META.pending;
            return (
              <Card
                key={t.id}
                className="rounded-2xl flex flex-col justify-between shadow-sm border border-gray-200 hover:shadow-md transition-all"
                bodyStyle={{ padding: 16, height: "100%" }}
                style={{ body: { padding: 16, height: "100%" } }}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <Avatar
                    size={48}
                    style={{
                      background:
                        "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                    }}
                    icon={<UserOutlined />}
                  >
                    {initials(t.name)}
                  </Avatar>

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
                        {t.reviewer && (
                          <Tooltip
                            title={`${t.reviewer.name} is assigned as a reviewer for this teacher`}
                            color="geekblue-inverse"
                          >
                            <UserCheck className="  !w-6 p-1 !h-6 rounded-full border text-green-700 border-green-700 cursor-pointer  " />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm m-0">{t.email}</p>
                  </div>
                </div>
                {/* Modules */}
                {/* Subjects or Modules */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(t.subjects || []).map((s, i) => (
                    <Tag
                      key={s + i}
                      className="rounded-full px-3 py-1 text-[12px] border-0"
                      style={{
                        backgroundColor: "#0F74900F",
                        color: PALETTE.primary,
                      }}
                    >
                      {s}
                    </Tag>
                  ))}
                </div>
                <div className="mt-auto">
                  {/* Meta row */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-[#202938]">
                      <TrophyOutlined style={{ color: PALETTE.secondary }} />
                      <span className="text-sm">{t.experience}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#202938]">
                      <CalendarOutlined style={{ color: PALETTE.accent }} />
                      <span className="text-sm">{t.joinDate}</span>
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
                        <Button
                          className="rounded-lg"
                          icon={<MoreOutlined />}
                        />
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
            {statusFilter === "all" ? "teachers" : `${statusFilter} teachers`}
          </div>

          <Pagination
            current={page}
            pageSize={ps}
            total={total}
            showSizeChanger={false}
            onChange={(p) => setPage(p)}
          />
        </div>
      </div>

      <EditTeacherModal
        open={edit}
        onCancel={() => setEdit(false)}
        teacher={selectedTeacher}
        subjectOptions={subjects}
      />

      <AssignReviewerModal
        open={assignReviewerModal}
        onCancel={() => {
          setAssignReviewerModal(false);
          setSelectedTeacherForReviewer(null);
        }}
        teacher={selectedTeacherForReviewer}
        reviewerOptions={reviewerOptions}
        subjectOptions={subjectOptions}
        onSubmit={onAssignReviewer}
      />
    </ConfigProvider>
  );
}

export default TeacherCards;

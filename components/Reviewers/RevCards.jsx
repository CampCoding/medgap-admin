"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  Tag,
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
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  EyeOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { subjects } from "../../data/subjects";
import { UserCheck } from "lucide-react";
import Button from "../atoms/Button";
import EditRevModal from "./EditRev.modal";

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

function RevCards({
  data = [],
  pageSizeOptions = [6, 9, 12],
  defaultPageSize = 9,
  onView,
  onApprove,
  onReject,
  onChangeStatus,
  onDelete,
}) {
  const [page, setPage] = useState(1);
  const [ps, setPs] = useState(defaultPageSize);
  const [edit, setEdit] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "approved" | "pending" | "rejected"

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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pageData.map((t) => {
            const meta = STATUS_META[t._status] || STATUS_META.pending;
            return (
              <Card
                key={t.id}
                className="rounded-2xl flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/30"
                bodyStyle={{ padding: 20, height: "100%" }}
              >
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-2">
                    {/* More Actions Dropdown */}
                    <Dropdown
                      menu={moreMenu(t)}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <Button
                        type="text"
                        size=""
                        icon={
                          <MoreOutlined className="text-gray-500 !text-xl" />
                        }
                        className="flex items-center justify-center rounded-lg h-8 w-8 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
                      />
                    </Dropdown>
                  </div>
                </div>

                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar
                      size={56}
                      style={{
                        background:
                          "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                      }}
                      icon={<UserCheck />}
                    >
                      {initials(t.name)}
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800 m-0 truncate">
                        {t.name}
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm m-0 mb-2 truncate">
                      {t.email}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>
                      <span className="text-xs font-medium text-purple-700">
                        Reviewing: {t.reviewSubject || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                {/* Assigned Teachers Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Assigned Teachers{" "}
                      {t.assignedTeachers?.length
                        ? `(${t.assignedTeachers.length})`
                        : ""}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {t.assignedTeachers?.length ? (
                      t.assignedTeachers.map((name, i) => (
                        <Tag
                          key={`${name}-${i}`}
                          className="rounded-xl px-3 py-2 text-xs border-0 flex items-center gap-2 transition-all duration-200 hover:scale-105 cursor-pointer"
                          style={{
                            backgroundColor: "#0F74901A",
                            color: PALETTE.primary,
                            border: "1px solid #0F749020",
                          }}
                        >
                          <Avatar
                            size={20}
                            style={{
                              background:
                                "linear-gradient(135deg, #0F7490 0%, #8B5CF6 100%)",
                              fontSize: 10,
                              boxShadow: "0 2px 4px rgba(15, 116, 144, 0.2)",
                            }}
                          >
                            {initials(name)}
                          </Avatar>
                          <span className="truncate max-w-[120px] font-medium">
                            {name}
                          </span>
                        </Tag>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span className="text-xs font-medium">
                          No teachers assigned
                        </span>
                      </div>
                    )}
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

      <EditRevModal
        open={edit}
        onCancel={() => setEdit(false)}
        reviewer={selectedTeacher}
        subjectOptions={subjects}
        teacherOptions={[]} // You should pass actual teacher options here
      />
    </ConfigProvider>
  );
}

export default RevCards;

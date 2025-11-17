"use client";

import {
  Avatar,
  Badge,
  Card,
  Tag,
  Tooltip,
  Typography,
  Space,
  Modal,
  Divider,
  Row,
  Col,
  message,
  Dropdown,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../layout/DataTable";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../atoms/Button";
import {
  EyeOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BookOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MoreOutlined,
  EditOutlined,
  SyncOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EditReviewerModal from "./EditRev.modal";

const { Text, Title } = Typography;

const STATUS_OPTIONS = [
  { value: "approved", label: "🟢 Approved" },
  { value: "pending", label: "🟡 Pending" },
  { value: "rejected", label: "🔴 Rejected" },
];

const toStatus = (s) => (s ?? "").toString().trim().toLowerCase();

const antdBadgeStatus = (status) => {
  switch (toStatus(status)) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

const statusIcon = (status) => {
  switch (toStatus(status)) {
    case "pending":
      return <ClockCircleOutlined />;
    case "approved":
      return <CheckCircleOutlined />;
    case "rejected":
      return <CloseCircleOutlined />;
    default:
      return null;
  }
};

const ReviewersTable = ({
  searchText,
  selectedStatus,
  data = [],
  selectedTeachers,
  onSelectionChange,
  loading = false,
  onView,
  onApprove,
  onReject,
  onChangeStatus,
  onDelete,
}) => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const router = useRouter();

  // Transform API -> table rows
  const transformTeacherData = (apiTeachers) =>
    (apiTeachers || []).map((t) => ({
      id: t.teacher_id || t.id,
      name: t.full_name || t.name,
      email: t.email,
      phone: t.phone,
      subjects: t.subjects || [],
      status: t.status,
      joinDate: t.join_date || t.joinDate,
      experience: t.experience || `${t.experience_years} years`,
      qualification: t.qualification,
      avatar: t?._original?.full_image_url || t.image_url || t.avatar,
      notes: t.notes,
      _original: t,
    }));

  const transformedData = useMemo(() => transformTeacherData(data), [data]);

  // Client-side filtering (search + status)
  const normalizedQuery = (searchText || "").trim().toLowerCase();
  const filteredRows = useMemo(() => {
    let rows = transformedData;

    if (selectedStatus && selectedStatus !== "all") {
      rows = rows.filter((r) => toStatus(r.status) === toStatus(selectedStatus));
    }

    if (normalizedQuery) {
      rows = rows.filter((r) =>
        [r.name, r.email, r.phone, r.qualification, ...(r.subjects || [])]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(normalizedQuery))
      );
    }

    return rows;
  }, [transformedData, selectedStatus, normalizedQuery]);

  const handleStatusChange = async (teacher, newStatus) => {
    setLocalLoading(true);
    try {
      if (onChangeStatus) {
        await onChangeStatus(teacher, newStatus);
      } else {
        message.success(`Teacher set to ${newStatus}`);
      }
    } catch (err) {
      message.error(`Failed to update status: ${err?.message || err}`);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setViewModalVisible(true);
    onView?.(teacher);
  };

  const getInitials = (name) =>
    (name || "NA")
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase();

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

  const moreMenu = (record) => ({
    items: [
      { key: "edit", icon: <EditOutlined />, label: "Edit" },
      {
        key: "status",
        icon: <SyncOutlined />,
        label: "Change Status",
        children: STATUS_OPTIONS.map((s) => ({
          key: `status:${s.value}`,
          label: s.label,
        })),
      },
      { key: "modules", icon: <BookOutlined />, label: "Modules" },
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
        setSelectedTeacher(record);
        return;
      }
      if (key === "modules") {
        router.push(`/teachers/${record.id}/modules`);
        return;
      }
      if (key.startsWith("status:")) {
        const newStatus = key.split(":")[1];
        handleStatusChange(record, newStatus);
        return;
      }
      if (key === "delete") {
        if (onDelete) {
          onDelete(record);
        } else {
          Modal.confirm({
            title: "Delete teacher?",
            content: `This will permanently remove ${record.name}.`,
            okType: "danger",
            onOk: () => message.success("Teacher deleted (demo)"),
          });
        }
      }
    },
  });

  const columns = [
    {
      title: "Reviewer",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center space-x-3">
          {record?._original?.full_image_url ? (
            <img
              src={record?._original?.full_image_url}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <Avatar
              size={48}
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
            >
              {getInitials(name)}
            </Avatar>
          )}

          <div>
            <Text className="text-gray-900 font-medium">{name}</Text>
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Mail className="mr-1 text-xs" />
              {record.email}
            </div>
            {record.qualification && (
              <div className="text-xs text-gray-400 mt-1">
                {record.qualification}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => <Text className="text-gray-700">{phone || "N/A"}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={antdBadgeStatus(status)}
          text={<span className="capitalize font-medium">{statusIcon(status)} {status}</span>}
        />
      ),
    },
    {
      title: "Experience",
      dataIndex: "experience",
      key: "experience",
      render: (experience) => (
        <div className="flex items-center text-gray-700">
          <TrophyOutlined className="mr-2 text-yellow-500" />
          <Text>{experience}</Text>
        </div>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (date) => (
        <div className="flex items-center text-gray-700">
          <CalendarOutlined className="mr-2 text-blue-500" />
          <Text>{formatDate(date)}</Text>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              className="bg-purple-600 !w-fit flex items-center justify-center hover:bg-purple-700 border-purple-600"
              onClick={() => handleViewTeacher(record)}
              loading={localLoading}
            />
          </Tooltip>

          {toStatus(record.status) !== "approved" && (
            <Button
              type="primary"
              size="small"
              className="bg-green-600 hover:bg-green-700 border-green-600"
              loading={localLoading}
              onClick={() =>
                onApprove ? onApprove(record) : handleStatusChange(record, "approved")
              }
            >
              Approve
            </Button>
          )}
          {toStatus(record.status) !== "rejected" && (
            <Button
              danger
              size="small"
              loading={localLoading}
              onClick={() =>
                onReject ? onReject(record) : handleStatusChange(record, "rejected")
              }
            >
              Reject
            </Button>
          )}

          {/* Quick Edit button (optional) */}
          <Tooltip title="Edit">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedTeacher(record);
                setEdit(true);
              }}
            />
          </Tooltip>

          {/* More dropdown */}
          <Dropdown trigger={["click"]} placement="bottomRight" menu={moreMenu(record)}>
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card className="shadow-lg border-0" loading={loading}>
        <DataTable
          searchable={false}
          table={{
            header: columns,
            rows: filteredRows,
            loading: loading,
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600">
                Showing {range[0]}-{range[1]} of {total} teachers
              </span>
            ),
          }}
        />
      </Card>

      {/* View Modal inside table (optional duplicate of page-level) */}
      <Modal
        title={<div className="text-xl font-semibold text-gray-800">Reviewer Details</div>}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
        className="teacher-modal"
      >
        {selectedTeacher && (
          <div className="py-6">
            <div className="text-center mb-8">
              {selectedTeacher.avatar ? (
                <img
                  src={selectedTeacher.avatar}
                  alt={selectedTeacher.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <Avatar
                  size={100}
                  className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-2xl mb-4 mx-auto"
                >
                  {getInitials(selectedTeacher.name)}
                </Avatar>
              )}
              <Title level={2} className="mb-2">
                {selectedTeacher.name}
              </Title>
              <Badge
                status={antdBadgeStatus(selectedTeacher.status)}
                text={
                  <span className="capitalize font-medium text-lg">
                    {statusIcon(selectedTeacher.status)} {selectedTeacher.status}
                  </span>
                }
              />
            </div>

            <Divider />

            <Row gutter={[24, 24]} className="mb-8">
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <BookOutlined className="mr-2 text-yellow-600" />
                    Subjects
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.subjects?.map((s, i) => (
                      <Tag
                        key={i}
                        className="px-3 py-1 text-sm"
                        style={{ backgroundColor: "#C9AE6C", color: "white", border: "none" }}
                      >
                        {s}
                      </Tag>
                    ))}
                    {(!selectedTeacher.subjects || selectedTeacher.subjects.length === 0) && (
                      <Text type="secondary">No subjects assigned</Text>
                    )}
                  </div>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-yellow-600" />
                    Experience
                  </Text>
                  <Text className="text-lg">{selectedTeacher.experience}</Text>
                </div>
              </Col>

              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <MailOutlined className="mr-2 text-blue-600" />
                    Email
                  </Text>
                  <Text className="text-sm text-blue-600">{selectedTeacher.email}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <PhoneOutlined className="mr-2 text-green-600" />
                    Phone
                  </Text>
                  <Text>{selectedTeacher.phone || "N/A"}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <CalendarOutlined className="mr-2 text-purple-600" />
                    Join Date
                  </Text>
                  <Text>{formatDate(selectedTeacher.joinDate)}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Text strong className="text-gray-700 flex items-center mb-2">
                    <TrophyOutlined className="mr-2 text-indigo-600" />
                    Qualification
                  </Text>
                  <Text>{selectedTeacher.qualification || "N/A"}</Text>
                </div>
              </Col>
            </Row>

            <div className="text-center space-x-4">
              {toStatus(selectedTeacher.status) !== "approved" && (
                <Button
                  type="primary"
                  size="large"
                  className="bg-green-600 hover:bg-green-700 border-green-600 px-8"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedTeacher, "approved");
                    setViewModalVisible(false);
                  }}
                  loading={localLoading}
                >
                  Approve Teacher
                </Button>
              )}
              {toStatus(selectedTeacher.status) !== "rejected" && (
                <Button
                  danger
                  size="large"
                  className="px-8"
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    handleStatusChange(selectedTeacher, "rejected");
                    setViewModalVisible(false);
                  }}
                  loading={localLoading}
                >
                  Reject Teacher
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ✅ EDIT MODAL wired with correct prop name: reviewer */}
      <EditReviewerModal
        open={edit}
        onCancel={() => setEdit(false)}
        reviewer={selectedTeacher}
        onSuccess={() => setEdit(false)}
      />
    </>
  );
};

export default ReviewersTable;

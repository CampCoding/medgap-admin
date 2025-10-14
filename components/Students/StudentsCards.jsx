"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Badge,
  Avatar,
  Tooltip,
  Button,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  List,
  Skeleton,
} from "antd";
import {
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  IdcardOutlined,
  PlusCircleOutlined,
  AppstoreOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { handleGetAllModules, handleGetModuleStudents } from "@/features/modulesSlice";

/** helpers */
const getGradeColor = (grade) => {
  if (grade?.startsWith("12")) return "#8B5CF6";
  if (grade?.startsWith("11")) return "#0F766E";
  if (grade?.startsWith("10")) return "#D4A73C";
  return "#64748B";
};
const getStatusAnt = (s) =>
  s === "active" ? "success" : s === "inactive" ? "default" : "warning";
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ADD_MODULES_ENDPOINT = "https://medgap.camp-coding.site/api/student/auth/modules";
const DELETE_MODULE_ENDPOINT = (moduleId) =>
  `https://medgap.camp-coding.site/api/student/auth/modules/${moduleId}`;

export default function StudentsCards({
  students = [],
  loading = false,
  id,
  onView = () => {},
  onChangeStatus = () => {},
  /** optional: parent refresh after add/delete */
  onModulesUpdated = () => {},
}) {
  const dispatch = useDispatch();

  // Add Modules modal
  const [openModuleModal, setOpenModuleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null); // drives both modals
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  // View/Delete Modules modal
  const [openViewModules, setOpenViewModules] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Modules catalog (for labels)
  const { list_module_data } = useSelector((state) => state?.modules || {});
  const modulesArr = useMemo(
    () => list_module_data?.data?.modules || list_module_data?.modules || [],
    [list_module_data]
  );
  const moduleOptions = useMemo(
    () =>
      modulesArr.map((m) => ({
        label: `${m.subject_name || m.name || `Module ${m.module_id || m.id}`}${
          m.subject_code || m.code ? ` • ${m.subject_code || m.code}` : ""
        }`,
        value: m.module_id ?? m.id,
        raw: m,
      })),
    [modulesArr]
  );

  useEffect(() => {
    dispatch(handleGetAllModules());
  }, [dispatch]);

  /** helper: build minimal module object from catalog by id (for modal list) */
  const toModuleObj = (id) => {
    const m = modulesArr.find((x) => (x.module_id ?? x.id) === id);
    if (!m) return { module_id: id, subject_name: `Module ${id}` };
    return {
      module_id: m.module_id ?? m.id,
      subject_name: m.subject_name || m.name || `Module ${id}`,
      subject_code: m.subject_code || m.code,
    };
  };

  // ---------- Add Modules flow ----------
  const openAddModuleModal = (student) => {
    setSelectedStudent(student);
    form.resetFields();
    setOpenModuleModal(true);
  };

  const handleSubmitModules = async (values) => {
    if (!selectedStudent?.id) {
      message.error("Missing student id");
      return;
    }
    const payload = {
      modules: values.modules || [],
      student_id: Number(selectedStudent.id),
    };
    if (!payload.modules.length) {
      message.warning("Please select at least one module");
      return;
    }

    setSaving(true);
    try {
      const { data } = await axios.post(ADD_MODULES_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (data?.status === "success" || data?.message) {
        dispatch(handleGetModuleStudents({ id}))
        message.success(data?.message || "Modules added successfully");
        setOpenModuleModal(false);

        // Immediate UI update in the modules modal (no refresh needed)
        const addedObjs = payload.modules.map(toModuleObj);
        setSelectedStudent((prev) => {
          if (!prev) return prev;
          const prevList = Array.isArray(prev.modules) ? prev.modules : [];
          // dedupe by module_id
          const ids = new Set(prevList.map((m) => m.module_id ?? m.id));
          const merged = [...prevList];
          for (const m of addedObjs) {
            const id = m.module_id ?? m.id;
            if (!ids.has(id)) {
              merged.push(m);
              ids.add(id);
            }
          }
          return { ...prev, modules: merged };
        });

        onModulesUpdated(selectedStudent, { type: "add", modules: payload.modules });
      } else {
        message.error(data?.message || "Failed to add modules");
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to add modules";
      message.error(apiMsg);
    } finally {
      setSaving(false);
    }
  };

  // ---------- View/Delete Modules flow ----------
  const openStudentModules = (student) => {
    setSelectedStudent(student);
    setOpenViewModules(true);
  };

  const handleDeleteModule = async (moduleId) => {
    if (!selectedStudent?.id) {
      message.error("Missing student id");
      return;
    }
    setDeletingId(moduleId);
    try {
      const { data } = await axios.delete(DELETE_MODULE_ENDPOINT(moduleId), {
        headers: { "Content-Type": "application/json" },
        // axios DELETE body => pass via { data: ... }
        data: { student_id: Number(selectedStudent.id) },
      });
      if (data?.status === "success" || data?.message) {
        message.success(data?.message || "Module removed");

        // Immediate UI update in the modules modal
        setSelectedStudent((prev) => {
          if (!prev) return prev;
          const filtered = (prev.modules || []).filter(
            (m) => (m.module_id ?? m.id) !== moduleId
          );
          return { ...prev, modules: filtered };
        });

        onModulesUpdated(selectedStudent, { type: "delete", moduleId });
      } else {
        message.error(data?.message || "Failed to remove module");
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to remove module";
      message.error(apiMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const renderModulesList = (stu) => {
    const list = Array.isArray(stu?.modules) ? stu.modules : [];
    if (!list.length) {
      return <div className="text-gray-500 text-sm">No modules assigned.</div>;
    }
    return (
      <List
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(m) => {
          const id = m.module_id ?? m.id;
          return (
            <List.Item
              actions={[
                <Popconfirm
                  key="del"
                  title="Remove this module?"
                  okText="Remove"
                  cancelText="Cancel"
                  okButtonProps={{ className: "!bg-blue-500 !text-white" }}
                  onConfirm={() => handleDeleteModule(id)}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    loading={deletingId === id}
                  >
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span className="font-medium">
                    {m.subject_name || m.name || `Module ${id}`}
                  </span>
                }
                description={
                  <span className="text-gray-500">
                    {(m.subject_code || m.code) && `Code: ${m.subject_code || m.code}`}
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <div className="p-3">
      <Row gutter={[16, 16]}>
        {students.map((s) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={s.id}>
            <Card
              loading={loading}
              className="shadow-md border-0 rounded-2xl"
              bodyStyle={{ padding: 16 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  size={48}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
                >
                  {getInitials(s.name)}
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 truncate">{s.name}</span>
                    <Badge status={getStatusAnt(s.status)} />
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <IdcardOutlined />
                    {s.id}
                  </div>
                </div>
              </div>

              {/* Grade */}
              <div className="flex items-center justify-between mb-3">
                {s.grade && (
                  <Tag
                    className="px-3 py-1 text-xs font-medium border-0"
                    style={{ backgroundColor: getGradeColor(s.grade), color: "#fff" }}
                  >
                    {s.grade}
                  </Tag>
                )}
              </div>

              {/* Contact */}
              <div className="space-y-1 mb-3">
                {s.email && (
                  <div className="text-sm text-blue-600 flex items-center">
                    <MailOutlined className="mr-2 text-xs" />
                    <span className="truncate">{s.email}</span>
                  </div>
                )}
                {s.phone && (
                  <div className="text-sm text-gray-600 flex items-center">
                    <PhoneOutlined className="mr-2 text-xs" /> {s.phone}
                  </div>
                )}
              </div>

              {/* Enrolled */}
              {s.enrolledAt && (
                <div className="flex items-center text-gray-700 text-sm mb-4">
                  <CalendarOutlined className="mr-2 text-blue-500" />
                  {new Date(s.enrolledAt).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2">
                <Tooltip title="View Details">
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600"
                    onClick={() => onView(s)}
                  />
                </Tooltip>

                <Tooltip title="Show student's modules">
                  <Button icon={<AppstoreOutlined />} onClick={() => openStudentModules(s)}>
                    Modules
                  </Button>
                </Tooltip>

                <Button icon={<PlusCircleOutlined />} onClick={() => openAddModuleModal(s)}>
                  Add
                </Button>
              </div>

              {/* Status actions */}
              <div className="flex items-center gap-2 mt-2">
                {s.status !== "blocked" ? (
                  <Button
                    danger
                    icon={<LockOutlined />}
                    className="!flex-1"
                    onClick={() => onChangeStatus(s.id, "blocked")}
                  >
                    Block
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<UnlockOutlined />}
                    className="bg-green-600 hover:bg-green-700 border-green-600 !flex-1"
                    onClick={() => onChangeStatus(s.id, "active")}
                  >
                    Unblock
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Modules Modal */}
      <Modal
        open={openModuleModal}
        onCancel={() => setOpenModuleModal(false)}
        title={`Add Modules${selectedStudent?.name ? ` to ${selectedStudent.name}` : ""}`}
        okText={saving ? "Saving..." : "Add Modules"}
        okButtonProps={{
          className: "!bg-blue-500 !text-white",
          loading: saving,
          htmlType: "submit",
          form: "add-modules-form",
        }}
        destroyOnClose
      >
        <Form
          id="add-modules-form"
          layout="vertical"
          form={form}
          onFinish={handleSubmitModules}
          initialValues={{ modules: [] }}
        >
          <Form.Item
            label="Modules"
            name="modules"
            tooltip="Select one or more modules to enroll the student in."
            rules={[
              { required: true, message: "Please select at least one module" },
              {
                validator: (_, v) =>
                  Array.isArray(v) && v.length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Select at least one module")),
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder={modulesArr.length ? "Select modules…" : "Loading modules…"}
              options={moduleOptions}
              optionFilterProp="label"
              maxTagCount="responsive"
              disabled={!modulesArr.length}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View/Delete Modules Modal */}
      <Modal
        open={openViewModules}
        onCancel={() => setOpenViewModules(false)}
        title={selectedStudent?.name ? `Modules of ${selectedStudent.name}` : "Student Modules"}
        footer={null}
        destroyOnClose
      >
        {!selectedStudent ? <Skeleton active /> : renderModulesList(selectedStudent)}
      </Modal>
    </div>
  );
}

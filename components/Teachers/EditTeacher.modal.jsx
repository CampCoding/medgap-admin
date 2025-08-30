"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Switch,
  ConfigProvider,
  message,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  InboxOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const toISO = (d) =>
  d ? (typeof d.toDate === "function" ? d.toDate().toISOString() : d.toISOString?.()) : null;

const fromISO = (iso) => (iso ? dayjs(iso) : null);

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

/**
 * Props:
 * open: boolean
 * onCancel: () => void
 * onSubmit: (payload) => Promise|void
 * onDelete?: (teacher) => Promise|void
 * subjectOptions: [{ id?, name, code? }...]
 * teacher: {
 *   id, fullName, email, phone, role, status,
 *   experienceYears, joinDate (ISO), subjects: [ids or labels],
 *   notes, avatar (url/base64)
 * }
 */
function EditTeacherModal({
  open,
  onCancel,
  onSubmit,
  onDelete,
  subjectOptions = [],
  teacher,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const normalizedSubjects = useMemo(
    () =>
      subjectOptions.map((s) => ({
        label: s.code ? `${s.name} (${s.code})` : s.name,
        value: String(s.id ?? s.value ?? s.code ?? s.name),
      })),
    [subjectOptions]
  );

  // Load teacher into form when it changes
  useEffect(() => {
    if (!teacher) return;
    form.setFieldsValue({
      fullName: teacher.fullName || teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      role: teacher.role || "Teacher",
      status: teacher.status || "Pending",
      experienceYears: teacher.experienceYears ?? 0,
      joinDate: fromISO(teacher.joinDate),
      subjects: (teacher.subjects || []).map((v) => String(v)),
      notes: teacher.notes || "",
      sendInvite: false,
    });
    setAvatarPreview(teacher.avatar || null);
  }, [teacher, form]);

  const handleFinish = async (values) => {
    const payload = {
      id: teacher?.id,
      ...values,
      joinDate: toISO(values.joinDate),
      avatar: avatarPreview, // swap with upload result if you upload to server
    };

    try {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        // eslint-disable-next-line no-console
        console.log("Edit teacher payload:", payload);
      }
      message.success("Teacher updated successfully");
      onCancel && onCancel();
    } catch (e) {
      message.error("Failed to update teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !teacher) return;
    setLoading(true);
    try {
      await onDelete(teacher);
      message.success("Teacher deleted");
      onCancel && onCancel();
    } catch (e) {
      message.error("Failed to delete teacher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: PALETTE.primary,
          borderRadius: 14,
          colorText: PALETTE.text,
          controlHeight: 44,
        },
      }}
    >
      <Modal
        title={null}
        open={open}
        onCancel={() => {
          form.resetFields();
          setAvatarPreview(teacher?.avatar || null);
          onCancel && onCancel();
        }}
        footer={null}
        className="!w-full max-w-5xl"
      >
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <SaveOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Edit Teacher</h2>
            </div>
            <p className="text-gray-600">Update teacher profile and assignments.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* LEFT */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" />
                    Basic Information
                  </h3>

                  <Form.Item
                    label={<span className="text-text font-medium">Full Name *</span>}
                    name="fullName"
                    rules={[
                      { required: true, message: "Please enter full name" },
                      {
                        validator: (_, v) =>
                          !v || v.trim().length >= 2
                            ? Promise.resolve()
                            : Promise.reject(new Error("Name must be at least 2 characters")),
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Ahmed Hassan"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-text font-medium">Email *</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Please enter email" },
                      { type: "email", message: "Enter a valid email address" },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className="text-gray-400 mr-2" />}
                      placeholder="name@school.edu"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-text font-medium">Phone</span>}
                    name="phone"
                    rules={[
                      {
                        pattern: /^[0-9+\-\s]{7,}$/,
                        message: "Enter a valid phone number",
                      },
                    ]}
                  >
                    <Input
                      placeholder="+20 1X XXX XXXX"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item label={<span className="text-text font-medium">Notes</span>} name="notes">
                    <TextArea
                      rows={3}
                      placeholder="Short bio or internal notes…"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>
                </div>

                {/* Professional */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Professional Details
                  </h3>

                  <Form.Item
                    label={<span className="text-text font-medium">Modules *</span>}
                    name="subjects"
                    rules={[{ required: true, message: "Select at least one subject" }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select subjects"
                      options={normalizedSubjects}
                      className="rounded-lg"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Experience (years)" name="experienceYears">
                      <InputNumber min={0} max={60} className="w-full" />
                    </Form.Item>

                    <Form.Item label="Join Date" name="joinDate" rules={[{ required: true }]}>
                      <DatePicker className="w-full rounded-lg" />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Role" name="role">
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "Teacher", value: "Teacher" },
                          { label: "Head of Department", value: "Head of Department" },
                          { label: "Assistant", value: "Assistant" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "🟢 Approved", value: "Approved" },
                          { label: "🟡 Pending", value: "Pending" },
                          { label: "🔴 Rejected", value: "Rejected" },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <Form.Item name="sendInvite" valuePropName="checked" className="!mb-0">
                      <Switch />
                    </Form.Item>
                    <span className="text-text">Re-send invite email</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Avatar */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4">Avatar & Preview</h3>

                  <Dragger
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => setAvatarPreview(e.target.result);
                      reader.readAsDataURL(file);
                      return false; // prevent auto upload
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag image to upload</p>
                    <p className="ant-upload-hint">PNG/JPG up to ~2MB.</p>
                  </Dragger>

                  <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            background:
                              "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                          }}
                        >
                          {(initials(form.getFieldValue("fullName")) ||
                            initials(teacher?.fullName || teacher?.name || "NA"))
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="text-text font-semibold">
                          {form.getFieldValue("fullName") ||
                            teacher?.fullName ||
                            teacher?.name ||
                            "Teacher Name"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {form.getFieldValue("email") || teacher?.email || "name@school.edu"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={() => setAvatarPreview(null)}
                        className="rounded-lg"
                      >
                        Remove Avatar
                      </Button>
                      {teacher?.avatar && !avatarPreview && (
                        <Button
                          onClick={() => setAvatarPreview(teacher.avatar)}
                          className="rounded-lg"
                        >
                          Restore Current
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick summary */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <SettingOutlined className="text-primary" />
                    Quick Summary
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      Role:{" "}
                      <span className="font-medium">{form.getFieldValue("role") || teacher?.role || "—"}</span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">
                        {form.getFieldValue("status") || teacher?.status || "—"}
                      </span>
                    </p>
                    <p>
                    Modules:{" "}
                      <span className="font-medium">
                        {(form.getFieldValue("subjects") || teacher?.subjects || []).length} selected
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-between gap-4">
                  <div>
                    {onDelete && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        loading={loading}
                        className="rounded-lg"
                      >
                        Delete
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        form.resetFields();
                        setAvatarPreview(teacher?.avatar || null);
                        onCancel && onCancel();
                      }}
                      className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                      className="px-8 py-3 bg-primary text-white rounded-lg hover:!bg-[#0d5f75]"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default EditTeacherModal;

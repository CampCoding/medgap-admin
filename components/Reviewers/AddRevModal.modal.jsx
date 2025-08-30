"use client";

import React, { useMemo, useState } from "react";
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
  PlusOutlined,
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
  d
    ? typeof d.toDate === "function"
      ? d.toDate().toISOString()
      : d.toISOString?.()
    : null;

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

function AddRevModal({ open, onCancel, onSubmit, subjectOptions = [], teacherOptions = [] }) {
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

  const normalizedTeachers = useMemo(
    () =>
      teacherOptions.map((t) => ({
        label: t.name,
        value: String(t.id ?? t.name),
      })),
    [teacherOptions]
  );

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      avatar: avatarPreview, // replace with server URL if you actually upload
    };

    try {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 700));
        // eslint-disable-next-line no-console
        console.log("New reviewer payload:", payload);
      }
      message.success("Reviewer created successfully");
      form.resetFields();
      setAvatarPreview(null);
      onCancel && onCancel();
    } catch (e) {
      message.error("Failed to create reviewer. Please try again.");
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
          setAvatarPreview(null);
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
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Add New Reviewer</h2>
            </div>
            <p className="text-gray-600">
              Create a reviewer profile and assign subject and teachers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                name: "",
                email: "",
                reviewSubject: "",
                assignedTeachers: [],
                status: "Pending",
                sendInvite: true,
              }}
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
                    label={
                      <span className="text-text font-medium">Name *</span>
                    }
                    name="name"
                    rules={[
                      { required: true, message: "Please enter name" },
                      {
                        validator: (_, v) =>
                          !v || v.trim().length >= 2
                            ? Promise.resolve()
                            : Promise.reject(
                                new Error("Name must be at least 2 characters")
                              ),
                      },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Ahmed Hassan"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-text font-medium">Email *</span>
                    }
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

                 
                </div>

                {/* Professional */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Review Assignment
                  </h3>

                  <Form.Item
                    label={
                      <span className="text-text font-medium">Review Subject *</span>
                    }
                    name="reviewSubject"
                    rules={[
                      {
                        required: true,
                        message: "Please select a subject to review",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select subject to review"
                      options={normalizedSubjects}
                      className="rounded-lg"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-text font-medium">Assigned Teachers *</span>
                    }
                    name="assignedTeachers"
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one teacher to assign",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select teachers to assign"
                      options={normalizedTeachers}
                      className="rounded-lg"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true }]}
                  >
                    <Select
                      className="rounded-lg"
                      options={[
                        { label: "🟢 Approved", value: "Approved" },
                        { label: "🟡 Pending", value: "Pending" },
                        { label: "🔴 Rejected", value: "Rejected" },
                      ]}
                    />
                  </Form.Item>

                  <div className="flex items-center gap-3 mt-1">
                    <Form.Item
                      name="sendInvite"
                      valuePropName="checked"
                      className="!mb-0"
                    >
                      <Switch />
                    </Form.Item>
                    <span className="text-text">Send invite email</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                {/* Avatar */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4">
                    Avatar & Preview
                  </h3>

                  <Dragger
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => setAvatarPreview(e.target.result);
                      reader.readAsDataURL(file);
                      return false; // prevent auto upload; send on submit instead
                    }}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag image to upload
                    </p>
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
                          {(initials(form.getFieldValue("name")) || "NA")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="text-text font-semibold">
                          {form.getFieldValue("name") || "Reviewer Name"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {form.getFieldValue("email") || "name@school.edu"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings summary */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <SettingOutlined className="text-primary" />
                    Quick Settings
                  </h3>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      Subject:{" "}
                      <span className="font-medium">
                        {form.getFieldValue("reviewSubject") || "—"}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">
                        {form.getFieldValue("status") || "—"}
                      </span>
                    </p>
                    <p>
                      Teachers:{" "}
                      <span className="font-medium">
                        {(form.getFieldValue("assignedTeachers") || []).length} selected
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setAvatarPreview(null);
                    }}
                    className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:!bg-[#0d5f75]"
                    icon={!loading ? <PlusOutlined /> : undefined}
                  >
                    {loading ? "Adding..." : "Add Reviewer"}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default AddRevModal;

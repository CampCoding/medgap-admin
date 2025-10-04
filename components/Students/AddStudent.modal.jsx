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
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  IdcardOutlined,
  HomeOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
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

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

/**
 * Props:
 * open, onCancel, onSubmit
 * gradeOptions: [{label, value}], classOptions: [{label, value}]
 * subjectOptions: [{ id?, name, code? }...]
 * defaults: { gradeValue?, classValue? }
 */
function AddStudentModal({
  open,
  onCancel,
  onSubmit,
  gradeOptions = [],
  classOptions = [],
  subjectOptions = [],
  defaults = {},
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [age, setAge] = useState(null);

  const normalizedSubjects = useMemo(
    () =>
      subjectOptions.map((s) => ({
        label: s.code ? `${s.name} (${s.code})` : s.name,
        value: String(s.id ?? s.value ?? s.code ?? s.name),
      })),
    [subjectOptions]
  );

  const handleDobChange = (d) => {
    if (!d) return setAge(null);
    const dt = typeof d.toDate === "function" ? d.toDate() : new Date(d);
    const diff = Date.now() - dt.getTime();
    const yrs = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    setAge(yrs);
  };

  const handleFinish = async (values) => {
    const payload = {
      ...values,
      dob: toISO(values.dob),
      enrollmentDate: toISO(values.enrollmentDate),
      photo: photoPreview, // replace with server URL if you upload
    };

    try {
      setLoading(true);
      if (typeof onSubmit === "function") {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 800));
        // eslint-disable-next-line no-console
        console.log("New student payload:", payload);
      }
      message.success("Student created successfully");
      form.resetFields();
      setPhotoPreview(null);
      setAge(null);
      onCancel && onCancel();
    } catch (e) {
      message.error("Failed to create student. Please try again.");
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
          setPhotoPreview(null);
          setAge(null);
          onCancel && onCancel();
        }}
        footer={null}
        className="!w-full max-w-6xl"
      >
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Add New Student</h2>
            </div>
            <p className="text-gray-600">Create a student profile and assign class & subjects.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                fullName: "",
                studentId: "",
                email: "",
                phone: "",
                gender: "Male",
                status: "Active",
                grade: defaults.gradeValue,
                classSection: defaults.classValue,
                subjects: [],
                enrollmentDate: null,
                dob: null,
                transport: "None",
                guardianName: "",
                guardianPhone: "",
                guardianEmail: "",
                emergencyName: "",
                emergencyPhone: "",
                address: "",
                notes: "",
                sendInvite: false,
              }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* LEFT COLUMN */}
              <div className="space-y-6 xl:col-span-2">
                {/* Student Info */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" />
                    Student Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="e.g., Ali Mohamed"
                        className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="text-text font-medium">Student ID *</span>}
                      name="studentId"
                      rules={[
                        { required: true, message: "Please enter student ID" },
                        {
                          pattern: /^[A-Za-z0-9\-_.]{3,}$/,
                          message: "At least 3 characters (letters/numbers/-_/.)",
                        },
                      ]}
                    >
                      <Input
                        prefix={<IdcardOutlined className="text-gray-400 mr-2" />}
                        placeholder="e.g., STU-2024-015"
                        className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ type: "email", message: "Enter a valid email" }]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-gray-400 mr-2" />}
                        placeholder="student@school.edu"
                        className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        { pattern: /^[0-9+\-\s]{7,}$/, message: "Enter a valid phone number" },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                        placeholder="+20 1X XXX XXXX"
                        className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                      />
                    </Form.Item>

                    <Form.Item label="Gender" name="gender">
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "Male", value: "Male" },
                          { label: "Female", value: "Female" },
                          { label: "Other", value: "Other" },
                        ]}
                      />
                    </Form.Item>

                    <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "🟢 Active", value: "Active" },
                          { label: "🟡 Pending", value: "Pending" },
                          { label: "🟠 Suspended", value: "Suspended" },
                          { label: "🔴 Inactive", value: "Inactive" },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item label="Date of Birth" name="dob" rules={[{ required: true }]}>
                      <DatePicker className="w-full rounded-lg" onChange={handleDobChange} />
                    </Form.Item>
                    <Form.Item label="Age">
                      <InputNumber disabled value={age ?? ""} className="w-full" />
                    </Form.Item>
                    <Form.Item label="Enrollment Date" name="enrollmentDate" rules={[{ required: true }]}>
                      <DatePicker className="w-full rounded-lg" suffixIcon={<CalendarOutlined />} />
                    </Form.Item>
                  </div>
                </div>

                {/* Academic */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Academic Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item label="Grade *" name="grade" rules={[{ required: true }]}>
                      <Select className="rounded-lg" options={gradeOptions} placeholder="Select grade" />
                    </Form.Item>

                    <Form.Item label="Class / Section *" name="classSection" rules={[{ required: true }]}>
                      <Select className="rounded-lg" options={classOptions} placeholder="Select class" />
                    </Form.Item>

                    <Form.Item label="Transport" name="transport">
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "None", value: "None" },
                          { label: "School Bus - Route A", value: "Bus A" },
                          { label: "School Bus - Route B", value: "Bus B" },
                          { label: "Private", value: "Private" },
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label="Modules" name="subjects">
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
                </div>

                {/* Address & Notes */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <HomeOutlined className="text-primary" />
                    Address & Notes
                  </h3>

                  <Form.Item label="Address" name="address">
                    <TextArea
                      rows={3}
                      placeholder="Street, City, Governorate, Country"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>

                  <Form.Item label="Medical / Allergies / Notes" name="notes">
                    <TextArea
                      rows={3}
                      placeholder="Any important notes to keep in mind…"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Photo & Preview */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4">Photo & Preview</h3>

                  <Dragger
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => setPhotoPreview(e.target.result);
                      reader.readAsDataURL(file);
                      return false; // prevent auto upload; upload on submit if needed
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
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="student"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{
                            background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                          }}
                        >
                          {(initials(form.getFieldValue("fullName")) || "ST")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="text-text font-semibold">
                          {form.getFieldValue("fullName") || "Student Name"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {form.getFieldValue("studentId") || "ID —"}
                        </p>
                      </div>
                    </div>
                    {photoPreview && (
                      <div className="mt-3">
                        <Button onClick={() => setPhotoPreview(null)} className="rounded-lg">
                          Remove Photo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Guardians */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <TeamOutlined className="text-primary" />
                    Guardian & Emergency
                  </h3>

                  <Form.Item label="Guardian Name" name="guardianName">
                    <Input
                      placeholder="Parent/Guardian full name"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Guardian Phone" name="guardianPhone" rules={[
                      { pattern: /^[0-9+\-\s]{7,}$/, message: "Enter a valid phone number" },
                    ]}>
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                        placeholder="+20 1X XXX XXXX"
                        className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                      />
                    </Form.Item>

                    <Form.Item label="Guardian Email" name="guardianEmail" rules={[{ type: "email" }]}>
                      <Input
                        prefix={<MailOutlined className="text-gray-400 mr-2" />}
                        placeholder="guardian@email.com"
                        className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label="Emergency Contact Name" name="emergencyName">
                    <Input
                      placeholder="Emergency contact"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item label="Emergency Phone" name="emergencyPhone" rules={[
                    { pattern: /^[0-9+\-\s]{7,}$/, message: "Enter a valid phone number" },
                  ]}>
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400 mr-2" />}
                      placeholder="+20 1X XXX XXXX"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <div className="flex items-center gap-3">
                    <Form.Item name="sendInvite" valuePropName="checked" className="!mb-0">
                      <Switch />
                    </Form.Item>
                    <span className="text-text">Send portal invite to guardian email</span>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <CalendarOutlined className="text-primary" />
                    Summary
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      Grade / Class:{" "}
                      <span className="font-medium">
                        {form.getFieldValue("grade") || "—"} / {form.getFieldValue("classSection") || "—"}
                      </span>
                    </p>
                    <p>
                    Modules:{" "}
                      <span className="font-medium">
                        {(form.getFieldValue("subjects") || []).length} selected
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      <span className="font-medium">{form.getFieldValue("status") || "—"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="xl:col-span-3 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={() => {
                      form.resetFields();
                      setPhotoPreview(null);
                      setAge(null);
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
                    icon={<PlusOutlined />}
                  >
                    {loading ? "Adding..." : "Add Student"}
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

export default AddStudentModal;

// components/Reviewers/EditReviewer.modal.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal, Form, Input, Select, InputNumber, Button, ConfigProvider, Upload, message
} from "antd";
import {
  SaveOutlined, UserOutlined, BookOutlined, MailOutlined,
  TrophyOutlined, EyeInvisibleOutlined, EyeTwoTone, UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleGetListModulesAvailable } from "../../features/modulesSlice";
import { handleEditReviewer, handleGetAllReviewers } from "../../features/reviewersSlice";
import { toast } from "react-toastify";

const { TextArea } = Input;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
  background: "#F9FAFC",
  text: "#202938",
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || "").join("");

// helpers
const getExperienceYears = (row) => {
  if (!row) return 1;
  if (row._original?.experience_years != null) return row._original.experience_years;
  if (typeof row.experience === "number") return row.experience;
  if (typeof row.experience === "string") {
    const m = row.experience.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 1;
  }
  return 1;
};
const getAvatarUrl = (row) =>
  row?._original?.full_image_url || row?.avatar || row?.full_image_url || null;

const getModuleIds = (row) => {
  if (!row) return [];
  if (row._original?.active_modules?.length) {
    return row._original.active_modules.map((m) => m.module_id);
  }
  return Array.isArray(row.subjects) ? row.subjects : [];
};

function EditReviewerModal({ open, onCancel, reviewer, subjectOptions = [], onSuccess }) {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const dispatch = useDispatch();
  const { list_module_available } = useSelector((s) => s.modules);
  const { edit_reviewer_loading } = useSelector((s) => s.reviwers); // keep your slice key

  useEffect(() => {
    dispatch(handleGetListModulesAvailable());
  }, [dispatch]);

  const normalizedSubjects = useMemo(
    () =>
      list_module_available?.data?.modules?.map((m) => ({
        label: m.subject_name,
        value: m.module_id, // keep numeric
      })) || [],
    [list_module_available]
  );

  const passwordRules = [{ min: 6, message: "Password must be at least 6 characters" }];
  const confirmPasswordRules = [
    ({ getFieldValue }) => ({
      validator(_, v) {
        if (!v || getFieldValue("password") === v) return Promise.resolve();
        return Promise.reject(new Error("The two passwords do not match!"));
      },
    }),
  ];

  useEffect(() => {
    if (!reviewer) return;
    const experienceYears = getExperienceYears(reviewer);
    const avatarUrl = getAvatarUrl(reviewer);
    const moduleIds = getModuleIds(reviewer);

    form.setFieldsValue({
      fullName: reviewer._original?.full_name || reviewer.name || "",
      email: reviewer.email || "",
      phone: reviewer.phone || "",
      qualification: reviewer.qualification || "",
      notes: reviewer.notes || "",
      accountStatus: reviewer._original?.status || "active",
      role: "reviewer",
      experienceYears,
      subjects: moduleIds,
    });
    setAvatarPreview(avatarUrl);
  }, [reviewer, form]);

  const handleAvatarChange = (info) => {
    const file = info.file?.originFileObj || info.file;
    if (!file) return;
    if (!file.type?.startsWith("image/")) return message.error("Only image files are allowed");
    if (file.size / 1024 / 1024 >= 2) return message.error("Image must be smaller than 2MB");
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
    setAvatarFile(file);
  };

  const uploadProps = { beforeUpload: () => false, onChange: handleAvatarChange, showUploadList: false, accept: "image/*" };

  const togglePasswordFields = () => {
    setShowPasswordFields((p) => !p);
    if (showPasswordFields) {
      form.setFieldsValue({ password: "", confirmPassword: "" });
    }
  };

  const resetFormToRow = () => {
    if (!reviewer) return;
    const experienceYears = getExperienceYears(reviewer);
    const avatarUrl = getAvatarUrl(reviewer);
    const moduleIds = getModuleIds(reviewer);
    form.setFieldsValue({
      fullName: reviewer._original?.full_name || reviewer.name || "",
      email: reviewer.email || "",
      phone: reviewer.phone || "",
      qualification: reviewer.qualification || "",
      notes: reviewer.notes || "",
      accountStatus: reviewer._original?.status || "active",
      role: "reviewer",
      experienceYears,
      subjects: moduleIds,
    });
    setAvatarPreview(avatarUrl);
    setAvatarFile(null);
    setShowPasswordFields(false);
  };

  const handleCancel = () => {
    resetFormToRow();
    onCancel?.();
  };

  const handleFinish = async (values) => {
    if (!reviewer) {
      toast.error("No reviewer data available");
      return;
    }
    try {
      await form.validateFields();
      const fd = new FormData();
      fd.append("full_name", values.fullName);
      fd.append("email", values.email);
      fd.append("phone", values.phone || "");
      fd.append("notes", values.notes || "");
      fd.append("experience_years", values.experienceYears);
      fd.append("qualification", values.qualification || "");
      fd.append("role", "reviewer"); // enforce
      fd.append("status", values.accountStatus || "active");
      (values.subjects || []).forEach((id) => fd.append("module_ids[]", id));
      if (values.password) fd.append("password", values.password);
      if (avatarFile) fd.append("image", avatarFile);

      const id = reviewer._original?.teacher_id || reviewer.id;
      const res = await dispatch(handleEditReviewer({ id, body: fd })).unwrap();

      if (res?.status === "success" || res?.success) {
        toast.success(res?.message || "Reviewer updated successfully!");
        dispatch(handleGetAllReviewers());
        onSuccess?.();
        onCancel?.();
      } else {
        throw new Error(res?.message || "Failed to update reviewer");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to update reviewer");
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
      <Modal title={null} open={open} onCancel={handleCancel} footer={null} className="!w-full max-w-5xl" destroyOnClose>
        <div className="bg-background">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <SaveOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Edit Reviewer</h2>
            </div>
            <p className="text-gray-600">Update reviewer profile and modules.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form form={form} layout="vertical" onFinish={handleFinish} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="space-y-6">
                {/* Avatar */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" /> Profile Image
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
                      ) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-white shadow-sm"
                          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)" }}>
                          {initials(form.getFieldValue("fullName") || "NA")}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Upload {...uploadProps}><Button icon={<UploadOutlined />} className="mb-2">Change Avatar</Button></Upload>
                      <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                      {avatarPreview && avatarPreview !== getAvatarUrl(reviewer) && (
                        <Button type="link" danger size="small" onClick={() => { setAvatarFile(null); setAvatarPreview(getAvatarUrl(reviewer)); }} className="p-0 h-auto text-xs">
                          Remove Image
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" /> Basic Information
                  </h3>

                  <Form.Item label="Full Name *" name="fullName" rules={[{ required: true }, { validator: (_, v) => (!v || v.trim().length >= 2 ? Promise.resolve() : Promise.reject(new Error("Name must be at least 2 characters"))) }]}>
                    <Input placeholder="e.g., Sarah Ibrahim" />
                  </Form.Item>

                  <Form.Item label="Email *" name="email" rules={[{ required: true }, { type: "email" }]}>
                    <Input prefix={<MailOutlined className="text-gray-400 mr-2" />} placeholder="name@school.edu" />
                  </Form.Item>

                  {/* Password */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Password Update</span>
                      <Button type="link" size="small" onClick={togglePasswordFields} className="text-primary p-0 h-auto">
                        {showPasswordFields ? "Cancel Update" : "Change Password"}
                      </Button>
                    </div>
                    {showPasswordFields && (
                      <div className="space-y-3">
                        <Form.Item label="New Password" name="password" rules={passwordRules}>
                          <Input.Password placeholder="Enter new password" iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                        </Form.Item>
                        <Form.Item label="Confirm Password" name="confirmPassword" rules={confirmPasswordRules}>
                          <Input.Password placeholder="Confirm new password" iconRender={(v) => (v ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                        </Form.Item>
                      </div>
                    )}
                  </div>

                  <Form.Item label="Phone" name="phone" rules={[{ pattern: /^[0-9+\-\s]{7,}$/, message: "Enter a valid phone number" }]}>
                    <Input placeholder="+20 1X XXX XXXX" />
                  </Form.Item>

                  <Form.Item label="Qualification *" name="qualification" rules={[{ required: true }]}>
                    <Input placeholder="e.g., Masters in Mathematics" />
                  </Form.Item>

                  <Form.Item label="Notes" name="notes">
                    <TextArea rows={3} placeholder="Short bio or internal notes…" className="resize-none" />
                  </Form.Item>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" /> Professional Details
                  </h3>

                  <Form.Item label="Modules" name="subjects">
                    <Select
                      mode="multiple"
                      placeholder="Select modules"
                      options={normalizedSubjects}
                      showSearch
                      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Experience (years) *" name="experienceYears" rules={[{ required: true }]}>
                      <InputNumber min={0} max={60} className="w-full rounded-lg" placeholder="0" />
                    </Form.Item>

                    <Form.Item label="Role" name="role">
                      <Select value="reviewer" options={[{ label: "Reviewer", value: "reviewer" }]} disabled />
                    </Form.Item>
                  </div>

                  <Form.Item label="Account Status" name="accountStatus">
                    <Select
                      options={[
                        { label: "🟢 Active", value: "active" },
                        { label: "🔴 Inactive", value: "inactive" },
                      ]}
                    />
                  </Form.Item>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <TrophyOutlined className="text-primary" /> Preview
                  </h3>

                  <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)" }}>
                          {(initials(form.getFieldValue("fullName")) || "NA").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-text font-semibold">{form.getFieldValue("fullName") || "Reviewer Name"}</h4>
                        <p className="text-gray-500 text-sm">{form.getFieldValue("email") || "name@school.edu"}</p>
                        <p className="text-gray-500 text-xs">{form.getFieldValue("qualification") || "Qualification"}</p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>Experience: <span className="font-medium">{form.getFieldValue("experienceYears") || 0} years</span></p>
                      <p>Role: <span className="font-medium">reviewer</span></p>
                      <p>Account: <span className="font-medium capitalize">{form.getFieldValue("accountStatus") || "active"}</span></p>
                      <p>Modules: <span className="font-medium">{(form.getFieldValue("subjects") || []).length} selected</span></p>
                      {showPasswordFields && <p className="text-green-600 font-medium">✓ Password update pending</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-between gap-4">
                  <div className="flex gap-3">
                    <Button onClick={handleCancel} className="px-8" disabled={edit_reviewer_loading}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={edit_reviewer_loading}
                      className="px-8 bg-primary text-white"
                      icon={!edit_reviewer_loading ? <SaveOutlined /> : undefined}>
                      {edit_reviewer_loading ? "Updating..." : "Update Reviewer"}
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

export default EditReviewerModal;

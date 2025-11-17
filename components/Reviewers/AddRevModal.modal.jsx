// components/reviewers/AddReviewerModal.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  ConfigProvider,
  message,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  BookOutlined,
  MailOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { handleGetListModulesAvailable } from "../../features/modulesSlice";
import {
  handleCreateReviewer,
  handleGetAllReviewers,
} from "../../features/reviewersSlice";
import { toast } from "react-toastify";

const { TextArea } = Input;

const PALETTE = {
  primary: "#0F7490",
  background: "#F9FAFC",
  text: "#202938",
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

function AddReviewerModal({ open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const dispatch = useDispatch();

  // 🔧 FIX: slice key must be "reviewers" (ensure your store combines it as { reviewers: reviewersReducer })
  const { create_reviewer_loading } = useSelector((state) => state.reviwers);
  const { list_module_available } = useSelector((state) => state.modules);

  useEffect(() => {
    dispatch(handleGetListModulesAvailable());
  }, [dispatch]);

  const normalizedSubjects = useMemo(
    () =>
      list_module_available?.data?.modules?.map((m) => ({
        label: m.subject_name,
        value: String(m.module_id), // keep as string if backend accepts it; otherwise parseInt in handleFinish
      })) || [],
    [list_module_available]
  );

  // Avatar handling
  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj || info.file;
    if (info.file.status === "removed") {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      message.error("You can only upload image files!");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.onerror = () => message.error("Failed to read image file");
    reader.readAsDataURL(file);

    setAvatarFile(file);
  };

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("full_name", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("notes", values.notes || "");
      formData.append("experience_years", values.experienceYears);
      formData.append("qualification", values.qualification);
      formData.append("role", "reviewer");
      formData.append("password", values.password); // avoid default passwords in prod

      // 🔧 FIX: append each module id so backend receives module_ids[] properly
      (values?.subjects || []).forEach((id) => {
        formData.append("module_ids[]", id); // use parseInt(id, 10) if API expects numbers
      });

      if (avatarFile) formData.append("image", avatarFile);

      const result = await dispatch(handleCreateReviewer(formData , "reviewer")).unwrap();
      console.log(result);
      if (result?.status === "success") {
        toast.success(result?.message || "Reviewer created successfully!");
        // refresh list (carry over any filters if you use them)
        dispatch(handleGetAllReviewers({ limit: 10, offset: 0 }));
        form.resetFields();
        setAvatarFile(null);
        setAvatarPreview(null);
        onSubmit?.(result); // let parent react if needed
        onCancel?.();
      } else {
        throw new Error(result || "Failed to create reviewer");
      }
    } catch (err) {
      console.error("Error creating reviewer:", err);
      toast.error(err?.message || "Failed to create reviewer. Please try again.");
    }
  };

  const handleClose = () => {
    form.resetFields();
    setAvatarFile(null);
    setAvatarPreview(null);
    onCancel?.();
  };

  const passwordRules = [
    { required: true, message: "Please enter a password" },
    { min: 6, message: "Password must be at least 6 characters" },
  ];

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
      <Modal title={null} open={open} onCancel={handleClose} footer={null} className="!w-full max-w-5xl" destroyOnClose>
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Add New Reviewer</h2>
            </div>
            <p className="text-gray-600">Create a reviewer profile and assign subjects.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{ role: "reviewer", experienceYears: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* LEFT */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" />
                    Basic Information
                  </h3>

                  <Form.Item
                    label="Full Name *"
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
                    <Input placeholder="e.g., Ahmed Hassan" />
                  </Form.Item>

                  <Form.Item label="Email *" name="email" rules={[{ required: true }, { type: "email" }]}>
                    <Input prefix={<MailOutlined className="text-gray-400 mr-2" />} placeholder="name@school.edu" />
                  </Form.Item>

                  <Form.Item label="Password *" name="password" rules={passwordRules}>
                    <Input.Password placeholder="Enter password" />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ pattern: /^[0-9+\-\s]{7,}$/, message: "Enter a valid phone number" }]}
                  >
                    <Input placeholder="+20 1X XXX XXXX" />
                  </Form.Item>

                  <Form.Item label="Avatar">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      accept="image/*"
                      beforeUpload={() => false} // prevent auto upload
                      onChange={handleAvatarChange}
                      maxCount={1}
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <PlusOutlined />
                          <div className="mt-2 text-xs">Upload Avatar</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Professional Details
                  </h3>

                  <Form.Item label="Qualification *" name="qualification" rules={[{ required: true }]}>
                    <Input placeholder="e.g., Masters in Mathematics" />
                  </Form.Item>

                  <Form.Item label="Modules *" name="subjects" rules={[{ required: true }]}>
                    <Select
                      mode="multiple"
                      placeholder="Select subjects"
                      options={normalizedSubjects}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Experience (years) *" name="experienceYears" rules={[{ required: true }]}>
                      <InputNumber min={0} max={60} className="w-full" placeholder="0" />
                    </Form.Item>
                  </div>

                  <Form.Item label="Notes" name="notes">
                    <TextArea rows={3} placeholder="Short bio or internal notes…" className="resize-none" />
                  </Form.Item>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <TrophyOutlined className="text-primary" />
                    Preview
                  </h3>

                  <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)" }}
                        >
                          {(initials(form.getFieldValue("fullName")) || "NA").slice(0, 2)}
                        </div>
                      )}

                      <div>
                        <h4 className="text-text font-semibold">
                          {form.getFieldValue("fullName") || "Reviewer Name"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {form.getFieldValue("email") || "name@school.edu"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {form.getFieldValue("qualification") || "Qualification"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        Experience: <span className="font-medium">
                          {form.getFieldValue("experienceYears") || 0} years
                        </span>
                      </p>
                      <p>
                        Role: <span className="font-medium capitalize">
                          reviewer
                        </span>
                      </p>
                      <p>
                        Modules: <span className="font-medium">
                          {(form.getFieldValue("subjects") || []).length} selected
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button onClick={handleClose} disabled={create_reviewer_loading}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={create_reviewer_loading}
                    icon={!create_reviewer_loading ? <PlusOutlined /> : undefined}
                    className="bg-primary"
                  >
                    {create_reviewer_loading ? "Adding Reviewer..." : "Add Reviewer"}
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

export default AddReviewerModal;

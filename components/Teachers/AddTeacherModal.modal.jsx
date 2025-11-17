"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  TrophyOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  handleCreateTeacher,
  handleGetAllTeachers,
} from "../../features/teachersSlice";
import { handleGetListModulesAvailable } from "../../features/modulesSlice";
import { toast } from "react-toastify";

const { TextArea } = Input;
const { Dragger } = Upload;

const PALETTE = {
  primary: "#0F7490",
  secondary: "#C9AE6C",
  accent: "#8B5CF6",
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

function AddTeacherModal({ open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const dispatch = useDispatch();

  const { create_teacher_loading } = useSelector((state) => state.teachers);
  const { list_module_available } = useSelector((state) => state.modules);

  useEffect(() => {
    dispatch(handleGetListModulesAvailable());
  }, [dispatch]);

  const normalizedSubjects = useMemo(
    () =>
      list_module_available?.data?.modules?.map((module) => ({
        label: module.subject_name,
        value: module.module_id.toString(),
      })) || [],
    [list_module_available]
  );

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    try {
      const file = info.file;

      if (file.status === "removed") {
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }

      // Get the actual file object
      const fileObj = file.originFileObj || file;

      // Validate file object
      if (!fileObj) {
        console.error("No file object found:", file);
        message.error("No file selected or file is invalid");
        return;
      }

      // Check if it's a Blob/File
      if (!(fileObj instanceof Blob)) {
        console.error("Invalid file type:", typeof fileObj);
        message.error("Invalid file type");
        return;
      }

      const isImage = fileObj.type?.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return;
      }

      const isLt2M = fileObj.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.onerror = () => {
        message.error("Failed to read image file");
      };

      reader.readAsDataURL(fileObj);
      setAvatarFile(fileObj);
    } catch (error) {
      console.error("Error handling avatar change:", error);
      message.error("Error processing image file");
    }
  };

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();

      // Append basic information
      formData.append("full_name", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("notes", values.notes || "");
      formData.append("experience_years", values.experienceYears);
      formData.append("qualification", values.qualification);
      formData.append("role", values.role || "teacher");
      formData.append("password", values.password || "defaultPassword123"); // You might want to generate this
      formData.append("module_ids[]", JSON.stringify(values?.subjects));
      // Append avatar if exists
      if (avatarFile) {
        formData.append("image", avatarFile);
      }

      // Append module IDs as array
      // if (values.subjects && values.subjects.length > 0) {
      //   values.subjects.forEach((moduleId) => {
          
      //   });
      // }

      // Dispatch the action
      const result = await dispatch(handleCreateTeacher(formData)).unwrap();

      if (result.status === "success") {
        toast.success(result.message || "Teacher created successfully!");
        form.resetFields();
        setAvatarFile(null);
        setAvatarPreview(null);
        dispatch(handleGetAllTeachers()); // Refresh the teachers list
        onCancel?.();
      } else {
        throw new Error(result || "Failed to create teacher");
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      toast.error(
        error || "Failed to create teacher. Please try again."
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarFile(null);
    setAvatarPreview(null);
    onCancel?.();
  };

  // Add password field to the form
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
      <Modal
        title={null}
        open={open}
        onCancel={handleCancel}
        footer={null}
        className="!w-full max-w-5xl"
        destroyOnClose
      >
        <div className="bg-background">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <PlusOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Add New Teacher</h2>
            </div>
            <p className="text-gray-600">
              Create a teacher profile and assign subjects.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                role: "teacher",
                experienceYears: 1,
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Basic Information */}
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
                    label="Email *"
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
                    label="Password *"
                    name="password"
                    rules={passwordRules}
                  >
                    <Input.Password
                      placeholder="Enter password"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
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

                  <Form.Item label="Avatar">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        // Return false to prevent auto upload
                        return false;
                      }}
                      onChange={handleAvatarChange}
                      accept="image/*"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          className="w-full h-full object-cover rounded-lg"
                        />
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

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Professional Details */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <BookOutlined className="text-primary" />
                    Professional Details
                  </h3>

                  <Form.Item
                    label="Qualification *"
                    name="qualification"
                    rules={[
                      { required: true, message: "Please enter qualification" },
                    ]}
                  >
                    <Input
                      placeholder="e.g., Masters in Mathematics"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Modules *"
                    name="subjects"
                    rules={[
                      {
                        required: true,
                        message: "Select at least one subject",
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select subjects"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      label="Experience (years) *"
                      name="experienceYears"
                      rules={[
                        {
                          required: true,
                          message: "Please enter experience years",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        max={60}
                        className="w-full"
                        placeholder="0"
                      />
                    </Form.Item>

                    <Form.Item label="Role" name="role">
                      <Select
                        className="rounded-lg"
                        options={[
                          { label: "Teacher", value: "teacher" },
                          {
                            label: "Head of Department",
                            value: "head_of_department",
                          },
                          { label: "Assistant", value: "assistant" },
                          {label : "Reviewer", value:"reviewer"}
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label="Notes" name="notes">
                    <TextArea
                      rows={3}
                      placeholder="Short bio or internal notes…"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
                  </Form.Item>
                </div>

                {/* Preview Section */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <TrophyOutlined className="text-primary" />
                    Preview
                  </h3>

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
                          {(initials(form.getFieldValue("fullName")) || "NA")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="text-text font-semibold">
                          {form.getFieldValue("fullName") || "Teacher Name"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {form.getFieldValue("email") || "name@school.edu"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {form.getFieldValue("qualification") ||
                            "Qualification"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p>
                        Experience:{" "}
                        <span className="font-medium">
                          {form.getFieldValue("experienceYears") || 0} years
                        </span>
                      </p>
                      <p>
                        Role:{" "}
                        <span className="font-medium capitalize">
                          {form.getFieldValue("role") || "teacher"}
                        </span>
                      </p>
                      <p>
                        Modules:{" "}
                        <span className="font-medium">
                          {(form.getFieldValue("subjects") || []).length}{" "}
                          selected
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-end gap-4">
                  <Button
                    onClick={handleCancel}
                    className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                    disabled={create_teacher_loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={create_teacher_loading}
                    className="px-8 py-3 bg-primary text-white rounded-lg hover:!bg-[#0d5f75]"
                    icon={
                      !create_teacher_loading ? <PlusOutlined /> : undefined
                    }
                  >
                    {create_teacher_loading
                      ? "Adding Teacher..."
                      : "Add Teacher"}
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

export default AddTeacherModal;

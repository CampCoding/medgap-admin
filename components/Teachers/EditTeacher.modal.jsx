"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  ConfigProvider,
  message,
  Upload,
} from "antd";
import {
  SaveOutlined,
  DeleteOutlined,
  UserOutlined,
  BookOutlined,
  MailOutlined,
  TrophyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  handleEditTeacher,
  handleGetAllTeachers,
} from "../../features/teachersSlice";
import { handleGetListModulesAvailable } from "../../features/modulesSlice";
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
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

function EditTeacherModal({ open, onCancel, teacher, subjectOptions = [] }) {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const dispatch = useDispatch();
  const { edit_teacher_loading } = useSelector((state) => state.teachers);
  const { list_module_available } = useSelector((state) => state.modules);

  useEffect(() => {
    dispatch(handleGetListModulesAvailable());
  }, [dispatch]);

  const normalizedSubjects = useMemo(
    () =>
      list_module_available?.data?.modules?.map((module) => ({
        label: module.subject_name,
        value: module.module_id,
      })) || [],
    [list_module_available]
  );

  // Password validation rules
  const passwordRules = [
    { min: 6, message: "Password must be at least 6 characters" },
  ];

  const confirmPasswordRules = [
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("The two passwords do not match!"));
      },
    }),
  ];

  // Extract experience years from "3 years" string or use experience_years
  const getExperienceYears = (teacher) => {
    if (!teacher) return 1;
    
    // First try experience_years from _original
    if (teacher._original?.experience_years) {
      return teacher._original.experience_years;
    }
    
    // Then try to parse from experience string "3 years"
    if (teacher.experience) {
      const yearsMatch = teacher.experience.match(/(\d+)/);
      return yearsMatch ? parseInt(yearsMatch[1]) : 1;
    }
    
    return 1;
  };

  // Get avatar URL from correct field
  const getAvatarUrl = (teacher) => {
    if (!teacher) return null;
    return teacher._original?.full_image_url || teacher.avatar || teacher.full_image_url || null;
  };

  // Extract module IDs from active_modules array
  const getModuleIds = (teacher) => {
    if (!teacher) return [];
    
    // If active_modules exists and has items, extract module_ids
    if (teacher._original?.active_modules && teacher._original.active_modules.length > 0) {
      return teacher._original.active_modules.map(module => module.module_id);
    }
    
    // Fallback to subjects if available
    if (teacher.subjects && teacher.subjects.length > 0) {
      return teacher.subjects.map(v => String(v));
    }
    
    return [];
  };

  // Load teacher into form when it changes
  useEffect(() => {
    if (!teacher) return;

    const experienceYears = getExperienceYears(teacher);
    const avatarUrl = getAvatarUrl(teacher);
    const moduleIds = getModuleIds(teacher);

    console.log("Loading teacher data:", {
      teacher,
      experienceYears,
      avatarUrl,
      moduleIds,
      active_modules: teacher._original?.active_modules
    });

    form.setFieldsValue({
      fullName: teacher._original?.full_name || teacher.name || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      qualification: teacher.qualification || "",
      notes: teacher.notes || "",
      status: teacher?.status || "active",
      experienceYears: experienceYears,
      role: teacher._original?.role || "teacher",
      subjects: moduleIds,
    });

    setAvatarPreview(avatarUrl);
  }, [teacher, form]);

  // Handle avatar upload
  const handleAvatarChange = (info) => {
    const file = info.file;

    if (file.status === "removed") {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    const fileObj = file.originFileObj || file;

    if (!fileObj) {
      message.error("No file selected");
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

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
    };
    reader.readAsDataURL(fileObj);
    setAvatarFile(fileObj);
  };

  const handleFinish = async (values) => {
    if (!teacher) {
      toast.error("No teacher data available");
      return;
    }

    try {
      // Validate form values first
      await form.validateFields();

      const formData = new FormData();

      console.log("Form values:", values);
      console.log("Teacher ID:", teacher._original?.teacher_id || teacher.id);

      // Append basic information - use correct field names for backend
      formData.append("full_name", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone || "");
      formData.append("notes", values.notes || "");
      formData.append("experience_years", values.experienceYears);
      formData.append("qualification", values.qualification);
      formData.append("role", values.role || "teacher");
      formData.append("status", values.status || "active");
      
      // Handle module_ids - ensure it's always an array
      const moduleIds = values.subjects || [];
      console.log("Module IDs to submit:", moduleIds);
      
      // Try different formats for module_ids
      if (moduleIds.length > 0) {
        // Format 1: JSON string
        formData.append("module_ids", JSON.stringify(moduleIds));
        
        // Format 2: Array format (for some backends)
        moduleIds.forEach(id => {
          formData.append("module_ids[]", id);
        });
        
        // Format 3: Comma separated
        formData.append("module_ids_csv", moduleIds.join(','));
      } else {
        formData.append("module_ids", JSON.stringify([]));
      }

      // Append password only if changed
      if (values.password) {
        formData.append("password", values.password);
      }

      // Append new avatar if exists
      if (avatarFile) {
        formData.append("image", avatarFile);
      }

      // Use teacher_id from _original or id from main object
      const teacherId = teacher._original?.teacher_id || teacher.id;

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Dispatch the edit action
      const result = await dispatch(
        handleEditTeacher({
          id: teacherId,
          body: formData,
        })
      ).unwrap();

      console.log("Update result:", result);

      if (result.status === "success" || result.success) {
        toast.success(result.message || "Teacher updated successfully!");
        form.resetFields();
        setAvatarFile(null);
        setShowPasswordFields(false);
        // Reset to original avatar
        setAvatarPreview(getAvatarUrl(teacher));
        dispatch(handleGetAllTeachers()); // Refresh the teachers list
        onCancel?.();
      } else {
        throw new Error(result.message || "Failed to update teacher");
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      
      // Handle different error formats
      const errorMessage = error.message || 
                          error.response?.data?.message || 
                          error.toString() || 
                          "Failed to update teacher. Please try again.";
      
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!teacher) return;

    // Confirm deletion
    Modal.confirm({
      title: "Are you sure you want to delete this teacher?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          toast.success("Teacher deleted successfully");
          dispatch(handleGetAllTeachers());
          onCancel?.();
        } catch (error) {
          toast.error("Failed to delete teacher.");
        }
      },
    });
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    // Clear password fields when hiding
    if (showPasswordFields) {
      form.setFieldsValue({
        password: "",
        confirmPassword: "",
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    // Reset to original teacher data
    if (teacher) {
      const experienceYears = getExperienceYears(teacher);
      const avatarUrl = getAvatarUrl(teacher);
      const moduleIds = getModuleIds(teacher);
      
      form.setFieldsValue({
        fullName: teacher._original?.full_name || teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        qualification: teacher.qualification || "",
        notes: teacher.notes || "",
        experienceYears: experienceYears,
        status: teacher.status || "active",
        role: teacher._original?.role || "teacher",
        subjects: moduleIds,
      });
      setAvatarPreview(avatarUrl);
    }
    setAvatarFile(null);
    setShowPasswordFields(false);
    onCancel?.();
  };

  // Avatar upload props
  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    onChange: handleAvatarChange,
    showUploadList: false,
    accept: "image/*",
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
                <SaveOutlined className="text-white text-lg" />
              </div>
              <h2 className="text-3xl font-bold text-text">Edit Teacher</h2>
            </div>
            <p className="text-gray-600">
              Update teacher profile and assignments.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <UserOutlined className="text-primary" />
                    Profile Image
                  </h3>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="avatar"
                          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-white shadow-sm"
                          style={{
                            background:
                              "linear-gradient(135deg, #8B5CF6 0%, #0F7490 100%)",
                          }}
                        >
                          {initials(form.getFieldValue("fullName") || "NA")}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />} className="mb-2">
                          Change Avatar
                        </Button>
                      </Upload>
                      <p className="text-xs text-gray-500">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                      {avatarPreview && avatarPreview !== getAvatarUrl(teacher) && (
                        <Button 
                          type="link" 
                          danger 
                          size="small" 
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreview(getAvatarUrl(teacher));
                          }}
                          className="p-0 h-auto text-xs"
                        >
                          Remove Image
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

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

                  {/* Password Update Section */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">
                        Password Update
                      </span>
                      <Button
                        type="link"
                        size="small"
                        onClick={togglePasswordFields}
                        className="text-primary p-0 h-auto"
                      >
                        {showPasswordFields
                          ? "Cancel Update"
                          : "Change Password"}
                      </Button>
                    </div>
                    {showPasswordFields && (
                      <div className="space-y-3">
                        <Form.Item
                          label="New Password"
                          name="password"
                          rules={passwordRules}
                        >
                          <Input.Password
                            placeholder="Enter new password"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Confirm Password"
                          name="confirmPassword"
                          rules={confirmPasswordRules}
                        >
                          <Input.Password
                            placeholder="Confirm new password"
                            iconRender={(visible) =>
                              visible ? (
                                <EyeTwoTone />
                              ) : (
                                <EyeInvisibleOutlined />
                              )
                            }
                            className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary"
                          />
                        </Form.Item>
                      </div>
                    )}
                  </div>

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

                  <Form.Item label="Notes" name="notes">
                    <TextArea
                      rows={3}
                      placeholder="Short bio or internal notes…"
                      className="rounded-lg px-4 py-3 border hover:border-primary focus:border-primary resize-none"
                    />
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
                    label="Modules"
                    name="subjects"
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
                        className="w-full rounded-lg"
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
                          {label :"Reviewer" , value :"reviewer"}
                        ]}
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label="Status" name="status">
                    <Select
                      className="rounded-lg"
                      options={[
                        { label: "🟢 Active", value: "active" },
                        { label: "🔴 InActive", value: "inactive" },
                      ]}
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
                        Status:{" "}
                        <span className="font-medium capitalize">
                          {form.getFieldValue("status") || "active"}
                        </span>
                      </p>
                      <p>
                        Modules:{" "}
                        <span className="font-medium">
                          {(form.getFieldValue("subjects") || []).length}{" "}
                          selected
                        </span>
                      </p>
                      {showPasswordFields && (
                        <p className="text-green-600 font-medium">
                          ✓ Password update pending
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="lg:col-span-2 border-t border-gray-200 pt-6">
                <div className="flex justify-between gap-4">
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCancel}
                      className="px-8 py-3 text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400"
                      disabled={edit_teacher_loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={edit_teacher_loading}
                      className="px-8 py-3 bg-primary text-white rounded-lg hover:!bg-[#0d5f75]"
                      icon={
                        !edit_teacher_loading ? <SaveOutlined /> : undefined
                      }
                    >
                      {edit_teacher_loading ? "Updating..." : "Update Teacher"}
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